/**
 * QBO Data Endpoint
 * GET /api/qbo/data
 * Returns the latest dashboard snapshot
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, DashboardData } from "@/types";

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

    if (profileError || !(profile as any)?.organization_id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Organization not found" },
        { status: 400 }
      );
    }

    // Get latest dashboard snapshot
    const { data: snapshot, error: snapshotError } = await supabase
      .from("dashboard_snapshots")
      .select("*")
      .eq("organization_id", (profile as any).organization_id)
      .order("pulled_at", { ascending: false })
      .limit(1)
      .single() as any;

    if (snapshotError) {
      // No snapshot yet - return empty state
      return NextResponse.json<ApiResponse<DashboardData>>(
        {
          success: true,
          data: {
            revenue: 0,
            expenses: 0,
            profit: 0,
            cash_balance: 0,
            accounts_receivable: 0,
            accounts_payable: 0,
            jobs: [],
            invoices: [],
            cash_flow: [],
            metrics: [],
            last_updated: new Date().toISOString(),
          },
          message: "No data available. Please sync QuickBooks data.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json<ApiResponse<DashboardData>>(
      {
        success: true,
        data: (snapshot as any).data as DashboardData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("QBO Data Error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
