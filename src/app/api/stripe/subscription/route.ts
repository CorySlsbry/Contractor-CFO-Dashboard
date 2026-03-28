/**
 * Get Current Subscription Info Endpoint
 * GET /api/stripe/subscription
 * Returns the current subscription details for the authenticated user's organization
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { getPlanName, getPlanPrice } from "@/lib/plan-features";
import type { ApiResponse } from "@/types";

interface SubscriptionInfo {
  plan: 'basic' | 'pro' | 'enterprise';
  planName: string;
  price: number;
  status: string;
  includesAiToolkit: boolean;
  organizationName: string | null;
  userEmail: string | null;
  userFullName: string | null;
  trialEndsAt: string | null;
  trialDaysRemaining: number | null;
}

export async function GET(request: NextRequest) {
  try {
    // Ensure user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's organization
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single() as any;

    if (profileError || !profile?.organization_id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Organization not found" },
        { status: 400 }
      );
    }

    // Get organization with subscription details
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("name, plan, subscription_status, created_at, trial_ends_at")
      .eq("id", (profile as any).organization_id)
      .single() as any;

    if (orgError || !org) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Organization not found" },
        { status: 400 }
      );
    }

    // Get user profile info (full_name)
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single() as any;

    const plan = (org as any).plan || 'basic';
    const planName = getPlanName(plan);
    const price = getPlanPrice(plan);
    const includesAiToolkit = plan === 'pro' || plan === 'enterprise';
    const status = (org as any).subscription_status || 'trialing';

    // Calculate trial info
    let trialEndsAt: string | null = null;
    let trialDaysRemaining: number | null = null;

    if (status === 'trialing') {
      // Use trial_ends_at if available (set by webhook from Stripe),
      // otherwise calculate from created_at + 14 days
      if ((org as any).trial_ends_at) {
        trialEndsAt = (org as any).trial_ends_at;
      } else if ((org as any).created_at) {
        const createdDate = new Date((org as any).created_at);
        const trialEnd = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);
        trialEndsAt = trialEnd.toISOString();
      }

      if (trialEndsAt) {
        const now = new Date();
        const endDate = new Date(trialEndsAt);
        const msRemaining = endDate.getTime() - now.getTime();
        trialDaysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
      }
    }

    const subscriptionInfo: SubscriptionInfo = {
      plan,
      planName,
      price,
      status,
      includesAiToolkit,
      organizationName: (org as any).name || null,
      userEmail: user.email || null,
      userFullName: userProfile?.full_name || null,
      trialEndsAt,
      trialDaysRemaining,
    };

    return NextResponse.json<ApiResponse<SubscriptionInfo>>(
      {
        success: true,
        data: subscriptionInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription info error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
