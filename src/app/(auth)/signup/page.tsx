'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { Check, Users, Crown } from 'lucide-react';

type PlanKey = 'basic' | 'pro' | 'enterprise';

const plans: Array<{
  key: PlanKey;
  name: string;
  tagline: string;
  price: number;
  popular?: boolean;
  features: string[];
}> = [
  {
    key: 'basic',
    name: 'Starter',
    tagline: 'Solo builders & small GCs',
    price: 199,
    features: ['Financial dashboard', 'Job costing & WIP', 'Cash flow forecasting', 'QuickBooks sync'],
  },
  {
    key: 'pro',
    name: 'Professional',
    tagline: 'Growing multi-project builders',
    price: 299,
    popular: true,
    features: [
      'Everything in Starter',
      'Buildertrend + HubSpot + JobNimbus',
      'AI CFO advisor',
      'Direct access to developer',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    tagline: 'Scaling builders & GC firms',
    price: 399,
    features: [
      'Everything in Professional',
      'Procore + Salesforce + ServiceTitan',
      'Quarterly strategy call',
      'Dedicated account manager',
    ],
  },
];

const WHITE_GLOVE_PRICE = 999;

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','tempmail.com','throwaway.email','yopmail.com',
  'sharklasers.com','guerrillamailblock.com','grr.la','dispostable.com','trashmail.com',
  'fakeinbox.com','temp-mail.org','getnada.com','maildrop.cc','10minutemail.com',
  'minutemail.com','emailondeck.com','mailnesia.com','tempail.com','mohmal.com',
]);

const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isDisposable = (e: string) => {
  const d = e.split('@')[1]?.toLowerCase();
  return d ? DISPOSABLE_DOMAINS.has(d) : false;
};

/**
 * Returns null if the 2 friend emails are a valid pair for the referral discount,
 * or a user-facing error string if not.
 */
function validateReferralPair(friend1: string, friend2: string, ownerEmail: string): string | null {
  const f1 = friend1.trim().toLowerCase();
  const f2 = friend2.trim().toLowerCase();
  const owner = ownerEmail.trim().toLowerCase();
  if (!validEmail(f1) || !validEmail(f2)) return null; // not ready yet, no error
  if (f1 === f2) return 'Friend emails must be different.';
  if (owner && (f1 === owner || f2 === owner)) return "You can't refer yourself.";
  if (isDisposable(f1) || isDisposable(f2)) return 'Please use real email addresses.';
  const d1 = f1.split('@')[1];
  const d2 = f2.split('@')[1];
  const ownerD = owner.split('@')[1];
  if (d1 && d2 && ownerD && d1 === d2 && d2 === ownerD) {
    return 'Friend emails should be from different people.';
  }
  return null;
}

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Plan selection
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('pro');
  const [whiteGloveAddon, setWhiteGloveAddon] = useState(false);

  // Pricing mode: full or refer
  const [pricingMode, setPricingMode] = useState<'full' | 'refer'>('full');

  // Referral state — discount applies as soon as both emails are valid
  const [refFriend1, setRefFriend1] = useState('');
  const [refFriend2, setRefFriend2] = useState('');
  const [refError, setRefError] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const persistedRef = useRef(false);

  // Account fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Submit state
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Hydrate plan / discount from URL params and localStorage on mount
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && ['basic', 'pro', 'enterprise'].includes(planParam)) {
      setSelectedPlan(planParam as PlanKey);
    }
    if (searchParams.get('addon') === 'whiteglove' || planParam === 'whiteglove') {
      setWhiteGloveAddon(true);
    }

    const urlDiscount = searchParams.get('discount');
    const urlRef = searchParams.get('ref');
    if (urlDiscount === 'REFER20') {
      setDiscountApplied(true);
      setPricingMode('refer');
      if (urlRef) {
        setReferredBy(urlRef);
        if (!email) setEmail(urlRef);
      }
    } else if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('referralDiscount');
        const storedEmail = window.localStorage.getItem('referralEmail');
        if (stored === 'REFER20') {
          setDiscountApplied(true);
          setPricingMode('refer');
          if (storedEmail) {
            setReferredBy(storedEmail);
            if (!email) setEmail(storedEmail);
          }
        }
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Auto-apply discount once both friend emails are valid
  useEffect(() => {
    if (pricingMode !== 'refer') return;

    const f1 = refFriend1.trim();
    const f2 = refFriend2.trim();

    // Not yet ready → clear applied state but don't error
    if (!validEmail(f1) || !validEmail(f2)) {
      if (discountApplied && !persistedRef.current) {
        setDiscountApplied(false);
      }
      setRefError('');
      return;
    }

    const err = validateReferralPair(f1, f2, email);
    if (err) {
      setRefError(err);
      if (discountApplied && !persistedRef.current) setDiscountApplied(false);
      return;
    }

    // Both valid — apply 20% immediately
    setRefError('');
    setDiscountApplied(true);
    setReferredBy(email || null);

    // Fire-and-forget: log the referral server-side + persist
    if (!persistedRef.current) {
      persistedRef.current = true;
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('referralDiscount', 'REFER20');
          if (email) window.localStorage.setItem('referralEmail', email);
        }
      } catch {}
      fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: email || f1, // backend requires a valid owner email; fall back to friend1 if signup email not yet entered
          friend1: f1,
          friend2: f2,
          plan: selectedPlan,
          planName: plans.find(p => p.key === selectedPlan)?.name,
        }),
      }).catch(() => {
        // Non-blocking — discount stays applied either way
      });
    }
  }, [pricingMode, refFriend1, refFriend2, email, selectedPlan, discountApplied]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      setLoadingStep('Creating your account...');
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, companyName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        setLoadingStep('');
        return;
      }

      setLoadingStep('Signing you in...');
      const supabase = createBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError('Account created but sign-in failed: ' + signInError.message);
        setLoading(false);
        setLoadingStep('');
        return;
      }

      setLoadingStep('Setting up your free trial...');
      const checkoutRes = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          whiteGloveAddon,
          discountCode: discountApplied ? 'REFER20' : undefined,
        }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok || !checkoutData.data?.url) {
        console.error('Checkout redirect failed:', checkoutData);
        router.push('/dashboard');
        return;
      }
      window.location.href = checkoutData.data.url;
      return;
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
      setLoadingStep('');
    }
  };

  const discount = discountApplied ? 0.8 : 1;
  const selectedPlanData = plans.find(p => p.key === selectedPlan);
  const monthlyBase = selectedPlanData?.price ?? 0;
  const monthlyFinal = +(monthlyBase * discount).toFixed(2);
  const whiteGloveFinal = +(WHITE_GLOVE_PRICE * discount).toFixed(2);

  const fmt = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-[#12121a] rounded-lg border border-[#1e1e2e] p-8 shadow-2xl">
        {/* Branding */}
        <div className="mb-6 text-center">
          <h1 className="font-bold text-2xl tracking-tight mb-1">
            <span className="text-[#6366f1]">Builder</span><span className="text-[#e8e8f0]">CFO</span>
          </h1>
          <p className="text-sm text-[#8888a0] mb-3">by Salisbury Bookkeeping</p>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">Start Your 14-Day Free Trial</h2>
          <p className="text-sm text-[#b0b0c8] mt-1">
            No charge for 14 days. Card required — cancel anytime.
          </p>
        </div>

        {/* Pricing mode tabs */}
        <div className="mb-5 grid grid-cols-2 gap-2 p-1 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg">
          <button
            type="button"
            onClick={() => {
              setPricingMode('full');
              setDiscountApplied(false);
              persistedRef.current = false;
              try {
                if (typeof window !== 'undefined') {
                  window.localStorage.removeItem('referralDiscount');
                  window.localStorage.removeItem('referralEmail');
                }
              } catch {}
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              pricingMode === 'full'
                ? 'bg-[#1e1e2e] text-[#e8e8f0]'
                : 'text-[#8888a0] hover:text-[#e8e8f0]'
            }`}
          >
            Full price
          </button>
          <button
            type="button"
            onClick={() => setPricingMode('refer')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
              pricingMode === 'refer'
                ? 'bg-gradient-to-r from-[#6366f1] to-[#a78bfa] text-white'
                : 'text-[#8888a0] hover:text-[#e8e8f0]'
            }`}
          >
            <Users size={14} />
            Refer 2 friends — 20% off forever
          </button>
        </div>

        {/* Referral form (auto-applies on 2 valid emails) */}
        {pricingMode === 'refer' && (
          <div className="mb-5 bg-gradient-to-r from-[#6366f1]/10 to-[#a78bfa]/10 border border-[#6366f1]/30 rounded-lg p-4">
            <p className="text-xs text-[#b0b0c8] mb-3">
              Enter the emails of 2 friends or colleagues who would benefit from BuilderCFO. The 20% discount
              applies the moment both emails are valid — and we&apos;ll save them so they get 20% off too when
              they sign up.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#e8e8f0] mb-1">Friend 1 email</label>
                <input
                  type="email"
                  value={refFriend1}
                  onChange={(e) => setRefFriend1(e.target.value)}
                  placeholder="friend1@company.com"
                  className="w-full px-3 py-2 rounded bg-[#0a0a0f] border border-[#2a2a3d] text-sm text-[#e8e8f0] placeholder-[#5a5a70] focus:outline-none focus:border-[#6366f1] transition"
                />
                {refFriend1 && validEmail(refFriend1.trim()) && (
                  <p className="text-xs text-[#10b981] mt-1">✓ Valid</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-[#e8e8f0] mb-1">Friend 2 email</label>
                <input
                  type="email"
                  value={refFriend2}
                  onChange={(e) => setRefFriend2(e.target.value)}
                  placeholder="friend2@company.com"
                  className="w-full px-3 py-2 rounded bg-[#0a0a0f] border border-[#2a2a3d] text-sm text-[#e8e8f0] placeholder-[#5a5a70] focus:outline-none focus:border-[#6366f1] transition"
                />
                {refFriend2 && validEmail(refFriend2.trim()) && (
                  <p className="text-xs text-[#10b981] mt-1">✓ Valid</p>
                )}
              </div>
            </div>
            {refError && <p className="text-xs text-[#f87171] mt-2">{refError}</p>}
            {discountApplied && !refError && (
              <div className="mt-3 bg-[#10b981]/15 border border-[#10b981]/40 rounded-md px-3 py-2 text-xs text-[#6ee7b7]">
                ✓ 20% discount applied! See pricing below.
              </div>
            )}
          </div>
        )}

        {/* Plan Selector — 3 plans only */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {plans.map((plan) => {
            const finalPrice = +(plan.price * discount).toFixed(2);
            const isSelected = selectedPlan === plan.key;
            return (
              <button
                key={plan.key}
                type="button"
                onClick={() => setSelectedPlan(plan.key)}
                className={`relative p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-[#6366f1] bg-[#6366f1]/10'
                    : 'border-[#2a2a3d] bg-[#0a0a0f] hover:border-[#3a3a4d]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-3 bg-gradient-to-r from-[#6366f1] to-[#a78bfa] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    POPULAR
                  </div>
                )}
                <div className="text-sm font-semibold text-[#e8e8f0]">{plan.name}</div>
                <div className="text-[10px] text-[#8888a0] mb-1">{plan.tagline}</div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  {discountApplied && (
                    <span className="text-xs text-[#8888a0] line-through">${plan.price}</span>
                  )}
                  <span className={`text-lg font-bold ${discountApplied ? 'text-[#10b981]' : 'text-[#e8e8f0]'}`}>
                    {fmt(finalPrice)}
                  </span>
                  <span className="text-xs text-[#8888a0]">/mo</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected plan features */}
        {selectedPlanData && (
          <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedPlanData.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check size={14} className="text-[#6366f1] flex-shrink-0" />
                  <span className="text-xs text-[#b0b0c8]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* White Glove one-time add-on */}
        <label
          className={`mb-6 flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
            whiteGloveAddon
              ? 'border-[#f59e0b]/60 bg-[#f59e0b]/5'
              : 'border-[#2a2a3d] bg-[#0a0a0f] hover:border-[#3a3a4d]'
          }`}
        >
          <input
            type="checkbox"
            checked={whiteGloveAddon}
            onChange={(e) => setWhiteGloveAddon(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[#3a3a4d] bg-[#0a0a0f] text-[#f59e0b] focus:ring-[#f59e0b] focus:ring-offset-0 cursor-pointer"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Crown size={15} className="text-[#f59e0b]" />
                <span className="text-sm font-semibold text-[#e8e8f0]">White Glove Custom Setup</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                {discountApplied && (
                  <span className="text-xs text-[#8888a0] line-through">${WHITE_GLOVE_PRICE}</span>
                )}
                <span className={`text-sm font-bold ${discountApplied ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                  +{fmt(whiteGloveFinal)}
                </span>
                <span className="text-xs text-[#8888a0]">one-time</span>
              </div>
            </div>
            <p className="text-xs text-[#8888a0] mt-1">
              Our team handles every integration, builds your chart of accounts, reconciles historical data,
              and trains your team 1:1.
            </p>
          </div>
        </label>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#e8e8f0] mb-1.5">
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
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-[#e8e8f0] mb-1.5">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company"
                required
                className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#e8e8f0] mb-1.5">Email</label>
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#e8e8f0] mb-1.5">Password</label>
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
          </div>

          {/* Order summary */}
          <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm">
            <div className="flex items-center justify-between text-[#b0b0c8]">
              <span>{selectedPlanData?.name} plan</span>
              <span className="text-[#e8e8f0] font-medium">{fmt(monthlyFinal)} /mo</span>
            </div>
            {whiteGloveAddon && (
              <div className="flex items-center justify-between text-[#b0b0c8] mt-1">
                <span>White Glove setup</span>
                <span className="text-[#e8e8f0] font-medium">{fmt(whiteGloveFinal)} once</span>
              </div>
            )}
            {discountApplied && (
              <div className="mt-2 pt-2 border-t border-[#1e1e2e] text-xs text-[#10b981]">
                ✓ REFER20 applied — 20% off forever
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#6366f1] hover:bg-[#5558d9] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? loadingStep || 'Processing...' : `Start Free Trial — ${selectedPlanData?.name} Plan`}
          </button>

          <p className="text-center text-xs text-[#8888a0]">
            Credit card required. You won&apos;t be charged for the {selectedPlanData?.name} subscription during your 14-day trial.
            {whiteGloveAddon && ' White Glove setup is billed once at checkout.'}
            {' '}Cancel anytime.
          </p>
        </form>

        <div className="mt-5 text-center text-sm">
          <span className="text-[#8888a0]">Already have an account? </span>
          <Link href="/login" className="text-[#6366f1] hover:text-[#7c7fe5] font-medium transition">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-2xl">
        <div className="bg-[#12121a] rounded-lg border border-[#1e1e2e] p-8 shadow-2xl text-center">
          <div className="text-[#8888a0]">Loading...</div>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
