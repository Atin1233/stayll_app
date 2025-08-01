import { NextRequest, NextResponse } from 'next/server';
import { analyzeLeasePDF } from '@/lib/leaseAnalysis';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Analyze the PDF
    const analysis = await analyzeLeasePDF(file);

    if (!analysis.success) {
      return NextResponse.json(
        { error: 'Failed to analyze PDF', details: analysis.errors },
        { status: 500 }
      );
    }

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase?.storage
      .from('leases')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Save lease data to database
    const leaseData = {
      user_id: userId,
      tenant_name: analysis.data.tenant_name || 'Unknown',
      property_address: analysis.data.property_address || 'Unknown',
      monthly_rent: analysis.data.monthly_rent || '$0',
      lease_start: analysis.data.lease_start || new Date().toISOString().split('T')[0],
      lease_end: analysis.data.lease_end || '2025-12-31',
      due_date: analysis.data.due_date || '1st of each month',
      late_fee: analysis.data.late_fee || '$50',
      security_deposit: analysis.data.security_deposit || 'Not specified',
      utilities: analysis.data.utilities || 'Not specified',
      parking: analysis.data.parking || 'Not specified',
      pets: analysis.data.pets || 'Not specified',
      smoking: analysis.data.smoking || 'Not specified',
      file_url: uploadData?.path || '',
      confidence_score: analysis.confidence,
      created_at: new Date().toISOString(),
    };

    const { data: dbData, error: dbError } = await supabase
      ?.from('leases')
      .insert([leaseData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save lease data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lease: dbData,
      analysis: {
        confidence: analysis.confidence,
        extracted_fields: Object.keys(analysis.data).filter(key => analysis.data[key as keyof typeof analysis.data]),
      },
    });

  } catch (error) {
    console.error('Lease analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 