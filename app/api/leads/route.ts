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
    };

    // Store the lead (for now, we'll just log it)
    // In production, you'd want to store this in a database
    console.log('New lead signup:', leadData);

    // Send email notification (optional - using webhook approach)
    // You can set up a webhook URL in your environment variables
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `🎉 New Stayll Waitlist Signup!\n\nName: ${name}\nEmail: ${email}\nUnits Managed: ${unitsManaged}\nTime: ${new Date().toLocaleString()}`,
            leadData,
          }),
        });
      } catch (webhookError) {
        console.error('Webhook notification failed:', webhookError);
        // Don't fail the whole request if webhook fails
      }
    }

    // TODO: Add to email marketing service (ConvertKit, Mailchimp, etc.)
    // Example ConvertKit integration:
    // const convertKitResponse = await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     api_key: process.env.CONVERTKIT_API_KEY,
    //     email: email,
    //     first_name: name.split(' ')[0],
    //     fields: { units_managed: unitsManaged }
    //   })
    // });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined the waitlist!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 