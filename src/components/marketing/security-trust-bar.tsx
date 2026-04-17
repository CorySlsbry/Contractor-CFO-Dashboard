import { Lock } from 'lucide-react';

/**
 * Above-the-fold security trust pill shown in the hero of every
 * marketing landing page. Matches the SellerCFO security copy pattern:
 *   - 2FA (TOTP + SMS)
 *   - Encrypted data (TLS 1.3 in transit, AES-256 at rest)
 *   - Audit logs on every account (security_audit_log)
 *
 * Paired visually with the indigo "built by X" pill that sits above it
 * in each hero — same shape, green accent for trust/safety.
 */
export default function SecurityTrustBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#22c55e]/5 border border-[#22c55e]/25 rounded-full pl-3 pr-4 py-1.5 mb-6 max-w-fit">
      <Lock size={14} className="text-[#22c55e] flex-shrink-0" />
      <p className="text-[11px] sm:text-xs text-[#d0d0e0] leading-tight">
        <span className="font-semibold text-[#4ade80]">Enterprise-ready security</span>
        <span className="text-[#8888a0]"> &mdash; 2FA, encrypted data, audit logs on every account</span>
      </p>
    </div>
  );
}
