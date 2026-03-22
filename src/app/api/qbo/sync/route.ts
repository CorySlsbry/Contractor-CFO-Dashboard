/**
 * QBO Sync Endpoint
 * POST /api/qbo/sync
 * Pulls fresh financial data from QuickBooks Online
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { qboClient } from "@/lib/qbo";
import type { TokenResponse } from "@/lib/qbo";
import {
  transformProfitAndLoss,
  transformBalanceSheet,
  transformInvoices,
  transformCashFlow,
  buildDashboardData,
} from "@/lib/qbo-transform";
import type { ApiResponse, DashboardData } from "@/types";

/**
 * Checks if token needs refreshing
 */
function isTokenExpired(expiresAt: string): boolean {
  const expiration = new Date(expiresAt);
  const now = new Date();
  // Consider expired if less than 5 minutes remaining
  return expiration.getTime() - now.getTime() < 5 * 60 * 1000;
}

/**
 * Gets date range for reports (last 12 months)
 */
function getDateRange(): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}

export async function POST(request: NextRequest) {
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

    // Get organization with QBO credentials
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", (profile as any).organization_id)
      .single() as any;

    if (orgError || !org) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Organization not found" },
        { status: 400 }
      );
    }

    if (!(org as any).qbo_realm_id || !(org as any).qbo_access_token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "QuickBooks not connected" },
        { status: 400 }
      );
    }

    let accessToken = (org as any).qbo_access_token;

    // Refresh token if expired
    if ((org as any).qbo_token_expires_at && isTokenExpired((org as any).qbo_token_expires_at)) {
      if (!(org as any).qbo_refresh_token) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Cannot refresh token" },
          { status: 400 }
        );
      }

      try {
        const tokenResponse = await qboClient.refreshToken((org as any).qbo_refresh_token);
        accessToken = tokenResponse.access_token;

        // Update tokens in database
        const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
        await (supabase as any)
          .from("organizations")
          .update({
            qbo_access_token: tokenResponse.access_token,
            qbo_refresh_token: tokenResponse.refresh_token,
            qbo_token_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", (org as any).id);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Failed to refresh QuickBooks token" },
          { status: 400 }
        );
      }
    }

    // Get date range for reports
    const { startDate, endDate } = getDateRange();

    // Fetch data in parallel
    const [plData, bsData, invoiceData, cfData] = await Promise.all([
      qboClient.getProfitAndLoss(accessToken, (org as any).qbo_realm_id, startDate, endDate),
      qboClient.getBalanceSheet(accessToken, (org as any).qbo_realm_id),
      qboClient.getInvoices(accessToken, (org as any).qbo_realm_id),
      qboClient.getCashFlow(accessToken, (org as any).qbo_realm_id, startDate, endDate),
    ]);

    // Transform data
    const profitAndLoss = transformProfitAndLoss(plData);
    const balanceSheet = transformBalanceSheet(bsData);
    const invoices = transformInvoices(invoiceData);
    const cashFlow = transformCashFlow(cfData);

    // Build complete dashboard data
    const dashboardData = buildDashboardData(
      profitAndLoss,
      balanceSheet,
      invoices,
      cashFlow
    );

    // Store snapshot in database
    const { error: snapshotError } = await (supabase as any)
      .from("dashboard_snapshots")
      .insert({
        organization_id: (org as any).id,
        data: dashboardData,
        pulled_at: new Date().toISOString(),
      });

    if (snapshotError) {
      console.error("Failed to store snapshot:", snapshotError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Failed to store dashboard data" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<DashboardData>>(
      {
        success: true,
        data: dashboardData,
        message: "Dashboard data synced successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("QBO Sync Error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to sync QuickBooks data" },
      { status: 500 }
    );
  }
}
