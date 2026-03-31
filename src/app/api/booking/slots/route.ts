/**
 * GET /api/booking/slots?date=2026-03-31
 *
 * Returns available 30-minute booking slots for a given date.
 *
 * Business hours: Mon–Fri 9 AM – 4:30 PM Mountain Time
 * Slot duration: 30 minutes
 *
 * If GOOGLE_CALENDAR_* env vars are set, performs a free/busy check
 * against cory.salisbury@gmail.com to exclude booked times.
 * Otherwise returns all business-hour slots (manual fallback).
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TIMEZONE = 'America/Denver';
const SLOT_MINUTES = 30;
const START_HOUR = 9;   // 9 AM
const END_HOUR = 17;    // 5 PM (last slot starts at 4:30)
const CALENDAR_ID = 'cory.salisbury@gmail.com';

interface Slot {
  start: string;
  end: string;
  label: string;
}

/**
 * Generate all potential slots for a given date
 */
function generateSlots(dateStr: string): Slot[] {
  const slots: Slot[] = [];

  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    for (let min = 0; min < 60; min += SLOT_MINUTES) {
      // Don't create a slot that would end after END_HOUR
      const endMin = min + SLOT_MINUTES;
      const endHour = hour + Math.floor(endMin / 60);
      const endMinRem = endMin % 60;
      if (endHour > END_HOUR || (endHour === END_HOUR && endMinRem > 0)) continue;

      const startDT = `${dateStr}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`;
      const endDT = `${dateStr}T${String(endHour).padStart(2, '0')}:${String(endMinRem).padStart(2, '0')}:00`;

      // Human-readable label
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const label = `${displayHour}:${String(min).padStart(2, '0')} ${ampm}`;

      slots.push({ start: startDT, end: endDT, label });
    }
  }

  return slots;
}

/**
 * Optional: call Google Calendar API to check busy times
 */
async function getBusyPeriods(dateStr: string): Promise<{ start: string; end: string }[]> {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return []; // No credentials — return no busy periods (all slots available)
  }

  try {
    // Get access token from refresh token
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
    if (!tokenData.access_token) return [];

    // Free/busy query
    const timeMin = `${dateStr}T${String(START_HOUR).padStart(2, '0')}:00:00`;
    const timeMax = `${dateStr}T${String(END_HOUR).padStart(2, '0')}:00:00`;

    const fbRes = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin: `${timeMin}-07:00`,
        timeMax: `${timeMax}-07:00`,
        timeZone: TIMEZONE,
        items: [{ id: CALENDAR_ID }],
      }),
    });
    const fbData = await fbRes.json();
    const busy = fbData?.calendars?.[CALENDAR_ID]?.busy || [];
    return busy;
  } catch (err) {
    console.error('[booking/slots] Google Calendar free/busy check failed:', err);
    return [];
  }
}

/**
 * Check if a slot overlaps any busy period
 */
function isSlotBusy(slot: Slot, busyPeriods: { start: string; end: string }[], dateStr: string): boolean {
  for (const busy of busyPeriods) {
    const busyStart = new Date(busy.start).getTime();
    const busyEnd = new Date(busy.end).getTime();
    // Reconstruct slot times with timezone offset for comparison
    const slotStart = new Date(`${slot.start}-07:00`).getTime();
    const slotEnd = new Date(`${slot.end}-07:00`).getTime();

    // Overlap check: slot starts before busy ends AND slot ends after busy starts
    if (slotStart < busyEnd && slotEnd > busyStart) {
      return true;
    }
  }
  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: 'Invalid date. Use YYYY-MM-DD.' }, { status: 400 });
  }

  // Check if date is a weekday
  const date = new Date(`${dateStr}T12:00:00`);
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return NextResponse.json({ slots: [] });
  }

  // Check if date is in the past
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: TIMEZONE });
  if (dateStr < todayStr) {
    return NextResponse.json({ slots: [] });
  }

  // Generate all possible slots
  let allSlots = generateSlots(dateStr);

  // Filter out past slots if today
  if (dateStr === todayStr) {
    const nowMT = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }));
    const nowHour = nowMT.getHours();
    const nowMin = nowMT.getMinutes();
    // Only show slots starting at least 1 hour from now
    allSlots = allSlots.filter(slot => {
      const [h, m] = slot.start.split('T')[1].split(':').map(Number);
      return h > nowHour + 1 || (h === nowHour + 1 && m >= nowMin);
    });
  }

  // Check Google Calendar for busy periods
  const busyPeriods = await getBusyPeriods(dateStr);
  if (busyPeriods.length > 0) {
    allSlots = allSlots.filter(slot => !isSlotBusy(slot, busyPeriods, dateStr));
  }

  return NextResponse.json({ slots: allSlots });
}
