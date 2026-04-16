'use client';

/**
 * Security settings — two-factor authentication (MFA) management.
 *
 * Supports two factor types via Supabase Auth:
 *   1. TOTP (Google Authenticator, 1Password, Authy, etc.) — universal, recommended.
 *   2. Phone / SMS — requires SMS provider (Twilio) configured in the Supabase dashboard.
 *
 * Flow (TOTP):
 *   - call supabase.auth.mfa.enroll({ factorType: 'totp' })
 *   - show QR code + secret to user
 *   - user scans + enters 6-digit code
 *   - call supabase.auth.mfa.challenge() → verify()
 *   - factor becomes verified; next login will require AAL2.
 *
 * Flow (SMS):
 *   - enroll({ factorType: 'phone', phone })
 *   - Supabase sends an SMS code via its configured SMS provider
 *   - user enters code; verify()
 *
 * We also surface a "Change password" form here and list all active
 * factors with an "Unenroll" button.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Smartphone, Key, Trash2, Check, AlertTriangle } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { checkPassword, strengthColor, strengthLabel } from '@/lib/security/password';

interface Factor {
  id: string;
  friendly_name?: string | null;
  factor_type: string; // 'totp' | 'phone'
  status: string;      // 'verified' | 'unverified'
  created_at?: string;
}

type EnrollStep =
  | { kind: 'idle' }
  | { kind: 'totp-enroll'; factorId: string; secret: string; qr: string; code: string }
  | { kind: 'phone-enter' }
  | { kind: 'phone-enroll'; factorId: string; phone: string; code: string };

export default function SecuritySettingsPage() {
  const supabase = createBrowserClient();

  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [enroll, setEnroll] = useState<EnrollStep>({ kind: 'idle' });
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const [phoneInput, setPhoneInput] = useState('');

  // Password change
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwNewConfirm, setPwNewConfirm] = useState('');
  const [pwChanging, setPwChanging] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  const refreshFactors = useCallback(async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      console.error('listFactors error:', error);
      return;
    }
    const merged: Factor[] = [
      ...(data?.totp ?? []).map((f) => ({ ...f, factor_type: 'totp' })),
      ...(data?.phone ?? []).map((f) => ({ ...f, factor_type: 'phone' })),
    ] as Factor[];
    setFactors(merged);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
      await refreshFactors();
      setLoading(false);
    })();
  }, [supabase, refreshFactors]);

  // ---- TOTP ---------------------------------------------------------------

  const startTotpEnroll = async () => {
    setEnrollError(null);
    setEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: `Authenticator (${new Date().toLocaleDateString()})`,
      });
      if (error) throw error;
      if (!data) throw new Error('No enrollment data returned.');
      setEnroll({
        kind: 'totp-enroll',
        factorId: data.id,
        secret: data.totp.secret,
        qr: data.totp.qr_code,
        code: '',
      });
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : 'Failed to start enrollment.');
    } finally {
      setEnrolling(false);
    }
  };

  const confirmTotp = async () => {
    if (enroll.kind !== 'totp-enroll') return;
    setEnrollError(null);
    setEnrolling(true);
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId: enroll.factorId });
      if (challenge.error) throw challenge.error;
      const verify = await supabase.auth.mfa.verify({
        factorId: enroll.factorId,
        challengeId: challenge.data.id,
        code: enroll.code.trim(),
      });
      if (verify.error) throw verify.error;
      setEnroll({ kind: 'idle' });
      await refreshFactors();
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : 'Invalid code. Try again.');
    } finally {
      setEnrolling(false);
    }
  };

  // ---- Phone / SMS --------------------------------------------------------

  const startPhoneEnroll = async () => {
    setEnrollError(null);
    setEnrolling(true);
    try {
      // Basic E.164 validation — Supabase/Twilio wants +15551234567 style.
      const phone = phoneInput.trim();
      if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
        throw new Error('Enter a phone number in E.164 format, e.g. +15551234567.');
      }
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'phone',
        phone,
        friendlyName: `SMS (${phone.slice(-4)})`,
      });
      if (error) throw error;
      if (!data) throw new Error('No enrollment data returned.');
      setEnroll({ kind: 'phone-enroll', factorId: data.id, phone, code: '' });
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : 'Failed to send SMS.');
    } finally {
      setEnrolling(false);
    }
  };

  const confirmPhone = async () => {
    if (enroll.kind !== 'phone-enroll') return;
    setEnrollError(null);
    setEnrolling(true);
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId: enroll.factorId });
      if (challenge.error) throw challenge.error;
      const verify = await supabase.auth.mfa.verify({
        factorId: enroll.factorId,
        challengeId: challenge.data.id,
        code: enroll.code.trim(),
      });
      if (verify.error) throw verify.error;
      setEnroll({ kind: 'idle' });
      setPhoneInput('');
      await refreshFactors();
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : 'Invalid SMS code.');
    } finally {
      setEnrolling(false);
    }
  };

  // ---- Unenroll -----------------------------------------------------------

  const unenroll = async (factorId: string) => {
    if (!confirm('Remove this 2FA method? You will lose access through this factor immediately.')) return;
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) {
      alert(`Failed to remove: ${error.message}`);
      return;
    }
    await refreshFactors();
  };

  // ---- Password change ----------------------------------------------------

  const pwCheck = pwNew ? checkPassword(pwNew, userEmail ?? undefined) : null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (!pwCurrent) return setPwError('Enter your current password.');
    if (pwNew !== pwNewConfirm) return setPwError('New passwords do not match.');
    const policy = checkPassword(pwNew, userEmail ?? undefined);
    if (!policy.ok) return setPwError(policy.error || 'Password does not meet policy.');

    setPwChanging(true);
    try {
      // Re-authenticate by signing in with current password — Supabase doesn't
      // require this for updateUser, but we want defense-in-depth.
      if (!userEmail) throw new Error('Missing account email.');
      const reauth = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: pwCurrent,
      });
      if (reauth.error) throw new Error('Current password is incorrect.');

      const { error } = await supabase.auth.updateUser({ password: pwNew });
      if (error) throw error;

      setPwSuccess('Password updated. You will remain signed in on this device.');
      setPwCurrent('');
      setPwNew('');
      setPwNewConfirm('');

      // Fire-and-forget audit log via route handler.
      fetch('/api/security/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'password_changed' }),
      }).catch(() => {});
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Failed to change password.');
    } finally {
      setPwChanging(false);
    }
  };

  // ------------------------------------------------------------------------

  const hasTotp = factors.some((f) => f.factor_type === 'totp' && f.status === 'verified');
  const hasPhone = factors.some((f) => f.factor_type === 'phone' && f.status === 'verified');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/settings" className="text-[#8888a0] hover:text-[#e8e8f0]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Shield className="text-[#6366f1]" size={28} />
            Security
          </h1>
          <p className="text-[#8888a0]">Two-factor authentication and password</p>
        </div>
      </div>

      {/* 2FA STATUS BANNER */}
      <Card className="p-6">
        <div className="flex items-start gap-3">
          {hasTotp || hasPhone ? (
            <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
          ) : (
            <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
          )}
          <div>
            <h2 className="text-lg font-semibold mb-1">
              {hasTotp || hasPhone
                ? 'Two-factor authentication is on'
                : 'Two-factor authentication is off'}
            </h2>
            <p className="text-sm text-[#8888a0]">
              {hasTotp || hasPhone
                ? 'Your account requires a second factor at every sign-in. Keep backup codes in a safe place.'
                : 'Adding a second factor protects your financial data even if your password is leaked. Pick at least one method below.'}
            </p>
          </div>
        </div>
      </Card>

      {/* AUTHENTICATOR APP (TOTP) */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Key className="text-[#6366f1] mt-1" size={22} />
            <div>
              <h2 className="text-lg font-semibold">Authenticator app</h2>
              <p className="text-sm text-[#8888a0]">
                Use Google Authenticator, 1Password, Authy, or any TOTP-compatible app. Recommended.
              </p>
            </div>
          </div>
          {!hasTotp && enroll.kind === 'idle' && (
            <Button
              variant="primary"
              size="sm"
              onClick={startTotpEnroll}
              disabled={enrolling}
            >
              {enrolling ? 'Starting...' : 'Enable'}
            </Button>
          )}
        </div>

        {/* TOTP enrollment flow */}
        {enroll.kind === 'totp-enroll' && (
          <div className="bg-[#1a1a26] rounded-lg p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-5 items-start">
              <div className="bg-white p-3 rounded-lg flex-shrink-0">
                {/* The qr_code returned by Supabase is an SVG dataURL. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={enroll.qr} alt="2FA QR code" className="w-44 h-44" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">1. Scan the QR code</p>
                  <p className="text-xs text-[#8888a0]">
                    Open your authenticator app and scan. Or enter the secret below manually.
                  </p>
                  <code className="block mt-2 text-xs bg-[#0a0a0f] border border-[#2a2a3a] rounded p-2 text-[#e8e8f0] break-all font-mono">
                    {enroll.secret}
                  </code>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">2. Enter the 6-digit code</p>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    pattern="\d{6}"
                    value={enroll.code}
                    onChange={(e) =>
                      setEnroll({ ...enroll, code: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="123456"
                    className="w-40 px-3 py-2 rounded bg-[#0a0a0f] border border-[#2a2a3a] text-[#e8e8f0] font-mono tracking-widest text-center focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
                {enrollError && (
                  <div className="text-sm text-red-400">{enrollError}</div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={confirmTotp}
                    disabled={enrolling || enroll.code.length !== 6}
                  >
                    {enrolling ? 'Verifying...' : 'Verify & enable'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      supabase.auth.mfa.unenroll({ factorId: enroll.factorId }).catch(() => {});
                      setEnroll({ kind: 'idle' });
                      setEnrollError(null);
                    }}
                    disabled={enrolling}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {enrollError && enroll.kind === 'idle' && (
          <div className="mt-3 text-sm text-red-400">{enrollError}</div>
        )}
      </Card>

      {/* SMS / PHONE */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Smartphone className="text-[#6366f1] mt-1" size={22} />
            <div>
              <h2 className="text-lg font-semibold">Text message (SMS)</h2>
              <p className="text-sm text-[#8888a0]">
                Receive a 6-digit code via text. Useful as a backup, but less secure than an authenticator app (vulnerable to SIM swapping).
              </p>
            </div>
          </div>
          {!hasPhone && enroll.kind === 'idle' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEnroll({ kind: 'phone-enter' })}
            >
              Add phone
            </Button>
          )}
        </div>

        {enroll.kind === 'phone-enter' && (
          <div className="bg-[#1a1a26] rounded-lg p-5 space-y-3">
            <label className="block text-sm font-medium">Mobile number</label>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+15551234567"
              className="w-full px-3 py-2 rounded bg-[#0a0a0f] border border-[#2a2a3a] text-[#e8e8f0] font-mono focus:outline-none focus:border-[#6366f1]"
            />
            <p className="text-xs text-[#8888a0]">
              Must include country code (e.g. <code>+1</code> for US / Canada).
            </p>
            {enrollError && <div className="text-sm text-red-400">{enrollError}</div>}
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={startPhoneEnroll} disabled={enrolling}>
                {enrolling ? 'Sending...' : 'Send code'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEnroll({ kind: 'idle' });
                  setEnrollError(null);
                }}
                disabled={enrolling}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {enroll.kind === 'phone-enroll' && (
          <div className="bg-[#1a1a26] rounded-lg p-5 space-y-3">
            <p className="text-sm">
              We sent a 6-digit code to <span className="font-mono">{enroll.phone}</span>.
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={enroll.code}
              onChange={(e) =>
                setEnroll({ ...enroll, code: e.target.value.replace(/\D/g, '') })
              }
              placeholder="123456"
              className="w-40 px-3 py-2 rounded bg-[#0a0a0f] border border-[#2a2a3a] text-[#e8e8f0] font-mono tracking-widest text-center focus:outline-none focus:border-[#6366f1]"
            />
            {enrollError && <div className="text-sm text-red-400">{enrollError}</div>}
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={confirmPhone} disabled={enrolling || enroll.code.length !== 6}>
                {enrolling ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  supabase.auth.mfa.unenroll({ factorId: enroll.factorId }).catch(() => {});
                  setEnroll({ kind: 'idle' });
                  setEnrollError(null);
                }}
                disabled={enrolling}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ENROLLED FACTORS */}
      {factors.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your 2FA methods</h2>
          <div className="space-y-3">
            {factors.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {f.factor_type === 'totp' ? (
                    <Key className="text-[#6366f1]" size={18} />
                  ) : (
                    <Smartphone className="text-[#6366f1]" size={18} />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {f.friendly_name || (f.factor_type === 'totp' ? 'Authenticator app' : 'SMS')}
                    </p>
                    <p className="text-xs text-[#8888a0]">
                      {f.factor_type.toUpperCase()} ·{' '}
                      {f.status === 'verified' ? (
                        <span className="text-green-400">Active</span>
                      ) : (
                        <span className="text-yellow-400">Pending</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => unenroll(f.id)}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* PASSWORD CHANGE */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-1">Change password</h2>
        <p className="text-sm text-[#8888a0] mb-4">
          Minimum 12 characters, with at least 3 of: lowercase, uppercase, number, symbol.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Current password</label>
            <input
              type="password"
              value={pwCurrent}
              onChange={(e) => setPwCurrent(e.target.value)}
              autoComplete="current-password"
              className="w-full px-3 py-2 rounded bg-[#0a0a0f] border border-[#2a2a3a] text-[#e8e8f0] focus:outline-none focus:border-[#6366f1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New password</label>
            <input
              type="password"
              value={pwNew}
              onChange={(e) => setPwNew(e.target.value)}
              autoComplete="new-password"
              className="w-full px-3 py-2 rounded bg-[#0a0a0f] border border-[#2a2a3a] text-[#e8e8f0] focus:outline-none focus:border-[#6366f1]"
            />
            {pwCheck && (
              <div className="mt-2">
                <div className="flex gap-1 h-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${
                        i <= pwCheck.score ? strengthColor(pwCheck.score) : 'bg-[#1e1e2e]'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs mt-1 ${pwCheck.ok ? 'text-green-400' : 'text-yellow-400'}`}>
                  {strengthLabel(pwCheck.score)}
                  {pwCheck.error ? ` — ${pwCheck.error}` : ''}
                </p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm new password</label>
            <input
              type="password"
              value={pwNewConfirm}
              onChange={(e) => setPwNewConfirm(e.target.value)}
              autoComplete="new-password"
              className="w-full px-3 py-2 rounded bg-[#0a0a0f] border border-[#2a2a3a] text-[#e8e8f0] focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          {pwError && (
            <div className="bg-red-900/20 border border-red-700/50 rounded px-4 py-2 text-sm text-red-400">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="bg-green-900/20 border border-green-700/50 rounded px-4 py-2 text-sm text-green-400">
              {pwSuccess}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={pwChanging || !pwCurrent || !pwNew || !pwNewConfirm}
          >
            {pwChanging ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </Card>

      {loading && (
        <div className="text-sm text-[#8888a0] text-center">Loading security settings...</div>
      )}
    </div>
  );
}
