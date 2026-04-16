'use client';

/**
 * Idle-timeout guard for signed-in sessions.
 *
 * - Default timeout: 30 minutes of inactivity.
 * - Warning banner appears 60 seconds before logout so the user can extend.
 * - "Activity" = mousemove, keydown, click, scroll, touchstart, visibility change.
 * - On timeout we call `supabase.auth.signOut()` and hard-redirect to /login.
 *
 * We keep the last-activity timestamp in localStorage so the countdown is
 * consistent across tabs — activity in any open tab keeps the session alive
 * in all of them.
 */

import { useEffect, useRef, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_LEAD_MS = 60 * 1000;       // show warning 60s before kicking
const ACTIVITY_KEY = 'bldrcfo:last-activity';

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'keydown',
  'click',
  'scroll',
  'touchstart',
];

export default function IdleTimeout() {
  const [warning, setWarning] = useState<null | number>(null); // seconds left
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    const markActive = () => {
      try {
        localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
      } catch {
        /* storage may be unavailable in incognito */
      }
      // Any activity dismisses the warning.
      setWarning(null);
    };

    // Seed it now so the timer doesn't fire a false positive immediately.
    markActive();

    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, markActive, { passive: true }),
    );
    document.addEventListener('visibilitychange', markActive);

    const tick = async () => {
      let last: number;
      try {
        last = Number(localStorage.getItem(ACTIVITY_KEY)) || Date.now();
      } catch {
        last = Date.now();
      }
      const idleFor = Date.now() - last;
      const remaining = IDLE_TIMEOUT_MS - idleFor;

      if (remaining <= 0) {
        // Idle too long — sign out.
        setWarning(null);
        ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, markActive));
        document.removeEventListener('visibilitychange', markActive);
        if (timerRef.current) clearInterval(timerRef.current);
        try {
          localStorage.removeItem(ACTIVITY_KEY);
        } catch {}
        try {
          await supabase.auth.signOut();
        } catch {
          /* still redirect even if sign-out fails */
        }
        window.location.href = '/login?reason=idle';
        return;
      }

      if (remaining <= WARNING_LEAD_MS) {
        setWarning(Math.ceil(remaining / 1000));
      } else {
        setWarning(null);
      }
    };

    timerRef.current = setInterval(tick, 5000); // check every 5s

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, markActive));
      document.removeEventListener('visibilitychange', markActive);
    };
  }, [supabase]);

  const stayActive = () => {
    try {
      localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
    } catch {}
    setWarning(null);
  };

  if (warning === null) return null;

  return (
    <div
      role="alertdialog"
      aria-label="Session expiring"
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-yellow-700/50 bg-[#1a1a26] shadow-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-400 mb-1">
            Session about to expire
          </p>
          <p className="text-xs text-[#8888a0]">
            You&apos;ll be signed out in {warning}s due to inactivity.
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2 justify-end">
        <button
          onClick={stayActive}
          className="px-3 py-1.5 text-xs font-medium rounded bg-[#6366f1] hover:bg-[#5558d9] text-white transition"
        >
          Stay signed in
        </button>
      </div>
    </div>
  );
}
