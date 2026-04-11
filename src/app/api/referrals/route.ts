import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/referrals
 *
 * Captures a referral event from the ReferralModal on the landing page.
 * Non-blocking for the caller: even if this fails or returns a non-200,
 * the modal proceeds to /signup with the REFER20 discount already set
 * in localStorage and URL params.
 *
 * Body: { userEmail, friend1, friend2, plan, planName }
 *
 * Current behavior: logs the payload and returns success. When a referrals
 * table is added to Supabase (or we wire GHL workflow enrollment), this
 * route will persist the record and fire invite emails to the 2 friends.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, friend1, friend2, plan, planName } = body ?? {};

    const validEmail = (e: unknown) =>
      typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    if (!validEmail(userEmail) || !validEmail(friend1) || !validEmail(friend2)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email(s).' },
        { status: 400 }
      );
    }

    // TODO: persist to Supabase `referrals` table and trigger invite emails.
    // For now, log so we can verify end-to-end in Vercel runtime logs.
    console.log('[referrals] new referral captured', {
      userEmail,
      friend1,
      friend2,
      plan,
      planName,
      at: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      discount: 'REFER20',
      plan,
      planName,
    });
  } catch (err) {
    console.error('[referrals] POST failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
