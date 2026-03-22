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
  const supabase = createBrowserClient();

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Failed to create user account');
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // Step 2: Create organization record
      const slug = generateSlug(companyName);
      const { error: orgError } = await (supabase as any)
        .from('organizations')
        .insert({
          name: companyName,
          slug,
          owner_id: userId,
        });

      if (orgError) {
        setError('Failed to create organization');
        setLoading(false);
        return;
      }

      // Step 3: Create profile record
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: fullName,
          email,
        });

      if (profileError) {
        setError('Failed to create user profile');
        setLoading(false);
        return;
      }

      // Step 4: Redirect to dashboard
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
