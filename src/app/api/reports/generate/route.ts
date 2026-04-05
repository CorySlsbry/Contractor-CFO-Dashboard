/**
 * Reports Generation Endpoint
 * POST /api/reports/generate
 * Generates financial reports from QuickBooks data
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { qboClient } from "@/lib/qbo";
import type { ApiResponse } from "@/types";

interface GenerateReportRequest {
  reportType: string;
  startDate: string;
  endDate: string;
}

/**
 * Checks if token needs refreshing
 */
function isTokenExpired(expiresAt: string): boolean {
  const expiration = new Date(expiresAt);
  const now = new Date();
  return expiration.getTime() - now.getTime() < 5 * 60 * 1000;
}

/**
 * Extracts numeric value from QBO data
 */
function extractAmount(value: string | number | undefined): number {
  if (value === undefined || value === null || value === "") return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

/**
 * Transforms P&L data into report format
 */
function transformPLReport(qboData: any): any {
  const revenues: Array<{ category: string; amount: number }> = [];
  const expenses: Array<{ category: string; amount: number }> = [];
  let totalRevenue = 0;
  let totalExpenses = 0;

  if (qboData?.groupOf) {
    for (const group of qboData.groupOf) {
      const groupName = group.groupName || "";
      const amount = extractAmount(group.summary?.totalAmt);

      if (
        groupName.toLowerCase().includes("income") ||
        groupName.toLowerCase().includes("revenue")
      ) {
        revenues.push({ category: groupName, amount: Math.max(0, amount) });
        totalRevenue += Math.max(0, amount);
      } else if (
        groupName.toLowerCase().includes("expense") ||
        groupName.toLowerCase().includes("cost")
      ) {
        expenses.push({ category: groupName, amount: Math.max(0, amount) });
        totalExpenses += Math.max(0, amount);
      }
    }
  }

  return {
    revenues: revenues.length > 0 ? revenues : [{ category: "No revenue data", amount: 0 }],
    expenses: expenses.length > 0 ? expenses : [{ category: "No expense data", amount: 0 }],
    totalRevenue,
    totalExpenses,
    netIncome: totalRevenue - totalExpenses,
  };
}

/**
 * Transforms Balance Sheet data into report format
 */
function transformBalanceSheetReport(qboData: any): any {
  const assets: Array<{ category: string; amount: number; subcategories: any[] }> = [];
  const liabilities: Array<{ category: string; amount: number; subcategories: any[] }> = [];
  const equity: Array<{ category: string; amount: number; subcategories: any[] }> = [];
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;

  if (qboData?.groupOf) {
    for (const group of qboData.groupOf) {
      const groupName = group.groupName?.toLowerCase() || "";
      const amount = extractAmount(group.summary?.totalAmt);

      if (groupName.includes("asset")) {
        assets.push({ category: group.groupName || "Assets", amount: Math.max(0, amount), subcategories: [] });
        totalAssets += Math.max(0, amount);
      } else if (groupName.includes("liability")) {
        liabilities.push({ category: group.groupName || "Liabilities", amount: Math.max(0, amount), subcategories: [] });
        totalLiabilities += Math.max(0, amount);
      } else if (groupName.includes("equity")) {
        equity.push({ category: group.groupName || "Equity", amount: Math.max(0, amount), subcategories: [] });
        totalEquity += Math.max(0, amount);
      }
    }
  }

  return {
    assets: assets.length > 0 ? assets : [{ category: "No asset data", amount: 0, subcategories: [] }],
    liabilities: liabilities.length > 0 ? liabilities : [{ category: "No liability data", amount: 0, subcategories: [] }],
    equity: equity.length > 0 ? equity : [{ category: "No equity data", amount: 0, subcategories: [] }],
    totalAssets,
    totalLiabilities,
    totalEquity,
  };
}

/**
 * Calculates days old from due date
 */
function calculateDaysOld(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Classifies aging status based on days
 */
function getAgingStatus(daysOld: number): "Current" | "Overdue" | "Past Due" {
  if (daysOld <= 30) return "Current";
  if (daysOld <= 60) return "Overdue";
  return "Past Due";
}

/**
 * Transforms invoices into AR Aging report
 */
function transformARAgingReport(invoices: any[]): any {
  const arData = [];

  if (invoices?.QueryResponse?.Invoice) {
    for (const inv of invoices.QueryResponse.Invoice) {
      if (inv.Balance && inv.Balance > 0) {
        const daysOld = calculateDaysOld(inv.DueDate);
        arData.push({
          customer: inv.CustomerRef?.name || "Unknown",
          invoice: inv.DocNumber,
          amount: inv.Balance,
          days: daysOld,
          status: getAgingStatus(daysOld),
        });
      }
    }
  }

  return arData.length > 0 ? arData : [];
}

/**
 * Transforms bills into AP Aging report
 */
function transformAPAgingReport(bills: any[]): any {
  const apData = [];

  if (bills?.QueryResponse?.Bill) {
    for (const bill of bills.QueryResponse.Bill) {
      if (bill.Balance && bill.Balance > 0) {
        const daysOld = calculateDaysOld(bill.DueDate);
        apData.push({
          vendor: bill.VendorRef?.name || "Unknown",
          invoiceNum: bill.DocNumber,
          amount: bill.Balance,
          days: daysOld,
          status: getAgingStatus(daysOld),
        });
      }
    }
  }

  return apData.length > 0 ? apData : [];
}

/**
 * Generates Cash Flow report from P&L and Balance Sheet
 */
function transformCashFlowReport(plData: any, bsData: any): any {
  const pl = transformPLReport(plData);
  const netIncome = pl.netIncome;

  const operating = [
    { item: "Net Income", amount: netIncome },
  ];
  const operatingTotal = netIncome;

  return {
    operating,
    investing: [
      { item: "No investing data available", amount: 0 },
    ],
    financing: [
      { item: "No financing data available", amount: 0 },
    ],
    operatingTotal,
    investingTotal: 0,
    financingTotal: 0,
    netCashFlow: operatingTotal,
  };
}

/**
 * Generates Tax Summary from P&L data
 */
function transformTaxReport(plData: any): any {
  const pl = transformPLReport(plData);
  const taxableIncome = Math.max(0, pl.netIncome);
  const totalExpenses = pl.totalExpenses;

  // Build deductions from P&L expense categories
  const deductions = pl.expenses
    .filter((e: any) => e.amount > 0)
    .map((e: any) => ({ item: e.category, amount: e.amount }));
  const totalDeductions = deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
  const adjustedIncome = Math.max(0, taxableIncome - totalDeductions);

  const federalRate = 0.22;
  const stateRate = 0.0485; // Utah state tax rate
  const seRate = 0.153;
  const totalEstimatedTax = Math.max(0, adjustedIncome * (federalRate + stateRate + seRate));

  return {
    taxableIncome,
    deductions: deductions.length > 0 ? deductions : [{ item: "No deductions found", amount: 0 }],
    totalDeductions,
    adjustedIncome,
    estimatedFederalTax: Math.max(0, adjustedIncome * federalRate),
    estimatedStateTax: Math.max(0, adjustedIncome * stateRate),
    estimatedSelfEmploymentTax: Math.max(0, adjustedIncome * seRate),
    totalEstimatedTax,
    quarterlyPayments: [
      { quarter: "Q1", amount: totalEstimatedTax / 4 },
      { quarter: "Q2", amount: totalEstimatedTax / 4 },
      { quarter: "Q3", amount: totalEstimatedTax / 4 },
      { quarter: "Q4", amount: totalEstimatedTax / 4 },
    ],
  };
}

/**
 * Generates Budget vs Actual from P&L expenses
 * Note: Budget data requires manual setup. Shows actuals from P&L with zero budgets.
 */
function transformBudgetActualReport(plData: any): any {
  const pl = transformPLReport(plData);

  return pl.expenses
    .filter((e: any) => e.amount > 0)
    .map((e: any) => ({
      category: e.category,
      budget: 0,
      actual: e.amount,
      variance: -e.amount,
      variancePercent: 0,
    }));
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
        { success: false, error: "QuickBooks not connected. Please connect your QuickBooks account first." },
        { status: 400 }
      );
    }

    const body = (await request.json()) as GenerateReportRequest;
    const { reportType, startDate, endDate } = body;

    let accessToken = (org as any).qbo_access_token;

    if ((org as any).qbo_token_expires_at && isTokenExpired((org as any).qbo_token_expires_at)) {
      if (!(org as any).qbo_refresh_token) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Cannot refresh QuickBooks token" },
          { status: 400 }
        );
      }

      try {
        const tokenResponse = await qboClient.refreshToken((org as any).qbo_refresh_token);
        accessToken = tokenResponse.access_token;

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

    let reportData: any = {};

    try {
      switch (reportType) {
        case "pl": {
          const plData = await qboClient.getProfitAndLoss(
            accessToken,
            (org as any).qbo_realm_id,
            startDate,
            endDate
          );
          reportData = transformPLReport(plData);
          break;
        }

        case "balance-sheet": {
          const bsData = await qboClient.getBalanceSheet(accessToken, (org as any).qbo_realm_id);
          reportData = transformBalanceSheetReport(bsData);
          break;
        }

        case "cash-flow": {
          const plData = await qboClient.getProfitAndLoss(
            accessToken,
            (org as any).qbo_realm_id,
            startDate,
            endDate
          );
          const bsData = await qboClient.getBalanceSheet(accessToken, (org as any).qbo_realm_id);
          reportData = transformCashFlowReport(plData, bsData);
          break;
        }

        case "ar-aging": {
          const invoices = await qboClient.getInvoices(accessToken, (org as any).qbo_realm_id);
          reportData = transformARAgingReport(invoices);
          break;
        }

        case "ap-aging": {
          const bills = await qboClient.getBills(accessToken, (org as any).qbo_realm_id);
          reportData = transformAPAgingReport(bills);
          break;
        }

        case "job-costing": {
          reportData = [];
          break;
        }

        case "wip": {
          reportData = [];
          break;
        }

        case "tax": {
          const plData = await qboClient.getProfitAndLoss(
            accessToken,
            (org as any).qbo_realm_id,
            startDate,
            endDate
          );
          reportData = transformTaxReport(plData);
          break;
        }

        case "retainage": {
          reportData = [];
          break;
        }

        case "budget-actual": {
          const plData = await qboClient.getProfitAndLoss(
            accessToken,
            (org as any).qbo_realm_id,
            startDate,
            endDate
          );
          reportData = transformBudgetActualReport(plData);
          break;
        }

        default:
          return NextResponse.json<ApiResponse<null>>(
            { success: false, error: "Invalid report type" },
            { status: 400 }
          );
      }
    } catch (qboError) {
      console.error("QBO API error:", qboError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Failed to fetch QuickBooks data" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: reportData,
        message: `${reportType} report generated successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Report Generation Error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
