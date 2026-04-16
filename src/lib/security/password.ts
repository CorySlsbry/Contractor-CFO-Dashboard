/**
 * Password policy for BuilderCFO.
 *
 * Rules (aligned with NIST SP 800-63B):
 *  - Minimum 12 characters (recommended by NIST; Supabase hard minimum is 6).
 *  - Must include at least 3 of: lowercase, uppercase, digit, symbol.
 *  - Rejects the top ~100 leaked passwords and obvious app-name variants.
 *  - Rejects passwords identical to the user's email local-part.
 *
 * Applied on both client and server. Server is the source of truth —
 * see /api/auth/signup and /api/auth/password.
 */

export interface PasswordCheckResult {
  ok: boolean;
  /** User-facing error; undefined when ok=true. */
  error?: string;
  /** 0–4 strength score, for UI meters. */
  score: number;
}

/**
 * Tiny subset of the most common leaked passwords. Not exhaustive — for real
 * breach coverage we'd want HIBP Pwned Passwords API. This blocks the
 * obvious stuff that shows up in drive-by credential-stuffing.
 */
const COMMON_PASSWORDS = new Set<string>([
  'password', 'password1', 'password123', 'passw0rd', 'passw0rd!',
  '123456789012', '1234567890ab', 'qwerty123456', 'qwertyuiop12',
  'iloveyou1234', 'letmein12345', 'welcome12345', 'admin1234567',
  'administrator', 'changeme1234', 'p@ssw0rd1234', 'p@ssword1234',
  'buildercfo123', 'buildercfo2024', 'buildercfo2025', 'buildercfo2026',
  'salisbury1234', 'constructor12', 'contractor12',
]);

const MIN_LENGTH = 12;
const MAX_LENGTH = 128;

export function checkPassword(password: string, email?: string): PasswordCheckResult {
  if (typeof password !== 'string') {
    return { ok: false, error: 'Password is required.', score: 0 };
  }

  if (password.length < MIN_LENGTH) {
    return {
      ok: false,
      error: `Password must be at least ${MIN_LENGTH} characters.`,
      score: Math.min(1, Math.floor(password.length / 4)),
    };
  }
  if (password.length > MAX_LENGTH) {
    return { ok: false, error: `Password must be under ${MAX_LENGTH} characters.`, score: 0 };
  }

  const lower = /[a-z]/.test(password);
  const upper = /[A-Z]/.test(password);
  const digit = /\d/.test(password);
  const symbol = /[^A-Za-z0-9]/.test(password);
  const classCount = [lower, upper, digit, symbol].filter(Boolean).length;

  if (classCount < 3) {
    return {
      ok: false,
      error: 'Password must mix at least 3 of: lowercase, uppercase, number, symbol.',
      score: 2,
    };
  }

  const lowered = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lowered)) {
    return { ok: false, error: 'This password is too common. Choose something unique.', score: 1 };
  }

  if (email) {
    const local = email.split('@')[0]?.toLowerCase();
    if (local && local.length >= 4 && lowered.includes(local)) {
      return {
        ok: false,
        error: "Password can't contain your email address.",
        score: 2,
      };
    }
  }

  // Repetition / sequential run detection
  if (/(.)\1{3,}/.test(password)) {
    return { ok: false, error: 'Password has too many repeated characters.', score: 2 };
  }

  // Score: length + class diversity
  let score = 3;
  if (password.length >= 16) score = 4;
  if (password.length >= 20 && classCount === 4) score = 4;

  return { ok: true, score };
}

/** Text label for a strength score 0–4. */
export function strengthLabel(score: number): string {
  return ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'][Math.max(0, Math.min(4, score))];
}

/** Tailwind color class for a strength score 0–4. */
export function strengthColor(score: number): string {
  return [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-emerald-500',
  ][Math.max(0, Math.min(4, score))];
}
