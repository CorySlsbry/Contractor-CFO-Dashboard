'use client';

/**
 * MFA challenge page — shown after login when the user has a verified factor.
 *
 * Supabase returns AAL1 after `signInWithPassword`. If the user has any
 * verified MFA factors, they are required to satisfy one of them here to
 * reach AAL2 before accessing protected routes.
 *
 * We let the user pick among their enrolled factors (typical: TOTP + SMS).
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { Key, Smartphone, Shield } from 'lucide-react';

interface Factor {
  id: string;
  friendly_name?: string | null;
  factor_type: 'totp' | 'phone';
}

export default function MfaChallengePage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [factors, setFactors] = useState<Factor[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Load factors + check whether user actually needs a challenge.
  useEffect(() => {
    (async () => {
      try {
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        // If already at the required level, just bounce to /dashboard.
        if (
          aalData?.currentLevel === aalData?.nextLevel &&
          aalData?.nextLevel === 'aal2'
        ) {
          router.replace('/dashboard');
          return;
        }
        // No verified factors? AAL1 is fine; nothing to do here.
        if (aalData?.nextLevel === 'aal1') {
          router.replace('/dashboard');
          return;
        }

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          router.replace('/login');
          return;
        }

        const { data, error } = await supabase.auth.mfa.listFactors();
        if (error) throw error;

        const verified: Factor[] = [
          ...(data?.totp ?? []).map((f) => ({ ...f, factor_type: 'totp' as const })),
          ...(data?.phone ?? []).map((f) => ({ ...f, factor_type: 'phone' as const })),
        ].filter((f) => (f as { status?: string }).status === 'verified') as Factor[];

        if (verified.length === 0) {
          router.replace('/dashboard');
          return;
        }

        setFactors(verified);
        // Prefer TOTP over SMS by default.
        const preferred = verified.find((f) => f.factor_type === 'totp') ?? verified[0];
        setSelected(preferred.id);

        // For phone factors we need to trigger challenge() immediately so
        // Supabase sends the SMS. For TOTP the user just reads their app.
        if (preferred.factor_type === 'phone') {
          const ch = await supabase.auth.mfa.challenge({ factorId: preferred.id });
          if (ch.error) throw ch.error;
          setChallengeId(ch.data.id);
          startResendCooldown();
        } else {
          const ch = await supabase.auth.mfa.challenge({ factorId: preferred.id });
          if (ch.error) throw ch.error;
          setChallengeId(ch.data.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load 2FA challenge.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startResendCooldown = () => {
    setResendCooldown(30);
    const int = setInterval(() => {
      setResendCooldown((x) => {
        if (x <= 1) {
          clearInterval(int);
          return 0;
        }
        return x - 1;
      });
    }, 1000);
  };

  const switchFactor = async (factorId: string) => {
    setError(null);
    setCode('');
    setSelected(factorId);
    const f = factors.find((x) => x.id === factorId);
    if (!f) return;
    try {
      const ch = await supabase.auth.mfa.challenge({ factorId });
      if (ch.error) throw ch.error;
      setChallengeId(ch.data.id);
      if (f.factor_type === 'phone') startResendCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate challenge.');
    }
  };

  const resendSms = async () => {
    if (!selected || resendCooldown > 0) return;
    await switchFactor(selected);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !challengeId) return;
    setError(null);
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: selected,
        challengeId,
        code: code.trim(),
      });
      if (error) {
        // Audit the failure server-side.
        fetch('/api/security/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // password_changed isn't the right event, but we don't whitelist
          // mfa_challenge_failed for browser origin — skip.
          body: JSON.stringify({ event: 'logout' }),
        }).catch(() => {});
        throw error;
      }
      // Success — bounce to dashboard. Session now has aal2.
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const selectedFactor = factors.find((f) => f.id === selected);

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#12121a] rounded-lg border border-[#1e1e2e] p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6366f1]/10 mb-3">
            <Shield className="text-[#6366f1]" size={22} />
          </div>
          <h1 className="font-bold text-2xl tracking-tight mb-1 text-[#e8e8f0]">
            Two-factor authentication
          </h1>
          <p className="text-sm text-[#8888a0]">
            Enter the 6-digit code from your{' '}
            {selectedFactor?.factor_type === 'phone' ? 'text messages' : 'authenticator app'}.
          </p>
        </div>

        {loading && (
          <div className="text-center text-sm text-[#8888a0] py-8">Loading...</div>
        )}

        {!loading && factors.length > 1 && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#8888a0] mb-2">
              Verification method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {factors.map((f) => {
                const active = selected === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => switchFactor(f.id)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded border text-sm transition ${
                      active
                        ? 'border-[#6366f1] bg-[#6366f1]/10 text-[#e8e8f0]'
                        : 'border-[#2a2a3a] bg-[#0a0a0f] text-[#8888a0] hover:text-[#e8e8f0]'
                    }`}
                  >
                    {f.factor_type === 'totp' ? <Key size={14} /> : <Smartphone size={14} />}
                    {f.factor_type === 'totp' ? 'Authenticator' : 'SMS'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!loading && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-3 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#444] text-center font-mono text-2xl tracking-[0.5em] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700/50 rounded px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || code.length !== 6}
              className="w-full px-4 py-2 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        )}

        {selectedFactor?.factor_type === 'phone' && !loading && (
          <button
            type="button"
            onClick={resendSms}
            disabled={resendCooldown > 0}
            className="w-full mt-3 text-xs text-[#8888a0] hover:text-[#e8e8f0] disabled:opacity-50"
          >
            {resendCooldown > 0 ? `Resend SMS in ${resendCooldown}s` : 'Resend SMS'}
          </button>
        )}

        <div className="mt-6 pt-4 border-t border-[#1e1e2e] text-center">
          <button
            onClick={signOut}
            className="text-sm text-[#8888a0] hover:text-[#e8e8f0] transition"
          >
            Sign out
          </button>
          <p className="text-xs text-[#555] mt-2">
            Lost access to your 2FA device?{' '}
            <Link href="mailto:cory@salisburybookkeeping.com" className="text-[#6366f1] hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
