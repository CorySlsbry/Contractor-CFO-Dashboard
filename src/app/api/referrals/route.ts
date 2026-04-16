import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';

/**
 * POST /api/referrals
 *
 * Captures a referral event from the ReferralModal / signup page.
 * Validates emails (format + MX record check), blocks disposable domains,
 * then logs the referral. When a referrals table is added to Supabase
 * (or we wire GHL workflow enrollment), this route will persist the
 * record and fire invite emails to the 2 friends.
 *
 * Body: { userEmail, friend1, friend2, plan, planName }
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','tempmail.com','throwaway.email','yopmail.com',
  'sharklasers.com','guerrillamailblock.com','grr.la','dispostable.com','trashmail.com',
  'fakeinbox.com','temp-mail.org','getnada.com','maildrop.cc','10minutemail.com',
  'minutemail.com','emailondeck.com','mailnesia.com','tempail.com','mohmal.com',
  'mailnator.com','maildrop.me','guerrillamail.info','trash-mail.com','tempr.email',
]);

function validEmailFormat(e: unknown): e is string {
  return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function getDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}

/** Check if the email domain has MX records (i.e. can receive mail) */
async function hasMxRecords(domain: string): Promise<boolean> {
  try {
    const records = await new Promise<dns.MxRecord[]>((resolve, reject) => {
      dns.resolveMx(domain, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses || []);
      });
    });
    return records.length > 0;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, friend1, friend2, plan, planName } = body ?? {};

    // 1. Format validation
    if (!validEmailFormat(userEmail) || !validEmailFormat(friend1) || !validEmailFormat(friend2)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter valid email addresses.' },
        { status: 400 }
      );
    }

    // 2. Duplicate checks
    const emails = [userEmail.toLowerCase(), friend1.toLowerCase(), friend2.toLowerCase()];
    if (emails[1] === emails[2]) {
      return NextResponse.json(
        { ok: false, error: 'Friend emails must be different.' },
        { status: 400 }
      );
    }
    if (emails[0] === emails[1] || emails[0] === emails[2]) {
      return NextResponse.json(
        { ok: false, error: "You can't refer yourself — enter your friends' emails." },
        { status: 400 }
      );
    }

    // 3. Disposable email check
    const domains = emails.map(getDomain);
    for (const domain of domains) {
      if (DISPOSABLE_DOMAINS.has(domain)) {
        return NextResponse.json(
          { ok: false, error: 'Temporary or disposable email addresses are not allowed. Please use a real email.' },
          { status: 400 }
        );
      }
    }

    // 4. Same-domain fraud check (all 3 emails same domain = suspicious)
    if (domains[0] === domains[1] && domains[1] === domains[2]) {
      // Allow common providers like gmail, outlook, yahoo
      const commonProviders = new Set(['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'aol.com', 'protonmail.com', 'live.com']);
      if (!commonProviders.has(domains[0])) {
        return NextResponse.json(
          { ok: false, error: 'All 3 emails share the same company domain. Friend emails should belong to different people.' },
          { status: 400 }
        );
      }
    }

    // 5. MX record verification (does the domain actually receive email?)
    const uniqueDomains = [...new Set(domains)];
    for (const domain of uniqueDomains) {
      const hasMx = await hasMxRecords(domain);
      if (!hasMx) {
        return NextResponse.json(
          { ok: false, error: `The email domain "${domain}" doesn't appear to accept emails. Please use a real email address.` },
          { status: 400 }
        );
      }
    }

    // All checks passed — log the referral
    console.log('[referrals] new referral captured', {
      userEmail,
      friend1,
      friend2,
      plan,
      planName,
      domains: uniqueDomains,
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
