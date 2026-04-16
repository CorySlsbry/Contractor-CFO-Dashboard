#!/usr/bin/env node
/**
 * setup-stripe-whiteglove.mjs
 * ──────────────────────────────────────────────────────────────────────────
 * One-shot Stripe setup script for BuilderCFO:
 *   • White Glove tier ($1,499/mo recurring) — legacy, kept for back-compat
 *   • White Glove Custom Setup ($999 one-time add-on) — NEW
 *   • REFER20 coupon (20% off forever, applies to both subs AND one-time)
 *
 * What it does (idempotent):
 *   1. Creates / reuses Stripe Product "BuilderCFO White Glove" (monthly)
 *   2. Creates $1,499.00 USD monthly recurring price on that product
 *   3. Creates / reuses Stripe Product "BuilderCFO White Glove Setup" (one-time)
 *   4. Creates $999.00 USD one-time price on that product
 *   5. Creates / verifies REFER20 coupon (20% off, forever, applies_to=all)
 *   6. Prints env var values to paste into Vercel
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_xxx node scripts/setup-stripe-whiteglove.mjs
 *   STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-whiteglove.mjs
 *
 * Env vars to paste into Vercel → Settings → Environment Variables:
 *   STRIPE_PRICE_ID_WHITEGLOVE=price_xxx          (recurring $1,499/mo)
 *   STRIPE_PRICE_ID_WHITEGLOVE_SETUP=price_xxx    (one-time $999)
 *   STRIPE_COUPON_REFER20=REFER20                 (already matches, no need to change)
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
   1. PRODUCT — White Glove (recurring, legacy)
   ──────────────────────────────────────────────────────────────── */
const WG_PRODUCT_NAME = 'BuilderCFO White Glove';
const WG_PRODUCT_DESCRIPTION =
  'Done-for-you fractional controller for $10M+ construction builders. ' +
  'Includes dedicated controller, weekly strategy calls, monthly CFO review, ' +
  'custom board reports, priority integration setup, and direct Slack line.';

let wgProduct;
{
  console.log('▶ Step 1/5: Product — White Glove (recurring)');
  const existing = await stripe.products.search({
    query: `name:'${WG_PRODUCT_NAME}' AND active:'true'`,
    limit: 1,
  });
  if (existing.data.length > 0) {
    wgProduct = existing.data[0];
    ok(`Found existing product: ${wgProduct.id}`);
  } else {
    wgProduct = await stripe.products.create({
      name: WG_PRODUCT_NAME,
      description: WG_PRODUCT_DESCRIPTION,
      metadata: {
        tier: 'whiteglove',
        source: 'setup-stripe-whiteglove.mjs',
      },
    });
    ok(`Created new product: ${wgProduct.id}`);
  }
}

/* ────────────────────────────────────────────────────────────────
   2. PRICE — $1,499/mo recurring (legacy whiteglove tier)
   ──────────────────────────────────────────────────────────────── */
const WG_AMOUNT_CENTS = 149900; // $1,499.00
const CURRENCY = 'usd';

let wgPrice;
{
  console.log('\n▶ Step 2/5: Price — $1,499.00/mo recurring');
  const existingPrices = await stripe.prices.list({
    product: wgProduct.id,
    active: true,
    limit: 50,
  });
  const match = existingPrices.data.find((p) =>
    p.unit_amount === WG_AMOUNT_CENTS &&
    p.currency === CURRENCY &&
    p.recurring?.interval === 'month'
  );

  if (match) {
    wgPrice = match;
    ok(`Found existing price: ${wgPrice.id}`);
  } else {
    wgPrice = await stripe.prices.create({
      product: wgProduct.id,
      unit_amount: WG_AMOUNT_CENTS,
      currency: CURRENCY,
      recurring: { interval: 'month' },
      nickname: 'White Glove Monthly',
      metadata: { tier: 'whiteglove' },
    });
    ok(`Created new price: ${wgPrice.id}`);
  }
}

/* ────────────────────────────────────────────────────────────────
   3. PRODUCT — White Glove Custom Setup (one-time add-on)
   ──────────────────────────────────────────────────────────────── */
const WG_SETUP_PRODUCT_NAME = 'BuilderCFO White Glove Setup';
const WG_SETUP_PRODUCT_DESCRIPTION =
  'One-time setup add-on: our team handles every integration, builds your ' +
  'chart of accounts, reconciles historical data, and trains your team 1:1. ' +
  'Billed once at checkout alongside your BuilderCFO subscription.';

let wgSetupProduct;
{
  console.log('\n▶ Step 3/5: Product — White Glove Setup (one-time)');
  const existing = await stripe.products.search({
    query: `name:'${WG_SETUP_PRODUCT_NAME}' AND active:'true'`,
    limit: 1,
  });
  if (existing.data.length > 0) {
    wgSetupProduct = existing.data[0];
    ok(`Found existing product: ${wgSetupProduct.id}`);
  } else {
    wgSetupProduct = await stripe.products.create({
      name: WG_SETUP_PRODUCT_NAME,
      description: WG_SETUP_PRODUCT_DESCRIPTION,
      metadata: {
        tier: 'whiteglove-setup',
        billing_type: 'one_time',
        source: 'setup-stripe-whiteglove.mjs',
      },
    });
    ok(`Created new product: ${wgSetupProduct.id}`);
  }
}

/* ────────────────────────────────────────────────────────────────
   4. PRICE — $999 one-time (whiteglove setup add-on)
   ──────────────────────────────────────────────────────────────── */
const WG_SETUP_AMOUNT_CENTS = 99900; // $999.00

let wgSetupPrice;
{
  console.log('\n▶ Step 4/5: Price — $999.00 one-time');
  const existingPrices = await stripe.prices.list({
    product: wgSetupProduct.id,
    active: true,
    limit: 50,
  });
  // One-time price = no `recurring` field
  const match = existingPrices.data.find((p) =>
    p.unit_amount === WG_SETUP_AMOUNT_CENTS &&
    p.currency === CURRENCY &&
    !p.recurring
  );

  if (match) {
    wgSetupPrice = match;
    ok(`Found existing price: ${wgSetupPrice.id}`);
  } else {
    wgSetupPrice = await stripe.prices.create({
      product: wgSetupProduct.id,
      unit_amount: WG_SETUP_AMOUNT_CENTS,
      currency: CURRENCY,
      // No recurring = one-time payment
      nickname: 'White Glove Setup (one-time)',
      metadata: { tier: 'whiteglove-setup', billing_type: 'one_time' },
    });
    ok(`Created new price: ${wgSetupPrice.id}`);
  }
}

/* ────────────────────────────────────────────────────────────────
   5. COUPON — REFER20 (20% off forever, applies to ALL products)
   ──────────────────────────────────────────────────────────────── */
const COUPON_ID = 'REFER20';
const COUPON_NAME = 'Friend Referral (20% off)';

let coupon;
{
  console.log('\n▶ Step 5/5: Coupon REFER20 (20% off, forever, all products)');
  try {
    coupon = await stripe.coupons.retrieve(COUPON_ID);
    ok(`Found existing coupon: ${coupon.id}`);
    // Verify it isn't restricted to a subset of products — if it is, warn.
    if (coupon.applies_to && Array.isArray(coupon.applies_to.products) && coupon.applies_to.products.length > 0) {
      warn(
        `Coupon ${coupon.id} is restricted to specific products:`,
        coupon.applies_to.products.join(', ')
      );
      warn('For the add-on to get 20% off too, the coupon must apply to ALL products OR include the setup product.');
    }
  } catch (err) {
    if (err?.code === 'resource_missing') {
      coupon = await stripe.coupons.create({
        id: COUPON_ID,
        name: COUPON_NAME,
        percent_off: 20,
        duration: 'forever',
        // No applies_to → applies to every line item in checkout (subs + one-time)
        metadata: {
          source: 'referral-viral-loop',
          description: 'Prospect referred 2 friends → everyone gets 20% off on subscription AND White Glove setup',
        },
      });
      ok(`Created new coupon: ${coupon.id}`);
    } else {
      throw err;
    }
  }
}

/* ────────────────────────────────────────────────────────────────
   OUTPUT — env vars to paste into Vercel
   ──────────────────────────────────────────────────────────────── */
console.log('\n─────────────────────────────────────────────');
console.log(' ✅ DONE');
console.log('─────────────────────────────────────────────\n');

console.log('Paste these into Vercel → Project Settings → Environment Variables:\n');
console.log(`  STRIPE_PRICE_ID_WHITEGLOVE=${wgPrice.id}`);
console.log(`  STRIPE_PRICE_ID_WHITEGLOVE_SETUP=${wgSetupPrice.id}`);
console.log(`  STRIPE_COUPON_REFER20=${coupon.id}`);

console.log('\nOr add them locally:\n');
console.log('  echo "STRIPE_PRICE_ID_WHITEGLOVE=' + wgPrice.id + '" >> .env.local');
console.log('  echo "STRIPE_PRICE_ID_WHITEGLOVE_SETUP=' + wgSetupPrice.id + '" >> .env.local');
console.log('  echo "STRIPE_COUPON_REFER20=' + coupon.id + '" >> .env.local');

console.log('\nQuick verification:');
console.log(`  WG Product:        ${wgProduct.id}  (${WG_PRODUCT_NAME})`);
console.log(`  WG Price:          ${wgPrice.id}  ($${(WG_AMOUNT_CENTS / 100).toFixed(2)} / month)`);
console.log(`  WG Setup Product:  ${wgSetupProduct.id}  (${WG_SETUP_PRODUCT_NAME})`);
console.log(`  WG Setup Price:    ${wgSetupPrice.id}  ($${(WG_SETUP_AMOUNT_CENTS / 100).toFixed(2)} one-time)`);
console.log(`  Coupon:            ${coupon.id}  (${coupon.percent_off}% off ${coupon.duration})`);

if (isLive) {
  console.log('\n🔴 These IDs are LIVE. Make sure you ran this on the right account.');
} else {
  console.log('\n🧪 These IDs are TEST mode. Re-run with sk_live_ to set up production.');
}

console.log('\nNext: redeploy Vercel to pick up the new env vars.\n');
