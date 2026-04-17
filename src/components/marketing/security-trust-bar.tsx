import { Shield } from 'lucide-react';

/**
 * Above-the-fold security trust pill shown in the hero of every
 * marketing landing page. Calls out the three concrete assurances:
 *   - Two-factor authentication (authenticator app + SMS)
 *   - Bank-level encryption (TLS 1.3 + AES-256 at rest)
 *   - Read-only QuickBooks sync (we never write to their books)
 *
 * Paired visually with the indigo "built by X" pill that sits above it
 * in each hero — same shape, green accent for trust/safety.
 */
export default function SecurityTrustBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#22c55e]/5 border border-[#22c55e]/25 rounded-full pl-3 pr-4 py-1.5 mb-6 max-w-fit">
      <Shield size={14} className="text-[#22c55e] flex-shrink-0" />
      <p className="text-[11px] sm:text-xs text-[#d0d0e0] leading-tight">
        <span className="font-semibold text-[#4ade80]">Secure by design</span>
        <span className="text-[#8888a0]"> &mdash; two-factor authentication (authenticator app + SMS), bank-level encryption, read-only QuickBooks sync</span>
      </p>
    </div>
  );
}
