'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Call server-side signup API (auto-confirms email, creates org + profile)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Step 2: Sign in the user (account is already confirmed)
      const supabase = createBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Account created but sign-in failed: ' + signInError.message);
        setLoading(false);
        return;
      }

      // Step 3: Redirect to dashboard
      router.push('/dashboard');
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
          <h1 className="text-sm font-semibold text-[#8888a0] mb-2">
            SALISBURY BOOKKEEPING
          </h1>
          <h2 className="text-2xl font-bold text-[#e8e8f0]">
            Contractor CFO Dashboard
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-[#e8e8f0] mb-2"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] transition"
            />
          </div>

          {/* Company Name Field */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-[#e8e8f0] mb-2"
            >
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company Name"
              required
              className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] transition"
            />
          </div>

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
              minLength={6}
              className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] transition"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm">
          <span className="text-[#8888a0]">Already have an account? </span>
          <Link
            href="/login"
            className="text-[#6366f1] hover:text-[#7c7fe5] font-medium transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
