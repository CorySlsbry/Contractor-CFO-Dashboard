/**
 * Stripe Webhook Endpoint
 * POST /api/stripe/webhook
 * Handles Stripe webhook events
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { createAdminClient } from "@/lib/supabase/admin";
import { stripeService } from "@/lib/stripe";
import type Stripe from "stripe";

/**
 * Maps Stripe subscription status to internal status
 */
function mapSubscriptionStatus(
  status: string
): "trialing" | "active" | "past_due" | "canceled" {
  return stripeService.mapSubscriptionStatus(status);
}

/**
 * Gets plan from subscription
 */
async function getPlanFromSubscription(
  subscription: Stripe.Subscription
): Promise<"basic" | "pro" | "enterprise"> {
  if (!subscription.items.data[0]?.price.id) {
    return "basic";
  }

  const plan = stripeService.getPlanFromPriceId(subscription.items.data[0].price.id);
  return plan || "basic";
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripeService.verifyWebhookSignature(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // CRITICAL: Use admin client — webhook requests from Stripe have NO auth cookies.
    // The server client (anon key + RLS) would silently fail every update.
    const supabase = createAdminClient();

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.org_id;

        if (!orgId || !session.subscription) {
          console.warn("Incomplete checkout session data");
          break;
        }

        try {
          const subscription = await stripeService.getSubscription(
            session.subscription as string
          );

          const plan = await getPlanFromSubscription(subscription);
          const status = mapSubscriptionStatus(subscription.status);

          // Build update payload
          const updatePayload: Record<string, any> = {
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: status,
            plan,
            updated_at: new Date().toISOString(),
          };

          // Store trial end date if subscription is trialing
          if (subscription.trial_end) {
            updatePayload.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString();
          }

          // Update organization
          await (supabase
            .from("organizations") as any)
            .update(updatePayload)
            .eq("id", orgId);

          console.log(`Subscription created for org ${orgId}: ${status} ${plan}${subscription.trial_end ? ` (trial ends ${new Date(subscription.trial_end * 1000).toISOString()})` : ''}`);
        } catch (error) {
          console.error("Failed to process checkout session:", error);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const orgId = subscription.metadata?.org_id;

        if (!orgId) {
          console.warn("Missing org_id in subscription metadata");
          break;
        }

        try {
          const plan = await getPlanFromSubscription(subscription);
          const status = mapSubscriptionStatus(subscription.status);

          // Update organization
          await (supabase
            .from("organizations") as any)
            .update({
              stripe_subscription_id: subscription.id,
              subscription_status: status,
              plan,
              updated_at: new Date().toISOString(),
            })
            .eq("id", orgId);

          console.log(`Subscription updated for org ${orgId}: ${status} ${plan}`);
        } catch (error) {
          console.error("Failed to process subscription update:", error);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata?.org_id;

        if (!orgId) {
          console.warn("Missing org_id in subscription metadata");
          break;
        }

        try {
          // Update organization
          await (supabase
            .from("organizations") as any)
            .update({
              subscription_status: "canceled",
              plan: "basic",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orgId);

          console.log(`Subscription canceled for org ${orgId}`);
        } catch (error) {
          console.error("Failed to process subscription deletion:", error);
        }
        break;
      }

      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
