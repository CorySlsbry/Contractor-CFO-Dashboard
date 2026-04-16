'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient();

  useEffect(() => {
    const reason = searchParams?.get('reason');
    if (reason === 'idle') {
      setNotice('You were signed out due to inactivity. Please sign in again.');
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Fire an audit event server-side so we can detect credential-stuffing.
        fetch('/api/auth/login-failed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }).catch(() => {});
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Password OK — decide whether MFA challenge is required.
      // `getAuthenticatorAssuranceLevel` tells us: if nextLevel > currentLevel,
      // the user has a verified factor and needs to hit it before we let them
      // into /dashboard.
      try {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
          window.location.href = '/mfa';
          return;
        }
      } catch {
        // If the AAL call fails we fall through to the normal redirect —
        // the middleware will still re-check and bounce if necessary.
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#12121a] rounded-lg border border-[#1e1e2e] p-8 shadow-2xl">
        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="font-bold text-2xl tracking-tight mb-1">
            <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
          </h1>
          <p className="text-sm text-[#8888a0]">
            by Salisbury Bookkeeping
          </p>
        </div>

        {/* Notice (e.g. idle logout) */}
        {notice && (
          <div className="mb-4 bg-yellow-900/20 border border-yellow-700/50 rounded px-4 py-2 text-sm text-yellow-300">
            {notice}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#e8e8f0] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
              className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#e8e8f0] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] transition"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 text-center">
          <div className="text-sm">
            <span className="text-[#8888a0]">Don't have an account? </span>
            <Link
              href="/signup"
              className="text-[#6366f1] hover:text-[#7c7fe5] font-medium transition"
            >
              Start your free trial
            </Link>
          </div>
          <div>
            <Link
              href="/forgot-password"
              className="text-sm text-[#8888a0] hover:text-[#e8e8f0] transition"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
