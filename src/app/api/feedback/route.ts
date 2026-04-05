import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { message, userName, companyName } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Store feedback in Supabase
    await supabase.from('feedback').insert({
      message: message.trim(),
      user_name: userName || 'Unknown',
      company_name: companyName || 'Unknown',
    });

    // Send email via Resend or fall back to mailto approach
    // For now, we use a simple fetch to a mail endpoint
    // This can be upgraded to Resend/SendGrid/SES later
    const emailBody = `
New BuilderCFO Feedback

From: ${userName || 'Unknown'} (${companyName || 'Unknown'})
Date: ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })}

Message:
${message.trim()}

---
Sent from BuilderCFO Dashboard feedback form
    `.trim();

    // Try sending via Resend if API key is available
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BuilderCFO <feedback@topbuildercfo.com>',
          to: ['info@salisburybookkeeping.com'],
          subject: `BuilderCFO Feedback from ${userName || 'a user'} at ${companyName || 'unknown company'}`,
          text: emailBody,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 });
  }
}
