#!/usr/bin/env node
/**
 * setup-stripe-whiteglove.mjs
 * ──────────────────────────────────────────────────────────────────────────
 * One-shot Stripe setup script for the BuilderCFO White Glove tier +
 * REFER20 referral coupon.
 *
 * What it does (idempotent):
 *   1. Creates / reuses a Stripe Product  "BuilderCFO White Glove"
 *   2. Creates a $2,997.00 USD monthly recurring Price on that product
 *      (skipped if an identical active price already exists)
 *   3. Creates the REFER20 coupon (20% off, forever duration)
 *      (skipped if it already exists)
 *   4. Prints the IDs you need to paste into Vercel environment variables.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_xxx node scripts/setup-stripe-whiteglove.mjs
 *   STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-whiteglove.mjs
 *
 * After running, paste the output IDs into Vercel → Project Settings →
 * Environment Variables:
 *   STRIPE_PRICE_ID_WHITEGLOVE=price_xxx
 *   STRIPE_COUPON_REFER20=REFER20      (already matches, no need to change)
 *
 * Requirements:
 *   npm install stripe
 */

import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error('\n❌ STRIPE_SECRET_KEY env var is required.');
  console.error('   Run with:');
  console.error('     STRIPE_SECRET_KEY=sk_live_xxx node scripts/setup-stripe-whiteglove.mjs\n');
  process.exit(1);
}

const isLive = key.startsWith('sk_live_');
const stripe = new Stripe(key, { apiVersion: '2026-02-25.clover' });

const log = (...args) => console.log('  ', ...args);
const ok  = (...args) => console.log('✅', ...args);
const warn= (...args) => console.log('⚠️ ', ...args);

console.log('\n─────────────────────────────────────────────');
console.log(' BuilderCFO White Glove — Stripe setup');
console.log(' Mode:', isLive ? 'LIVE 🔴' : 'TEST 🧪');
console.log('─────────────────────────────────────────────\n');

/* ────────────────────────────────────────────────────────────────
   1. PRODUCT
   ──────────────────────────────────────────────────────────────── */
const PRODUCT_NAME = 'BuilderCFO White Glove';
const PRODUCT_DESCRIPTION =
  'Done-for-you fractional controller for $10M+ construction builders. ' +
  'Includes dedicated controller, weekly strategy calls, monthly CFO review, ' +
  'custom board reports, priority integration setup, and direct Slack line.';

let product;
{
  console.log('▶ Step 1/3: Product');
  const existing = await stripe.products.search({
    query: `name:'${PRODUCT_NAME}' AND active:'true'`,
    limit: 1,
  });
  if (existing.data.length > 0) {
    product = existing.data[0];
    ok(`Found existing product: ${product.id}`);
  } else {
    product = await stripe.products.create({
      name: PRODUCT_NAME,
      description: PRODUCT_DESCRIPTION,
      metadata: {
        tier: 'whiteglove',
        source: 'setup-stripe-whiteglove.mjs',
      },
    });
    ok(`Created new product: ${product.id}`);
  }
}

/* ────────────────────────────────────────────────────────────────
   2. PRICE — $2,997/mo recurring
   ──────────────────────────────────────────────────────────────── */
const TARGET_AMOUNT_CENTS = 299700; // $2,997.00
const TARGET_CURRENCY = 'usd';

let price;
{
  console.log('\n▶ Step 2/3: Price ($2,997.00/mo recurring)');
  const existingPrices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 50,
  });
  const match = existingPrices.data.find((p) =>
    p.unit_amount === TARGET_AMOUNT_CENTS &&
    p.currency === TARGET_CURRENCY &&
    p.recurring?.interval === 'month'
  );

  if (match) {
    price = match;
    ok(`Found existing price: ${price.id}`);
  } else {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: TARGET_AMOUNT_CENTS,
      currency: TARGET_CURRENCY,
      recurring: { interval: 'month' },
      nickname: 'White Glove Monthly',
      metadata: { tier: 'whiteglove' },
    });
    ok(`Created new price: ${price.id}`);
  }
}

/* ────────────────────────────────────────────────────────────────
   3. COUPON — REFER20 (20% off forever)
   ──────────────────────────────────────────────────────────────── */
const COUPON_ID = 'REFER20';
const COUPON_NAME = 'Friend Referral (20% off)';

let coupon;
{
  console.log('\n▶ Step 3/3: Coupon REFER20 (20% off, forever)');
  try {
    coupon = await stripe.coupons.retrieve(COUPON_ID);
    ok(`Found existing coupon: ${coupon.id}`);
  } catch (err) {
    if (err?.code === 'resource_missing') {
      coupon = await stripe.coupons.create({
        id: COUPON_ID,
        name: COUPON_NAME,
        percent_off: 20,
        duration: 'forever',
        metadata: {
          source: 'referral-viral-loop',
          description: 'Prospect referred 2 friends → everyone gets 20% off',
        },
      });
      ok(`Created new coupon: ${coupon.id}`);
    } else {
      throw err;
    }
  }
}

/* ────────────────────────────────────────────────────────────────
   4. OUTPUT — env vars to paste into Vercel
   ──────────────────────────────────────────────────────────────── */
console.log('\n─────────────────────────────────────────────');
console.log(' ✅ DONE');
console.log('─────────────────────────────────────────────\n');

console.log('Paste these into Vercel → Project Settings → Environment Variables:\n');
console.log(`  STRIPE_PRICE_ID_WHITEGLOVE=${price.id}`);
console.log(`  STRIPE_COUPON_REFER20=${coupon.id}`);

console.log('\nOr add them locally:\n');
console.log('  echo "STRIPE_PRICE_ID_WHITEGLOVE=' + price.id + '" >> .env.local');
console.log('  echo "STRIPE_COUPON_REFER20=' + coupon.id + '" >> .env.local');

console.log('\nQuick verification:');
console.log(`  Product:  ${product.id}  (${PRODUCT_NAME})`);
console.log(`  Price:    ${price.id}  ($${(TARGET_AMOUNT_CENTS / 100).toFixed(2)} / month)`);
console.log(`  Coupon:   ${coupon.id}  (${coupon.percent_off}% off ${coupon.duration})`);

if (isLive) {
  console.log('\n🔴 These IDs are LIVE. Make sure you ran this on the right account.');
} else {
  console.log('\n🧪 These IDs are TEST mode. Re-run with sk_live_ to set up production.');
}

console.log('\nNext: redeploy Vercel to pick up the new env vars.\n');
