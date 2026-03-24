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
      .select("plan, subscription_status")
      .eq("id", (profile as any).organization_id)
      .single() as any;

    if (orgError || !org) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Organization not found" },
        { status: 400 }
      );
    }

    const plan = (org as any).plan || 'basic';
    const planName = getPlanName(plan);
    const price = getPlanPrice(plan);
    const includesAiToolkit = plan === 'pro' || plan === 'enterprise';

    const subscriptionInfo: SubscriptionInfo = {
      plan,
      planName,
      price,
      status: (org as any).subscription_status || 'trialing',
      includesAiToolkit,
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
