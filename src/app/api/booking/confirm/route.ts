/**
 * POST /api/booking/confirm
 *
 * Confirms a booking:
 * 1. Creates a Google Calendar event on cory.salisbury@gmail.com
 * 2. Creates/updates a GHL contact tagged "scope-call-booked"
 * 3. Returns confirmation
 *
 * Body: { name, email, company?, start, end }
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TIMEZONE = 'America/Denver';
const CALENDAR_ID = 'cory.salisbury@gmail.com';
const OWNER_EMAIL = 'cory@salisburybookkeeping.com';

interface BookingPayload {
  name: string;
  email: string;
  company?: string;
  start: string; // e.g. "2026-04-02T09:00:00"
  end: string;
}

/**
 * Create a Google Calendar event via OAuth2
 */
async function createCalendarEvent(payload: BookingPayload): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('[booking/confirm] Google Calendar credentials not configured — skipping event creation');
    return { success: false, error: 'Calendar not configured' };
  }

  try {
    // Get access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return { success: false, error: 'Failed to get access token' };
    }

    const companyStr = payload.company ? ` (${payload.company})` : '';

    // Create the event
    const eventRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?sendUpdates=all&conferenceDataVersion=1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: `BuilderCFO Scope Call — ${payload.name}${companyStr}`,
          description: [
            `Scope call booked via topbuildercfo.com`,
            ``,
            `Name: ${payload.name}`,
            `Email: ${payload.email}`,
            payload.company ? `Company: ${payload.company}` : null,
            ``,
            `This is a free 15-minute call to review their QuickBooks and show what BuilderCFO can do.`,
          ].filter(Boolean).join('\n'),
          start: {
            dateTime: `${payload.start}`,
            timeZone: TIMEZONE,
          },
          end: {
            dateTime: `${payload.end}`,
            timeZone: TIMEZONE,
          },
          attendees: [
            { email: OWNER_EMAIL, organizer: true },
            { email: payload.email, displayName: payload.name },
          ],
          conferenceData: {
            createRequest: {
              conferenceSolutionKey: { type: 'hangoutsMeet' },
              requestId: `buildercfo-${Date.now()}`,
            },
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 30 },
              { method: 'email', minutes: 60 },
            ],
          },
        }),
      }
    );

    const eventData = await eventRes.json();
    if (eventData.id) {
      console.log(`[booking/confirm] Google Calendar event created: ${eventData.id}`);
      return { success: true, eventId: eventData.id };
    } else {
      console.error('[booking/confirm] Google Calendar event creation failed:', eventData);
      return { success: false, error: eventData.error?.message || 'Event creation failed' };
    }
  } catch (err) {
    console.error('[booking/confirm] Google Calendar error:', err);
    return { success: false, error: 'Calendar API error' };
  }
}

/**
 * Create/update a GHL contact tagged for the scope call workflow
 */
async function pushToGHL(payload: BookingPayload): Promise<{ success: boolean }> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.warn('[booking/confirm] GHL credentials not configured — skipping contact push');
    return { success: false };
  }

  try {
    const [firstName, ...lastParts] = payload.name.split(' ');
    const lastName = lastParts.join(' ') || '';

    const res = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        email: payload.email,
        companyName: payload.company || undefined,
        tags: ['scope-call-booked', 'buildercfo-landing'],
        source: 'BuilderCFO Website',
      }),
    });

    const data = await res.json();
    console.log(`[booking/confirm] GHL contact created/updated: ${data?.contact?.id || 'unknown'}`);
    return { success: true };
  } catch (err) {
    console.error('[booking/confirm] GHL push failed:', err);
    return { success: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json();

    // Validate
    if (!body.name || !body.email || !body.start || !body.end) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }
    if (!body.email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'Invalid email.' }, { status: 400 });
    }

    // Run both in parallel
    const [calResult, ghlResult] = await Promise.all([
      createCalendarEvent(body),
      pushToGHL(body),
    ]);

    // Even if GHL fails, the booking is still valid if calendar succeeded (or if we're in fallback mode)
    return NextResponse.json({
      ok: true,
      calendarEvent: calResult.success,
      ghlContact: ghlResult.success,
    });
  } catch (err) {
    console.error('[booking/confirm] Error:', err);
    return NextResponse.json({ ok: false, error: 'Booking failed.' }, { status: 500 });
  }
}
