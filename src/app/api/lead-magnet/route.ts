/**
 * Lead Magnet Capture API
 * POST /api/lead-magnet
 *
 * Captures email + name from the landing page lead magnet form,
 * stores in Supabase, and creates a contact in GoHighLevel with
 * the "buildercfo-lead-magnet" tag for workflow enrollment.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GHL_API_KEY = process.env.GHL_API_KEY || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'd6snrvwPYgsUbjfj6Dox';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // 1. Store in Supabase (lead_captures table)
    const { error: dbError } = await supabase.from('lead_captures').insert({
      email: email.toLowerCase().trim(),
      first_name: firstName?.trim() || null,
      source: source || 'ai-prompts-lead-magnet',
      captured_at: new Date().toISOString(),
    });

    // Don't fail if table doesn't exist yet — log and continue
    if (dbError) {
      console.warn('Supabase lead_captures insert warning:', dbError.message);
    }

    // 2. Also track as an analytics event
    await supabase.from('page_analytics').insert({
      event: 'lead_magnet_capture',
      page: '/',
      referrer: null,
      utm_source: source || 'landing-page',
      utm_medium: 'lead-magnet',
      utm_campaign: 'ai-prompts',
      user_agent: request.headers.get('user-agent') || null,
      ip_hash: null,
    }).catch(() => {}); // Silent fail for analytics

    // 3. Create/update contact in GoHighLevel
    if (GHL_API_KEY) {
      try {
        const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
          },
          body: JSON.stringify({
            locationId: GHL_LOCATION_ID,
            email: email.toLowerCase().trim(),
            firstName: firstName?.trim() || undefined,
            tags: ['buildercfo-lead-magnet'],
            source: 'BuilderCFO Lead Magnet',
          }),
        });

        if (!ghlRes.ok) {
          console.warn('GHL contact creation warning:', await ghlRes.text());
        }
      } catch (ghlErr) {
        console.warn('GHL API error:', ghlErr);
      }
    }

    return NextResponse.json({
      ok: true,
      downloadUrl: '/BuilderCFO-AI-Prompts-for-Contractors.pdf',
    });
  } catch (error) {
    console.error('Lead magnet capture error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
