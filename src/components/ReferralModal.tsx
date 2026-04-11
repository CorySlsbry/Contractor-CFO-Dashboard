'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Gift, Mail, ChevronRight, Check } from 'lucide-react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: string; // 'basic' | 'pro' | 'enterprise' | 'whiteglove'
  planName: string; // Display name
}

export default function ReferralModal({ isOpen, onClose, plan, planName }: ReferralModalProps) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [friend1, setFriend1] = useState('');
  const [friend2, setFriend2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSkip = () => {
    router.push(`/signup?plan=${plan}`);
  };

  const handleReferAndSave = async () => {
    setError('');

    if (!validEmail(userEmail)) {
      setError('Please enter your email.');
      return;
    }
    if (!validEmail(friend1) || !validEmail(friend2)) {
      setError('Please enter 2 valid friend emails to unlock 20% off.');
      return;
    }
    if (friend1.toLowerCase() === friend2.toLowerCase()) {
      setError('Friend emails must be different.');
      return;
    }
    if (
      friend1.toLowerCase() === userEmail.toLowerCase() ||
      friend2.toLowerCase() === userEmail.toLowerCase()
    ) {
      setError("You can't refer yourself — enter your friends' emails.");
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          friend1,
          friend2,
          plan,
          planName,
        }),
      });
    } catch (err) {
      // Non-blocking: still proceed to signup even if the API fails
      console.error('Referral submit failed:', err);
    }

    // Persist referral state so signup page can show the 20% off badge
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('referralDiscount', 'REFER20');
        window.localStorage.setItem('referralEmail', userEmail);
      }
    } catch {}

    router.push(
      `/signup?plan=${plan}&discount=REFER20&ref=${encodeURIComponent(userEmail)}`
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#12121a] border border-[#2a2a3d] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8888a0] hover:text-white transition z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#6366f1]/20 to-[#a78bfa]/20 border-b border-[#2a2a3d] p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 mb-3">
            <Gift size={22} className="text-[#a5b4fc]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Save 20% on {planName}
          </h3>
          <p className="text-sm text-[#b0b0c8]">
            Refer 2 friends right now and we&apos;ll knock{' '}
            <span className="font-semibold text-[#a5b4fc]">20% off your subscription</span>
            . Your friends get 20% off too.
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8888a0] uppercase tracking-wide flex items-center gap-1.5">
              <Mail size={12} /> Your Email
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg text-white placeholder-[#5a5a70] focus:outline-none focus:border-[#6366f1] transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8888a0] uppercase tracking-wide flex items-center gap-1.5">
              <Mail size={12} /> Friend #1 Email
            </label>
            <input
              type="email"
              value={friend1}
              onChange={(e) => setFriend1(e.target.value)}
              placeholder="friend1@company.com"
              className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg text-white placeholder-[#5a5a70] focus:outline-none focus:border-[#6366f1] transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#8888a0] uppercase tracking-wide flex items-center gap-1.5">
              <Mail size={12} /> Friend #2 Email
            </label>
            <input
              type="email"
              value={friend2}
              onChange={(e) => setFriend2(e.target.value)}
              placeholder="friend2@company.com"
              className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg text-white placeholder-[#5a5a70] focus:outline-none focus:border-[#6366f1] transition"
            />
          </div>

          {/* What they get */}
          <div className="flex items-start gap-2 bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-lg p-3">
            <Check size={14} className="text-[#22c55e] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#b0b0c8]">
              Your 2 friends will receive an invitation email from BuilderCFO with their
              20% off code. No spam — just one invite, then they decide.
            </p>
          </div>

          {error && (
            <div className="text-sm text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Primary CTA */}
          <button
            onClick={handleReferAndSave}
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#6366f1] to-[#a78bfa] hover:opacity-90 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Saving your discount...' : (
              <>
                Refer &amp; Save 20% <ChevronRight size={18} />
              </>
            )}
          </button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            className="w-full text-xs text-[#8888a0] hover:text-[#b0b0c8] transition text-center"
          >
            Skip &amp; start my trial at full price →
          </button>
        </div>
      </div>
    </div>
  );
}
