import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const role = formData.get('role') as string;
    const leaseCount = formData.get('leaseCount') as string;
    const file = formData.get('file') as File | null;

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create lead data
    const leadData = {
      email,
      company: company || 'Not provided',
      role: role || 'Not provided',
      leaseCount: leaseCount || 'Not provided',
      hasFile: !!file,
      fileName: file ? file.name : null,
      timestamp: new Date().toISOString(),
      source: 'AI Lease Analyst Early Access',
    };

    // Store the lead in console (temporary storage)
    console.log('🎉 New Stayll Lease Analyst Lead:', JSON.stringify(leadData, null, 2));

    // Handle file upload if provided
    if (file) {
      console.log('📄 File uploaded:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      // In production, you'd want to store this in a cloud storage service
      // For now, we'll just log the file details
    }

    // 1. SEND NOTIFICATIONS
    // Send webhook notification (Slack, Discord, etc.)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `🎉 New Stayll Lease Analyst Signup!\n\n📧 Email: ${email}\n🏢 Company: ${company || 'Not provided'}\n👤 Role: ${role || 'Not provided'}\n📋 Leases: ${leaseCount || 'Not provided'}\n📄 File: ${file ? 'Yes' : 'No'}\n⏰ Time: ${new Date().toLocaleString()}\n🌐 Source: AI Lease Analyst Early Access`,
            leadData,
          }),
        });
        console.log('✅ Webhook notification sent');
      } catch (webhookError) {
        console.error('❌ Webhook notification failed:', webhookError);
      }
    }

    // 2. EMAIL MARKETING INTEGRATION
    // ConvertKit integration (most popular for creators)
    const convertKitApiKey = process.env.CONVERTKIT_API_KEY;
    const convertKitFormId = process.env.CONVERTKIT_FORM_ID;
    
    if (convertKitApiKey && convertKitFormId) {
      try {
        const convertKitResponse = await fetch(`https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            api_key: convertKitApiKey,
            email: email,
            fields: { 
              company: company || '',
              role: role || '',
              lease_count: leaseCount || '',
              has_file: !!file,
              signup_date: new Date().toISOString()
            }
          })
        });

        if (convertKitResponse.ok) {
          console.log('✅ ConvertKit subscription successful');
        } else {
          console.error('❌ ConvertKit subscription failed:', await convertKitResponse.text());
        }
      } catch (convertKitError) {
        console.error('❌ ConvertKit error:', convertKitError);
      }
    }

    // 3. ALTERNATIVE: Mailchimp integration
    const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
    const mailchimpListId = process.env.MAILCHIMP_LIST_ID;
    
    if (mailchimpApiKey && mailchimpListId) {
      try {
        const mailchimpDataCenter = mailchimpApiKey.split('-')[1];
        const mailchimpResponse = await fetch(`https://${mailchimpDataCenter}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mailchimpApiKey}`
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            merge_fields: {
              COMPANY: company || '',
              ROLE: role || '',
              LEASECOUNT: leaseCount || '',
              HASFILE: file ? 'Yes' : 'No'
            },
            tags: ['AI Lease Analyst', 'Early Access', 'Stayll Beta']
          })
        });

        if (mailchimpResponse.ok) {
          console.log('✅ Mailchimp subscription successful');
        } else {
          console.error('❌ Mailchimp subscription failed:', await mailchimpResponse.text());
        }
      } catch (mailchimpError) {
        console.error('❌ Mailchimp error:', mailchimpError);
      }
    }

    // 4. ANALYTICS TRACKING
    // Google Analytics 4 event (if configured)
    const ga4MeasurementId = process.env.GA4_MEASUREMENT_ID;
    if (ga4MeasurementId) {
      try {
        await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${ga4MeasurementId}&api_secret=${process.env.GA4_API_SECRET}`, {
          method: 'POST',
          body: JSON.stringify({
            client_id: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            events: [{
              name: 'lease_analyst_signup',
              params: {
                lead_source: 'ai_lease_analyst_early_access',
                role: role || 'unknown',
                lease_count: leaseCount || 'unknown',
                has_file: !!file,
                value: 1
              }
            }]
          })
        });
        console.log('✅ Google Analytics event sent');
      } catch (gaError) {
        console.error('❌ Google Analytics error:', gaError);
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined the early access list!',
        leadId: Date.now().toString(),
        hasFile: !!file
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 