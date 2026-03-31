/**
 * POST /api/booking/confirm
 *
 * Confirms a booking:
 * 1. Creates a Google Calendar event on cory.salisbury@gmail.com
 *    with Google Meet link — sends invite emails to all parties
 * 2. Creates/updates a GHL contact tagged "scope-call-booked"
 * 3. Returns confirmation with calendar + GHL status
 *
 * Body: { name, email, company?, start, end }
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TIMEZONE = 'America/Denver';
const CALENDAR_ID = 'cory.salisbury@gmail.com';
const OWNER_EMAIL = 'cory@salisburybookkeeping.com';
const BLOCK_MINUTES = 60; // 30 min call + 30 min buffer

interface BookingPayload {
  name: string;
  email: string;
  company?: string;
  start: string; // e.g. "2026-04-02T11:00:00"
  end: string;
}

/**
 * Get an OAuth2 access token from the refresh token
 */
async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error('[booking/confirm] Missing Google Calendar env vars:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRefreshToken: !!refreshToken,
    });
    return null;
  }

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
    console.error('[booking/confirm] Token refresh failed:', {
      status: tokenRes.status,
      error: tokenData.error,
      description: tokenData.error_description,
    });
    return null;
  }

  return tokenData.access_token;
}

/**
 * Create a Google Calendar event via OAuth2
 */
async function createCalendarEvent(payload: BookingPayload): Promise<{ success: boolean; eventId?: string; meetLink?: string; error?: string }> {
  let accessToken: string | null;
  try {
    accessToken = await getAccessToken();
  } catch (err) {
    console.error('[booking/confirm] Token fetch threw:', err);
    return { success: false, error: 'Failed to authenticate with Google' };
  }

  if (!accessToken) {
    return { success: false, error: 'Calendar not configured or auth failed' };
  }

  try {
    const companyStr = payload.company ? ` (${payload.company})` : '';

    // Calculate the block end time (30 min call + 30 min buffer = 60 min total)
    // We work with the raw datetime string and add minutes manually to avoid
    // timezone conversion issues on servers running in UTC
    const [datePart, timePart] = payload.start.split('T');
    const [startH, startM] = timePart.split(':').map(Number);
    const totalMinutes = startH * 60 + startM + BLOCK_MINUTES;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const blockEnd = `${datePart}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    const eventBody = {
      summary: `BuilderCFO Scope Call — ${payload.name}${companyStr}`,
      description: [
        `Scope call booked via topbuildercfo.com`,
        ``,
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        payload.company ? `Company: ${payload.company}` : null,
        ``,
        `30-minute scope call + 30-minute buffer.`,
        `Review their QuickBooks and show what BuilderCFO can do.`,
      ].filter(Boolean).join('\n'),
      start: {
        dateTime: payload.start,
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: blockEnd,
        timeZone: TIMEZONE,
      },
      // Attendees: include calendar owner, business email, AND prospect
      // Google sends invite emails to all attendees via sendUpdates=all
      attendees: [
        { email: CALENDAR_ID },           // cory.salisbury@gmail.com (calendar owner — gets notification)
        { email: OWNER_EMAIL },            // cory@salisburybookkeeping.com (business email)
        { email: payload.email, displayName: payload.name }, // prospect
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
      guestsCanSeeOtherGuests: false, // Prospects shouldn't see Cory's other emails
    };

    console.log('[booking/confirm] Creating calendar event:', {
      summary: eventBody.summary,
      start: eventBody.start,
      end: eventBody.end,
      attendees: eventBody.attendees.map(a => a.email),
    });

    const eventRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?sendUpdates=all&conferenceDataVersion=1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      }
    );

    const eventData = await eventRes.json();

    if (!eventRes.ok || !eventData.id) {
      console.error('[booking/confirm] Event creation failed:', {
        status: eventRes.status,
        error: eventData.error,
        message: eventData.error?.message,
        errors: eventData.error?.errors,
      });
      return { success: false, error: eventData.error?.message || `HTTP ${eventRes.status}` };
    }

    console.log('[booking/confirm] Event created successfully:', {
      eventId: eventData.id,
      htmlLink: eventData.htmlLink,
      meetLink: eventData.hangoutLink,
      attendees: eventData.attendees?.length,
    });

    return {
      success: true,
      eventId: eventData.id,
      meetLink: eventData.hangoutLink || undefined,
    };
  } catch (err) {
    console.error('[booking/confirm] Calendar event creation threw:', err);
    return { success: false, error: 'Calendar API error' };
  }
}

/**
 * Create/update a GHL contact tagged for the scope call workflow
 */
async function pushToGHL(payload: BookingPayload): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.warn('[booking/confirm] GHL credentials not configured — skipping contact push');
    return { success: false, error: 'GHL not configured' };
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
    if (!res.ok) {
      console.error('[booking/confirm] GHL push failed:', { status: res.status, data });
      return { success: false, error: `GHL HTTP ${res.status}` };
    }

    console.log(`[booking/confirm] GHL contact created/updated: ${data?.contact?.id || 'unknown'}`);
    return { success: true };
  } catch (err) {
    console.error('[booking/confirm] GHL push threw:', err);
    return { success: false, error: 'GHL API error' };
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

    console.log('[booking/confirm] Results:', {
      calendar: calResult.success ? 'OK' : calResult.error,
      ghl: ghlResult.success ? 'OK' : ghlResult.error,
    });

    return NextResponse.json({
      ok: true,
      calendarEvent: calResult.success,
      calendarError: calResult.success ? undefined : calResult.error,
      meetLink: calResult.meetLink,
      ghlContact: ghlResult.success,
    });
  } catch (err) {
    console.error('[booking/confirm] Error:', err);
    return NextResponse.json({ ok: false, error: 'Booking failed.' }, { status: 500 });
  }
}
