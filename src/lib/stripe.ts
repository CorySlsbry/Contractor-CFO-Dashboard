/**
 * Stripe API helper class
 * Handles customer management, subscriptions, and billing portal
 */

import Stripe from "stripe";

export class StripeService {
  private stripe: Stripe;
  private basicPriceId: string;
  private proPriceId: string;
  private enterprisePriceId: string;

  constructor(
    apiKey: string = process.env.STRIPE_SECRET_KEY || "",
    basicPriceId: string = process.env.STRIPE_PRICE_ID_ESSENTIAL || "",
    proPriceId: string = process.env.STRIPE_PRICE_ID_PRO || "",
    enterprisePriceId: string = process.env.STRIPE_PRICE_ID_ENTERPRISE || ""
  ) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: "2026-02-25.clover",
    });
    this.basicPriceId = basicPriceId;
    this.proPriceId = proPriceId;
    this.enterprisePriceId = enterprisePriceId;
  }

  /**
   * Gets the price ID for a given plan
   */
  private getPriceId(plan: "basic" | "pro" | "enterprise"): string {
    if (plan === "enterprise") {
      return this.enterprisePriceId;
    }
    if (plan === "pro") {
      return this.proPriceId;
    }
    return this.basicPriceId;
  }

  /**
   * Creates a new Stripe customer
   */
  async createCustomer(
    email: string,
    name: string,
    orgId: string
  ): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
      name,
      metadata: {
        org_id: orgId,
      },
    });
  }

  /**
   * Retrieves a customer by ID
   */
  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    const result = await this.stripe.customers.retrieve(customerId);
    if ('deleted' in result && result.deleted) {
      throw new Error('Customer has been deleted');
    }
    return result as Stripe.Customer;
  }

  /**
   * Finds a customer by email
   */
  async findCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    const customers = await this.stripe.customers.list({
      email,
      limit: 1,
    });

    return customers.data.length > 0 ? customers.data[0] : null;
  }

  /**
   * Creates a Stripe checkout session
   */
  async createCheckoutSession(
    customerId: string,
    plan: "basic" | "pro" | "enterprise",
    orgId: string
  ): Promise<Stripe.Checkout.Session> {
    const priceId = this.getPriceId(plan);

    return this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/signup`,
      metadata: {
        org_id: orgId,
        plan,
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          org_id: orgId,
        },
      },
    });
  }

  /**
   * Creates a Stripe billing portal session
   * Optionally scoped to a specific subscription using flow_data
   */
  async createPortalSession(customerId: string, subscriptionId?: string): Promise<Stripe.BillingPortal.Session> {
    const params: Stripe.BillingPortal.SessionCreateParams = {
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    };

    // If we have a specific subscription ID, scope the portal to it
    if (subscriptionId) {
      params.flow_data = {
        type: 'subscription_update',
        subscription_update: {
          subscription: subscriptionId,
        },
      };
    }

    return this.stripe.billingPortal.sessions.create(params);
  }

  /**
   * Retrieves a subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Gets all subscriptions for a customer
   */
  async getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });

    return subscriptions.data;
  }

  /**
   * Cancels a subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    immediate: boolean = false
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !immediate,
    });
  }

  /**
   * Verifies a webhook signature
   */
  verifyWebhookSignature(
    body: string,
    signature: string,
    secret: string
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(body, signature, secret);
  }

  /**
   * Gets the plan from a price ID
   */
  getPlanFromPriceId(priceId: string): "basic" | "pro" | "enterprise" | null {
    if (priceId === this.enterprisePriceId) {
      return "enterprise";
    }
    if (priceId === this.proPriceId) {
      return "pro";
    }
    if (priceId === this.basicPriceId) {
      return "basic";
    }
    return null;
  }

  /**
   * Maps Stripe subscription status to app subscription status
   */
  mapSubscriptionStatus(
    status: string
  ): "trialing" | "active" | "past_due" | "canceled" {
    switch (status) {
      case "trialing":
        return "trialing";
      case "active":
        return "active";
      case "past_due":
        return "past_due";
      case "canceled":
      case "incomplete_expired":
        return "canceled";
      default:
        return "canceled";
    }
  }
}

// Export singleton instance
export const stripeService = new StripeService();
