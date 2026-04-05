/**
 * QBO Sync Endpoint
 * POST /api/qbo/sync
 * Pulls fresh financial data from QuickBooks Online for a specific client company
 * Body: { clientCompanyId?: string } — if omitted, syncs the first active client
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { qboClient } from "@/lib/qbo";
import {
  transformProfitAndLoss,
  transformBalanceSheet,
  transformInvoices,
  transformCashFlow,
  buildDashboardData,
} from "@/lib/qbo-transform";
import type { ApiResponse, DashboardData } from "@/types";

function isTokenExpired(expiresAt: string): boolean {
  const expiration = new Date(expiresAt);
  const now = new Date();
  return expiration.getTime() - now.getTime() < 5 * 60 * 1000;
}

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
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single() as any;

    if (!profile?.organization_id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Organization not found" },
        { status: 400 }
      );
    }

    const orgId = profile.organization_id;

    // Parse optional clientCompanyId from request body
    let clientCompanyId: string | null = null;
    try {
      const body = await request.json();
      clientCompanyId = body.clientCompanyId || null;
    } catch {
      // No body or invalid JSON — that's fine, we'll use default
    }

    console.log("[sync] orgId:", orgId, "clientCompanyId:", clientCompanyId);

    // Get client company — two separate queries to avoid chain issues
    let clientCompany: any = null;
    let clientError: any = null;

    if (clientCompanyId) {
      // Fetch specific client
      const result = await (supabase as any)
        .from("client_companies")
        .select("*")
        .eq("organization_id", orgId)
        .eq("id", clientCompanyId)
        .eq("is_active", true)
        .single();
      clientCompany = result.data;
      clientError = result.error;
    } else {
      // Fetch first active client
      const result = await (supabase as any)
        .from("client_companies")
        .select("*")
        .eq("organization_id", orgId)
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();
      clientCompany = result.data;
      clientError = result.error;
    }

    if (clientError || !clientCompany) {
      console.error("[sync] Client query error:", clientError?.message || "no client found");
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "No client company found. Connect a QBO company first." },
        { status: 400 }
      );
    }

    console.log("[sync] Found client:", clientCompany.name, "realm:", clientCompany.qbo_realm_id);

    if (!clientCompany.qbo_realm_id || !clientCompany.qbo_access_token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "QuickBooks not connected for this client" },
        { status: 400 }
      );
    }

    let accessToken = clientCompany.qbo_access_token;
    const realmId = clientCompany.qbo_realm_id;

    // Refresh token if expired
    if (clientCompany.qbo_token_expires_at && isTokenExpired(clientCompany.qbo_token_expires_at)) {
      if (!clientCompany.qbo_refresh_token) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Cannot refresh token — reconnect QBO" },
          { status: 400 }
        );
      }

      try {
        console.log("[sync] Refreshing token for", clientCompany.name);
        const tokenResponse = await qboClient.refreshToken(clientCompany.qbo_refresh_token);
        accessToken = tokenResponse.access_token;

        const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
        await (supabase as any)
          .from("client_companies")
          .update({
            qbo_access_token: tokenResponse.access_token,
            qbo_refresh_token: tokenResponse.refresh_token,
            qbo_token_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", clientCompany.id);
      } catch (refreshError: any) {
        console.error("[sync] Token refresh failed:", refreshError?.message);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Failed to refresh QuickBooks token" },
          { status: 400 }
        );
      }
    }

    const { startDate, endDate } = getDateRange();

    // Fetch QBO data with individual error handling
    // P&L (totals), Balance Sheet, Invoices, and Monthly P&L (for cash flow)
    let plData: any = {};
    let bsData: any = {};
    let invoiceData: any = {};
    let monthlyPlData: any = {};

    try {
      const results = await Promise.allSettled([
        qboClient.getProfitAndLoss(accessToken, realmId, startDate, endDate),
        qboClient.getBalanceSheet(accessToken, realmId),
        qboClient.getInvoices(accessToken, realmId),
        qboClient.getMonthlyProfitAndLoss(accessToken, realmId, startDate, endDate),
      ]);

      plData = results[0].status === "fulfilled" ? results[0].value : {};
      bsData = results[1].status === "fulfilled" ? results[1].value : {};
      invoiceData = results[2].status === "fulfilled" ? results[2].value : {};
      monthlyPlData = results[3].status === "fulfilled" ? results[3].value : {};

      // Log any failures
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          const labels = ["P&L", "Balance Sheet", "Invoices", "Monthly P&L"];
          console.error(`[sync] ${labels[i]} fetch failed:`, r.reason?.message || r.reason);
        }
      });
    } catch (fetchError: any) {
      console.error("[sync] QBO data fetch error:", fetchError?.message);
    }

    console.log("[sync] Fetched data — P&L rows:", plData?.Rows?.Row?.length || 0,
      "BS rows:", bsData?.Rows?.Row?.length || 0,
      "Invoices:", invoiceData?.QueryResponse?.Invoice?.length || 0,
      "Monthly P&L cols:", monthlyPlData?.Columns?.Column?.length || 0);

    // Transform with error handling
    let dashboardData: DashboardData;
    try {
      const profitAndLoss = transformProfitAndLoss(plData || {});
      const balanceSheet = transformBalanceSheet(bsData || {});
      const invoices = transformInvoices(invoiceData || {});
      const cashFlow = transformCashFlow(monthlyPlData || {});

      console.log("[sync] Transformed — revenue:", profitAndLoss.revenue,
        "expenses:", profitAndLoss.expenses, "cash:", balanceSheet.cashBalance,
        "invoices:", invoices.length);

      dashboardData = buildDashboardData(profitAndLoss, balanceSheet, invoices, cashFlow);
    } catch (transformError: any) {
      console.error("[sync] Transform error:", transformError?.message, transformError?.stack);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Failed to transform QBO data: " + (transformError?.message || "unknown") },
        { status: 500 }
      );
    }

    // Store snapshot linked to client company
    try {
      const { error: snapshotError } = await (supabase as any)
        .from("dashboard_snapshots")
        .insert({
          organization_id: orgId,
          client_company_id: clientCompany.id,
          data: dashboardData,
          pulled_at: new Date().toISOString(),
        });

      if (snapshotError) {
        console.error("[sync] Snapshot insert error:", snapshotError.message, snapshotError.details);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Failed to store dashboard data: " + snapshotError.message },
          { status: 500 }
        );
      }
    } catch (insertError: any) {
      console.error("[sync] Snapshot insert exception:", insertError?.message, insertError?.stack);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Failed to store dashboard data" },
        { status: 500 }
      );
    }

    console.log("[sync] Success for", clientCompany.name);

    return NextResponse.json<ApiResponse<DashboardData>>(
      {
        success: true,
        data: dashboardData,
        message: `Synced ${clientCompany.name} successfully`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[sync] Unhandled error:", error?.message, error?.stack);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to sync QuickBooks data: " + (error?.message || "unknown error") },
      { status: 500 }
    );
  }
}
