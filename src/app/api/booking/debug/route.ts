/**
 * GET /api/booking/debug
 *
 * Diagnostic endpoint to verify Google Calendar credentials and API connectivity.
 * Returns detailed status of each step: env vars → token refresh → free/busy → event creation.
 *
 * Protected by a simple query param: ?key=salisbury
 * Remove this endpoint once everything is confirmed working.
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CALENDAR_ID = 'cory.salisbury@gmail.com';
const TIMEZONE = 'America/Denver';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('key') !== 'salisbury') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // Step 1: Check env vars
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

  results.envVars = {
    GOOGLE_CALENDAR_CLIENT_ID: clientId ? `${clientId.substring(0, 12)}...` : 'MISSING',
    GOOGLE_CALENDAR_CLIENT_SECRET: clientSecret ? `${clientSecret.substring(0, 8)}...` : 'MISSING',
    GOOGLE_CALENDAR_REFRESH_TOKEN: refreshToken ? `${refreshToken.substring(0, 10)}...` : 'MISSING',
    GHL_API_KEY: process.env.GHL_API_KEY ? 'SET' : 'MISSING',
    GHL_LOCATION_ID: process.env.GHL_LOCATION_ID ? 'SET' : 'MISSING',
  };

  if (!clientId || !clientSecret || !refreshToken) {
    results.error = 'Missing Google Calendar credentials. Cannot proceed.';
    return NextResponse.json(results);
  }

  // Step 2: Token refresh
  try {
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

    results.tokenRefresh = {
      status: tokenRes.status,
      hasAccessToken: !!tokenData.access_token,
      scope: tokenData.scope || null,
      error: tokenData.error || null,
      errorDescription: tokenData.error_description || null,
    };

    if (!tokenData.access_token) {
      return NextResponse.json(results);
    }

    const accessToken = tokenData.access_token;

    // Step 3: Token info (check scopes)
    const infoRes = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
    const infoData = await infoRes.json();
    results.tokenInfo = {
      scope: infoData.scope,
      email: infoData.email,
      expiresIn: infoData.expires_in,
    };

    // Step 4: Free/busy check
    const today = new Date().toISOString().split('T')[0];
    const fbRes = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin: `${today}T00:00:00-06:00`,
        timeMax: `${today}T23:59:59-06:00`,
        timeZone: TIMEZONE,
        items: [{ id: CALENDAR_ID }],
      }),
    });
    const fbData = await fbRes.json();
    results.freeBusy = {
      status: fbRes.status,
      busyPeriods: fbData?.calendars?.[CALENDAR_ID]?.busy?.length ?? 0,
      calendarErrors: fbData?.calendars?.[CALENDAR_ID]?.errors || null,
      apiError: fbData.error || null,
    };

    // Step 5: Test event creation (create then delete)
    const testEvent = {
      summary: 'DEBUG TEST — safe to delete',
      start: { dateTime: '2026-12-31T11:00:00', timeZone: TIMEZONE },
      end: { dateTime: '2026-12-31T11:30:00', timeZone: TIMEZONE },
    };
    const createRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?sendUpdates=none`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEvent),
      }
    );
    const createData = await createRes.json();
    results.eventCreation = {
      status: createRes.status,
      success: !!createData.id,
      eventId: createData.id || null,
      error: createData.error || null,
    };

    // Clean up test event
    if (createData.id) {
      const delRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${createData.id}?sendUpdates=none`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
      );
      results.eventCreation = {
        ...results.eventCreation as Record<string, unknown>,
        cleanedUp: delRes.status === 204,
      };
    }

    // Step 6: Test event with attendees + Meet (like real booking)
    const meetEvent = {
      summary: 'DEBUG TEST with Meet — safe to delete',
      start: { dateTime: '2026-12-30T11:00:00', timeZone: TIMEZONE },
      end: { dateTime: '2026-12-30T12:00:00', timeZone: TIMEZONE },
      attendees: [
        { email: CALENDAR_ID },
        { email: 'cory@salisburybookkeeping.com' },
      ],
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: { type: 'hangoutsMeet' },
          requestId: `debug-${Date.now()}`,
        },
      },
    };
    const meetRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?sendUpdates=none&conferenceDataVersion=1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetEvent),
      }
    );
    const meetData = await meetRes.json();
    results.meetEventCreation = {
      status: meetRes.status,
      success: !!meetData.id,
      hasMeetLink: !!meetData.hangoutLink,
      meetLink: meetData.hangoutLink || null,
      attendees: meetData.attendees?.map((a: { email: string; responseStatus: string }) => a.email) || null,
      error: meetData.error || null,
    };

    if (meetData.id) {
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${meetData.id}?sendUpdates=none`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
      );
    }

  } catch (err) {
    results.fatalError = String(err);
  }

  return NextResponse.json(results, { status: 200 });
}
