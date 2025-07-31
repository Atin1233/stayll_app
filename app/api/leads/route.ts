import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, unitsManaged } = body;

    // Basic validation
    if (!name || !email || !unitsManaged) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
      name,
      email,
      unitsManaged,
      timestamp: new Date().toISOString(),
      source: 'Website Waitlist',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Store the lead in console (temporary storage)
    console.log('🎉 New Stayll Lead:', JSON.stringify(leadData, null, 2));

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
            text: `🎉 New Stayll Waitlist Signup!\n\n👤 Name: ${name}\n📧 Email: ${email}\n🏠 Units: ${unitsManaged}\n⏰ Time: ${new Date().toLocaleString()}\n🌐 Source: Website Waitlist`,
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
            first_name: name.split(' ')[0],
            fields: { 
              units_managed: unitsManaged,
              full_name: name,
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
              FNAME: name.split(' ')[0],
              LNAME: name.split(' ').slice(1).join(' ') || '',
              UNITS: unitsManaged
            },
            tags: ['Website Waitlist', 'Stayll Beta']
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
            client_id: leadData.ip, // Simple client ID
            events: [{
              name: 'lead_signup',
              params: {
                lead_source: 'website_waitlist',
                units_managed: unitsManaged,
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
        message: 'Successfully joined the waitlist!',
        leadId: Date.now().toString() // Simple lead ID
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