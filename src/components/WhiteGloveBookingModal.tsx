'use client';

/**
 * WhiteGloveBookingModal
 * ───────────────────────────────────────────────────────────
 * Full-screen modal that combines:
 *   1. LEFT  — Custom calendar + time slot picker (BookingCalendar variant="whiteglove")
 *              - Mon-Fri 11 AM – 2 PM Mountain Time
 *              - 6 slots/day (30-min spacing)
 *              - 15-minute intro call, 30-minute calendar block
 *              - Collects: name, company, email, phone, notes
 *              - Creates Google Meet + GHL contact via /api/booking/confirm
 *
 *   2. RIGHT — White Glove pricing context + "or start your trial now" shortcut
 *              straight to the signup page pre-selected to whiteglove
 *
 * Opened by the "Talk to Our Team" button on the White Glove pricing tier
 * (landing page + /start). NOT used by the other tiers — they use ReferralModal.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Crown, Check, Calendar as CalendarIcon, Clock, Video, ChevronRight } from 'lucide-react';
import { BookingCalendar } from '@/components/booking-calendar';

interface WhiteGloveBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhiteGloveBookingModal({ isOpen, onClose }: WhiteGloveBookingModalProps) {
  // Lock background scroll while the modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl my-4 rounded-2xl bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-[#a78bfa]/30 shadow-2xl shadow-[#a78bfa]/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#1e1e2e] hover:bg-[#2a2a3d] flex items-center justify-center text-[#8888a0] hover:text-white transition cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-7 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#a78bfa] to-[#6366f1] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Crown size={11} /> White Glove
            </div>
            <span className="text-xs text-[#8888a0]">· $2,997/month</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Book a 15-Minute White Glove Intro Call
          </h2>
          <p className="text-sm text-[#b0b0c8] mt-1">
            See if a dedicated fractional controller is the right fit for your business.
          </p>
        </div>

        {/* Body: 2 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          {/* LEFT — calendar + signup form */}
          <div className="p-5 sm:p-7 lg:border-r lg:border-[#1e1e2e]">
            <BookingCalendar variant="whiteglove" accentClass="#a78bfa" />
          </div>

          {/* RIGHT — What you get + shortcut to signup */}
          <aside className="p-5 sm:p-7 bg-[#0a0a0f]/60 lg:rounded-r-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#a5b4fc] uppercase tracking-wider mb-3">
              <CalendarIcon size={13} /> What's on the call
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                'Walk through your current job costing + WIP workflow',
                'Identify your #1 financial blind spot',
                'Scope if White Glove fits your business stage',
                'Next steps + proposal if we are a fit',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#d0d0e0]">
                  <Check size={14} className="text-[#a78bfa] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8888a0] uppercase tracking-wider mb-2">
                <Clock size={12} /> Logistics
              </div>
              <ul className="space-y-1.5 text-xs text-[#b0b0c8]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#a78bfa]">·</span> 15-minute intro call
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#a78bfa]">·</span> Mon–Fri, 11 AM – 2 PM Mountain Time
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#a78bfa]">·</span>
                  <span className="inline-flex items-center gap-1"><Video size={11} /> Google Meet (link emailed)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#a78bfa]">·</span> No sales pressure — just a fit check
                </li>
              </ul>
            </div>

            {/* Shortcut: skip the call, start a free trial right now */}
            <div className="border-t border-[#1e1e2e] pt-5">
              <p className="text-xs text-[#8888a0] mb-3">
                Or skip the call and start your 14-day free trial right now.
              </p>
              <Link
                href="/signup?plan=whiteglove"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#a78bfa] to-[#6366f1] hover:opacity-90 transition text-sm"
              >
                Start Free Trial <ChevronRight size={14} />
              </Link>
              <p className="text-[10px] text-[#555] mt-2 text-center">
                No card required. Cancel anytime.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
