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

    // Analyze the PDF with STAYLL
    console.log('Starting STAYLL analysis for file:', file.name, 'Size:', file.size);
    const analysis = await analyzeLeasePDF(file);
    console.log('STAYLL analysis result:', analysis);

    if (!analysis.success) {
      console.error('STAYLL analysis failed:', analysis.errors);
      const errorMessage = analysis.errors && analysis.errors.length > 0 
        ? analysis.errors.join(', ') 
        : 'Unknown STAYLL analysis error';
      return NextResponse.json(
        { error: `Failed to analyze PDF: ${errorMessage}`, details: analysis.errors },
        { status: 500 }
      );
    }

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Storage service not configured' },
        { status: 500 }
      );
    }

    // Check if the leases bucket exists
    console.log('Checking if leases bucket exists...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error checking buckets:', bucketsError);
      return NextResponse.json(
        { error: `Storage access error: ${bucketsError.message}` },
        { status: 500 }
      );
    }

    const leasesBucket = buckets?.find(bucket => bucket.name === 'leases');
    if (!leasesBucket) {
      console.error('Leases bucket not found. Available buckets:', buckets?.map(b => b.name));
      return NextResponse.json(
        { error: 'Leases bucket not found. Please create a bucket named "leases" in Supabase storage.' },
        { status: 500 }
      );
    }

    console.log('Uploading file to leases bucket...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('leases')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: `Failed to upload file: ${uploadError.message}`, details: uploadError },
        { status: 500 }
      );
    }

    // Extract basic lease data for database storage
    const basicData = analysis.data;
    
    // Save complete lease data to database with full STAYLL analysis
    const leaseData = {
      user_id: userId,
      tenant_name: basicData.tenant_name || 'Unknown',
      property_address: basicData.property_address || 'Unknown',
      monthly_rent: basicData.base_rent || '$0',
      lease_start: basicData.lease_start || new Date().toISOString().split('T')[0],
      lease_end: basicData.lease_end || '2025-12-31',
      due_date: basicData.due_date || '1st of each month',
      late_fee: basicData.late_fee || '$50',
      security_deposit: basicData.security_deposit || 'Not specified',
      utilities: basicData.utilities || 'Not specified',
      parking: basicData.parking || 'Not specified',
      pets: basicData.pets || 'Not specified',
      smoking: basicData.smoking || 'Not specified',
      file_url: uploadData?.path || '',
      file_name: file.name,
      file_size: file.size,
      confidence_score: analysis.confidence,
      // Store complete STAYLL analysis data
      analysis_data: {
        lease_summary: analysis.data.lease_summary,
        clause_analysis: analysis.data.clause_analysis,
        risk_analysis: analysis.data.risk_analysis,
        action_items: analysis.data.action_items,
        market_insights: analysis.data.market_insights,
        format_analysis: analysis.data.format_analysis,
        confidence_score: analysis.confidence
      },
      // Store portfolio impact analysis
      portfolio_impact: analysis.data.portfolio_impact || null,
      // Store compliance assessment
      compliance_assessment: analysis.data.compliance_assessment || null,
      // Store strategic recommendations
      strategic_recommendations: analysis.data.strategic_recommendations || null,
      created_at: new Date().toISOString(),
    };

    console.log('Saving lease data to database...');
    const { data: dbData, error: dbError } = await supabase
      .from('leases')
      .insert([leaseData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save lease data to database', details: dbError },
        { status: 500 }
      );
    }

    console.log('Lease data saved successfully:', dbData.id);

    return NextResponse.json({
      success: true,
      lease: dbData,
      analysis: {
        confidence: analysis.confidence,
        extracted_fields: Object.keys(basicData).filter(key => basicData[key as keyof typeof basicData]),
        portfolio_impact: analysis.data.portfolio_impact ? 'Available' : 'Not available',
        compliance_assessment: analysis.data.compliance_assessment ? 'Available' : 'Not available',
        strategic_recommendations: analysis.data.strategic_recommendations ? 'Available' : 'Not available'
      },
      file_info: {
        name: file.name,
        size: file.size,
        uploaded_path: uploadData?.path
      }
    });

  } catch (error) {
    console.error('STAYLL lease analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
} 