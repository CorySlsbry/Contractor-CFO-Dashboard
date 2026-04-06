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

    // Get client company (specific or first active)
    let clientQuery = supabase
      .from("client_companies")
      .select("*")
      .eq("organization_id", orgId)
      .eq("is_active", true);

    if (clientCompanyId) {
      clientQuery = clientQuery.eq("id", clientCompanyId);
    }

    const { data: clientCompany, error: clientError } = await (clientQuery as any)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (clientError || !clientCompany) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "No client company found. Connect a QBO company first." },
        { status: 400 }
      );
    }

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

        // Also update the org-level token for backward compat
        await (supabase as any)
          .from("organizations")
          .update({
            qbo_access_token: tokenResponse.access_token,
            qbo_refresh_token: tokenResponse.refresh_token,
            qbo_token_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", orgId);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Failed to refresh QuickBooks token" },
          { status: 400 }
        );
      }
    }

    const { startDate, endDate } = getDateRange();

    // Fetch QBO data
    let plData = {}, bsData = {}, invoiceData = {}, cfData = {};
    try {
      [plData, bsData, invoiceData, cfData] = await Promise.all([
        qboClient.getProfitAndLoss(accessToken, realmId, startDate, endDate).catch(e => { console.error("P&L fetch failed:", e.message); return {}; }),
        qboClient.getBalanceSheet(accessToken, realmId).catch(e => { console.error("BS fetch failed:", e.message); return {}; }),
        qboClient.getInvoices(accessToken, realmId).catch(e => { console.error("Invoice fetch failed:", e.message); return {}; }),
        qboClient.getCashFlow(accessToken, realmId, startDate, endDate).catch(e => { console.error("CF fetch failed:", e.message); return {}; }),
      ]);
    } catch (fetchError) {
      console.error("QBO data fetch error:", fetchError);
    }

    // Transform
    const profitAndLoss = transformProfitAndLoss(plData as any);
    const balanceSheet = transformBalanceSheet(bsData as any);
    const invoices = transformInvoices(invoiceData as any);
    const cashFlow = transformCashFlow(cfData as any);

    const dashboardData = buildDashboardData(profitAndLoss, balanceSheet, invoices, cashFlow);

    // Store snapshot linked to client company
    const { error: snapshotError } = await (supabase as any)
      .from("dashboard_snapshots")
      .insert({
        organization_id: orgId,
        client_company_id: clientCompany.id,
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
        message: `Synced ${clientCompany.name} successfully`,
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
