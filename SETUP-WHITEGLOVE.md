# White Glove Tier + Referral Loop — Setup Checklist

This doc covers the manual Stripe + Vercel steps needed after shipping the
White Glove tier code. Do this **once** per environment (test + live).

## 1. Create the Stripe product, price, and coupon

From the repo root:

```bash
# TEST mode first (verify everything works)
STRIPE_SECRET_KEY=sk_test_xxxxxxx node scripts/setup-stripe-whiteglove.mjs

# Then LIVE mode
STRIPE_SECRET_KEY=sk_live_xxxxxxx node scripts/setup-stripe-whiteglove.mjs
```

The script is idempotent — running it twice is safe. It will:

- Find or create product `BuilderCFO White Glove`
- Find or create a $2,997/mo recurring USD price on that product
- Find or create coupon `REFER20` (20% off, forever duration)
- Print the IDs you need for environment variables

If `stripe` isn't installed, run `npm install` first (it's already in
`package.json` because the app uses Stripe).

## 2. Add environment variables to Vercel

Vercel → Project → Settings → Environment Variables → **Production**:

```
STRIPE_PRICE_ID_WHITEGLOVE=price_xxxxxxxxxxxxx  (from step 1 output)
STRIPE_COUPON_REFER20=REFER20
```

Repeat for **Preview** and **Development** with the test-mode IDs.

After adding, click **Redeploy** on the latest deployment so the new env vars
are picked up.

## 3. Verify the flow

Landing page (`/`) → scroll to Pricing → click **Talk to Our Team** on the
White Glove card. The new `WhiteGloveBookingModal` should open with:

- Left: month calendar, click a weekday, see 6 time slots (11:00, 11:30, 12:00, 12:30, 1:00, 1:30 MT), pick one, fill in name + company + email + phone + notes
- Right: "What's on the call" + logistics + shortcut button to start a free trial
- Submit → creates Google Meet event on `cory.salisbury@gmail.com`, sends invite to prospect, pushes contact to GHL with tags `whiteglove-intro-booked` + `whiteglove-lead` + `buildercfo-landing`

The White Glove tier is exactly **15 minutes** of call time but reserves a
**30-minute** block on the calendar. All other tiers still use the
`ReferralModal` (unchanged).

## 4. Referral discount flow

Existing 3 tiers (Starter / Pro / Enterprise):

1. Prospect clicks **Start Free Trial** on a pricing tier → `ReferralModal` opens
2. They enter their email + 2 friend emails → `POST /api/referrals`
3. localStorage stores `referralDiscount=REFER20` + `referralEmail=<their email>`
4. `/signup?plan=X&discount=REFER20&ref=<their email>` loads with the 20%-off banner
5. They sign up (free trial starts immediately, no card needed)
6. Later, when they convert from trial to paid, the dashboard's upgrade UI should
   read the stored discount and pass it to `POST /api/stripe/checkout` as
   `{ plan, discountCode: 'REFER20' }`
7. The checkout route applies the `REFER20` coupon via Stripe's `discounts` param
   (forever duration — 20% off for the life of the subscription)

White Glove tier:

1. Prospect clicks **Talk to Our Team** → `WhiteGloveBookingModal` opens
2. They book a 15-minute intro call (no referral requirement)
3. If they want they can also click the shortcut to start a free trial
   without talking first → `/signup?plan=whiteglove`

## 5. Code changes in this release

- `src/components/WhiteGloveBookingModal.tsx` — NEW
- `src/components/booking-calendar.tsx` — accepts `variant="whiteglove"` + accent color + optional phone/notes fields
- `src/app/api/booking/slots/route.ts` — accepts `?type=whiteglove` (30-min block)
- `src/app/api/booking/confirm/route.ts` — accepts `type: 'whiteglove'` in body
- `src/app/page.tsx` — White Glove button opens booking modal (not referral)
- `src/app/start/page.tsx` — same
- `src/lib/stripe.ts` — `StripePlan` type + `whiteglove` price ID + `createCheckoutSession` accepts `{ couponId, discountCode }`
- `src/app/api/stripe/checkout/route.ts` — accepts `whiteglove` plan + `discountCode` body field, maps to coupon
- `scripts/setup-stripe-whiteglove.mjs` — NEW (idempotent setup)
- `SETUP-WHITEGLOVE.md` — THIS FILE

## 6. Verification SQL (optional)

To see GHL contacts tagged with white glove bookings, search for
`whiteglove-intro-booked` in GHL's contact list. The booking shows up as a
Google Calendar event titled `BuilderCFO White Glove Intro — <Name> (<Company>)`
on `cory.salisbury@gmail.com`.
