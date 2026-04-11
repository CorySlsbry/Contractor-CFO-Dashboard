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
  clientCompanyId?: string;
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
 * Extracts rows from a QBO Reports API section.
 * The Reports API returns nested Rows > Row arrays with ColData.
 */
function extractSectionRows(section: any): Array<{ name: string; amount: number }> {
  const items: Array<{ name: string; amount: number }> = [];

  if (section?.Rows?.Row) {
    for (const row of section.Rows.Row) {
      if (row.type === "Data" && row.ColData) {
        const name = row.ColData[0]?.value || "Unknown";
        const amount = extractAmount(row.ColData[1]?.value);
        items.push({ name, amount });
      } else if (row.type === "Section" && row.Header?.ColData) {
        // Sub-section — recurse and also grab the summary
        const subItems = extractSectionRows(row);
        items.push(...subItems);
      }
    }
  }

  return items;
}

/**
 * Gets the total from a section's Summary row
 */
function getSectionTotal(section: any): number {
  if (section?.Summary?.ColData) {
    return extractAmount(section.Summary.ColData[1]?.value);
  }
  return 0;
}

/**
 * Transforms P&L data from QBO Reports API into report format
 * Reports API returns: { Header, Columns, Rows: { Row: [...sections] } }
 */
function transformPLReport(qboData: any): any {
  const revenues: Array<{ category: string; amount: number }> = [];
  const expenses: Array<{ category: string; amount: number }> = [];
  let totalRevenue = 0;
  let totalExpenses = 0;

  const rows = qboData?.Rows?.Row || [];

  for (const section of rows) {
    const group = (section.group || section.Header?.ColData?.[0]?.value || "").toLowerCase();

    // Skip "net" summary rows (NetOperatingIncome, NetIncome, NetOtherIncome)
    // These are computed totals, not actual income/expense sections
    if (group.startsWith("net")) continue;

    if (group.includes("income") || group.includes("revenue")) {
      const items = extractSectionRows(section);
      for (const item of items) {
        revenues.push({ category: item.name, amount: Math.abs(item.amount) });
      }
      totalRevenue += Math.abs(getSectionTotal(section));
    } else if (group.includes("expense") || group.includes("cost")) {
      const items = extractSectionRows(section);
      for (const item of items) {
        expenses.push({ category: item.name, amount: Math.abs(item.amount) });
      }
      totalExpenses += Math.abs(getSectionTotal(section));
    }
  }

  // If no sections matched, try to get totals from the report summary
  if (revenues.length === 0 && expenses.length === 0) {
    // Fallback: walk all rows looking for any data
    for (const section of rows) {
      if (section.Summary?.ColData) {
        const name = section.Summary.ColData[0]?.value || "Unknown";
        const amount = extractAmount(section.Summary.ColData[1]?.value);
        if (amount > 0) {
          expenses.push({ category: name, amount });
          totalExpenses += amount;
        }
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
 * Transforms Balance Sheet data from QBO Reports API into report format
 */
function transformBalanceSheetReport(qboData: any): any {
  const assets: Array<{ category: string; amount: number; subcategories: any[] }> = [];
  const liabilities: Array<{ category: string; amount: number; subcategories: any[] }> = [];
  const equity: Array<{ category: string; amount: number; subcategories: any[] }> = [];
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;

  const rows = qboData?.Rows?.Row || [];

  for (const section of rows) {
    const group = (section.group || section.Header?.ColData?.[0]?.value || "").toLowerCase();
    const sectionTotal = Math.abs(getSectionTotal(section));
    const items = extractSectionRows(section);
    const subcategories = items.map((i) => ({ name: i.name, amount: Math.abs(i.amount) }));

    if (group.includes("asset")) {
      assets.push({ category: section.Header?.ColData?.[0]?.value || "Assets", amount: sectionTotal, subcategories });
      totalAssets += sectionTotal;
    } else if (group.includes("liabilit")) {
      liabilities.push({ category: section.Header?.ColData?.[0]?.value || "Liabilities", amount: sectionTotal, subcategories });
      totalLiabilities += sectionTotal;
    } else if (group.includes("equity")) {
      equity.push({ category: section.Header?.ColData?.[0]?.value || "Equity", amount: sectionTotal, subcategories });
      totalEquity += sectionTotal;
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
 * Shows full revenue and expense breakdown under Operating Activities
 * Uses indirect method: starts with Net Income, then shows components
 */
function transformCashFlowReport(plData: any, bsData: any): any {
  const pl = transformPLReport(plData);
  const bs = transformBalanceSheetReport(bsData);

  // Build operating activities with revenue and expense line items
  const operating: Array<{ item: string; amount: number }> = [];

  // Revenue items (positive = cash in)
  for (const rev of pl.revenues) {
    if (rev.amount > 0) {
      operating.push({ item: rev.category, amount: rev.amount });
    }
  }

  // Expense items (negative = cash out)
  for (const exp of pl.expenses) {
    if (exp.amount > 0) {
      operating.push({ item: exp.category, amount: -exp.amount });
    }
  }

  // If no line items, add summary
  if (operating.length === 0) {
    operating.push({ item: "Net Income", amount: pl.netIncome });
  }

  const operatingTotal = pl.totalRevenue - pl.totalExpenses;

  // Investing: look for fixed asset changes in the balance sheet
  const investing: Array<{ item: string; amount: number }> = [];
  for (const asset of bs.assets) {
    const cat = asset.category.toLowerCase();
    if (cat.includes("fixed") || cat.includes("property") || cat.includes("equipment") || cat.includes("vehicle")) {
      investing.push({ item: asset.category, amount: -asset.amount });
    }
  }
  if (investing.length === 0) {
    investing.push({ item: "No investing activity", amount: 0 });
  }
  const investingTotal = investing.reduce((sum, i) => sum + i.amount, 0);

  // Financing: look for loan/debt changes in liabilities and equity distributions
  const financing: Array<{ item: string; amount: number }> = [];
  for (const liab of bs.liabilities) {
    const cat = liab.category.toLowerCase();
    if (cat.includes("loan") || cat.includes("note") || cat.includes("debt") || cat.includes("line of credit")) {
      financing.push({ item: liab.category, amount: liab.amount });
    }
  }
  for (const eq of bs.equity) {
    const cat = eq.category.toLowerCase();
    if (cat.includes("distribution") || cat.includes("draw") || cat.includes("dividend")) {
      financing.push({ item: eq.category, amount: -eq.amount });
    }
  }
  if (financing.length === 0) {
    financing.push({ item: "No financing activity", amount: 0 });
  }
  const financingTotal = financing.reduce((sum, i) => sum + i.amount, 0);

  return {
    operating,
    investing,
    financing,
    operatingTotal,
    investingTotal,
    financingTotal,
    netCashFlow: operatingTotal + investingTotal + financingTotal,
    // Include summary totals for the header cards
    totalRevenue: pl.totalRevenue,
    totalExpenses: pl.totalExpenses,
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

/**
 * Builds synthetic report data from a seeded dashboard snapshot for demo mode.
 * The snapshot contains the full DashboardData shape (revenue, expenses, jobs,
 * invoices, bills, cash_flow, metrics) which we can project into every report.
 */
function buildDemoReport(reportType: string, snap: any): any {
  const revenue = Number(snap.revenue || 0);
  const expenses = Number(snap.expenses || 0);
  const netIncome = revenue - expenses;
  const cashBalance = Number(snap.cash_balance || 0);
  const ar = Number(snap.accounts_receivable || 0);
  const ap = Number(snap.accounts_payable || 0);
  const jobs = Array.isArray(snap.jobs) ? snap.jobs : [];
  const invoices = Array.isArray(snap.invoices) ? snap.invoices : [];
  const bills = Array.isArray(snap.bills) ? snap.bills : [];
  const cashFlow = Array.isArray(snap.cash_flow) ? snap.cash_flow : [];

  switch (reportType) {
    case "pl": {
      const revenues = [
        { category: "Construction Revenue", amount: revenue * 0.82 },
        { category: "Change Order Revenue", amount: revenue * 0.12 },
        { category: "Retainage Release", amount: revenue * 0.06 },
      ];
      const exp = [
        { category: "Materials", amount: expenses * 0.42 },
        { category: "Labor", amount: expenses * 0.28 },
        { category: "Subcontractors", amount: expenses * 0.16 },
        { category: "Equipment & Rental", amount: expenses * 0.05 },
        { category: "Permits & Fees", amount: expenses * 0.02 },
        { category: "Insurance", amount: expenses * 0.025 },
        { category: "Office & Admin", amount: expenses * 0.03 },
        { category: "Vehicle & Fuel", amount: expenses * 0.015 },
      ];
      return {
        revenues,
        expenses: exp,
        totalRevenue: revenue,
        totalExpenses: expenses,
        netIncome,
      };
    }

    case "balance-sheet": {
      const currentAssets = cashBalance + ar + 125_000; // + inventory
      const fixedAssets = 640_000;
      const totalAssets = currentAssets + fixedAssets;
      const currentLiab = ap + 85_000; // + accrued
      const longTermDebt = 420_000;
      const totalLiab = currentLiab + longTermDebt;
      const retainedEarnings = totalAssets - totalLiab - 50_000;
      return {
        assets: [
          {
            category: "Current Assets",
            amount: currentAssets,
            subcategories: [
              { name: "Cash & Equivalents", amount: cashBalance },
              { name: "Accounts Receivable", amount: ar },
              { name: "Inventory (Materials)", amount: 125_000 },
            ],
          },
          {
            category: "Fixed Assets",
            amount: fixedAssets,
            subcategories: [
              { name: "Trucks & Vehicles", amount: 215_000 },
              { name: "Equipment & Tools", amount: 185_000 },
              { name: "Office & Shop", amount: 240_000 },
            ],
          },
        ],
        liabilities: [
          {
            category: "Current Liabilities",
            amount: currentLiab,
            subcategories: [
              { name: "Accounts Payable", amount: ap },
              { name: "Accrued Expenses", amount: 85_000 },
            ],
          },
          {
            category: "Long-Term Debt",
            amount: longTermDebt,
            subcategories: [
              { name: "Equipment Loan", amount: 180_000 },
              { name: "Line of Credit", amount: 240_000 },
            ],
          },
        ],
        equity: [
          {
            category: "Owner's Equity",
            amount: retainedEarnings + 50_000,
            subcategories: [
              { name: "Owner Capital", amount: 50_000 },
              { name: "Retained Earnings", amount: retainedEarnings },
            ],
          },
        ],
        totalAssets,
        totalLiabilities: totalLiab,
        totalEquity: retainedEarnings + 50_000,
      };
    }

    case "cash-flow": {
      const operating = [
        { item: "Net Income", amount: netIncome },
        { item: "Depreciation & Amortization", amount: 64_000 },
        { item: "Change in A/R", amount: -42_000 },
        { item: "Change in A/P", amount: 28_500 },
        { item: "Change in WIP", amount: -31_200 },
      ];
      const investing = [
        { item: "Equipment Purchases", amount: -85_000 },
        { item: "Vehicle Purchases", amount: -42_000 },
      ];
      const financing = [
        { item: "Line of Credit Draw", amount: 60_000 },
        { item: "Equipment Loan Payments", amount: -36_000 },
        { item: "Owner Draws", amount: -120_000 },
      ];
      const operatingTotal = operating.reduce((s, i) => s + i.amount, 0);
      const investingTotal = investing.reduce((s, i) => s + i.amount, 0);
      const financingTotal = financing.reduce((s, i) => s + i.amount, 0);
      return {
        operating,
        investing,
        financing,
        operatingTotal,
        investingTotal,
        financingTotal,
        netCashFlow: operatingTotal + investingTotal + financingTotal,
        totalRevenue: revenue,
        totalExpenses: expenses,
      };
    }

    case "ar-aging": {
      return invoices
        .filter((inv: any) => inv.status !== "paid")
        .map((inv: any) => ({
          customer: inv.customer_name || "Unknown",
          invoice: inv.invoice_number || inv.id,
          amount: inv.balance ?? inv.amount,
          days: inv.days_overdue || 0,
          status:
            (inv.days_overdue || 0) === 0
              ? "Current"
              : (inv.days_overdue || 0) <= 30
              ? "Current"
              : (inv.days_overdue || 0) <= 60
              ? "Overdue"
              : "Past Due",
        }));
    }

    case "ap-aging": {
      return bills
        .filter((b: any) => b.status !== "paid")
        .map((b: any) => ({
          vendor: b.vendor_name || "Unknown",
          invoiceNum: b.doc_number || b.id,
          amount: b.balance ?? b.amount,
          days: b.days_overdue || 0,
          status:
            (b.days_overdue || 0) === 0
              ? "Current"
              : (b.days_overdue || 0) <= 30
              ? "Current"
              : (b.days_overdue || 0) <= 60
              ? "Overdue"
              : "Past Due",
        }));
    }

    case "job-costing": {
      return jobs.map((j: any, idx: number) => {
        const laborCost = j.actual_cost * 0.32;
        const materialCost = j.actual_cost * 0.45;
        const overheadCost = j.actual_cost * 0.23;
        return {
          jobNumber: `J-${1000 + idx}`,
          jobName: j.name,
          laborCost: Math.round(laborCost),
          materialCost: Math.round(materialCost),
          overheadCost: Math.round(overheadCost),
          totalCost: Math.round(j.actual_cost),
          contractAmount: Math.round(j.revenue),
          margin: Math.round(j.revenue - j.actual_cost),
          percentComplete: j.percent_complete,
        };
      });
    }

    case "wip": {
      return jobs
        .filter((j: any) => j.status === "in_progress")
        .map((j: any, idx: number) => {
          const pctComplete = (j.percent_complete || 0) / 100;
          const earned = j.revenue * pctComplete;
          const billed = earned * (0.96 + ((idx * 13) % 7) / 100);
          const wipInventory = Math.max(0, Math.round(j.actual_cost - billed * 0.85));
          return {
            jobNumber: `J-${1000 + idx}`,
            jobName: j.name,
            wipInventory,
            invoiced: Math.round(billed),
            totalRevenue: Math.round(j.revenue),
            remaining: Math.round(j.revenue - billed),
            billingStatus: billed >= earned * 0.98 ? "On Track" : "Behind",
          };
        });
    }

    case "tax": {
      const taxableIncome = Math.max(0, netIncome);
      const deductions = [
        { item: "Materials", amount: expenses * 0.42 },
        { item: "Labor", amount: expenses * 0.28 },
        { item: "Subcontractors", amount: expenses * 0.16 },
        { item: "Equipment & Rental", amount: expenses * 0.05 },
        { item: "Insurance", amount: expenses * 0.025 },
        { item: "Vehicle & Fuel", amount: expenses * 0.015 },
      ];
      const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
      const adjustedIncome = Math.max(0, taxableIncome);
      const federalRate = 0.22;
      const stateRate = 0.0485;
      const seRate = 0.153;
      const totalEstimatedTax = adjustedIncome * (federalRate + stateRate + seRate);
      return {
        taxableIncome,
        deductions,
        totalDeductions,
        adjustedIncome,
        estimatedFederalTax: adjustedIncome * federalRate,
        estimatedStateTax: adjustedIncome * stateRate,
        estimatedSelfEmploymentTax: adjustedIncome * seRate,
        totalEstimatedTax,
        quarterlyPayments: [
          { quarter: "Q1", amount: totalEstimatedTax / 4 },
          { quarter: "Q2", amount: totalEstimatedTax / 4 },
          { quarter: "Q3", amount: totalEstimatedTax / 4 },
          { quarter: "Q4", amount: totalEstimatedTax / 4 },
        ],
      };
    }

    case "retainage": {
      const today = new Date();
      return jobs
        .filter((j: any) => j.status === "in_progress" || j.status === "completed")
        .map((j: any, idx: number) => {
          const retainagePct = 10;
          const billed = j.revenue * ((j.percent_complete || 0) / 100);
          const retainageHeld = Math.round(billed * (retainagePct / 100));
          const dueDate = new Date(today);
          dueDate.setDate(dueDate.getDate() + 30 + idx * 15);
          return {
            jobNumber: `J-${1000 + idx}`,
            jobName: j.name,
            contractAmount: Math.round(j.revenue),
            retainagePercent: retainagePct,
            retainageAmount: retainageHeld,
            dueDate: dueDate.toISOString(),
            status: j.status === "completed" ? "Ready for Release" : "Holding",
          };
        });
    }

    case "budget-actual": {
      const categories = [
        { category: "Materials", pct: 0.42 },
        { category: "Labor", pct: 0.28 },
        { category: "Subcontractors", pct: 0.16 },
        { category: "Equipment & Rental", pct: 0.05 },
        { category: "Permits & Fees", pct: 0.02 },
        { category: "Insurance", pct: 0.025 },
        { category: "Office & Admin", pct: 0.03 },
        { category: "Vehicle & Fuel", pct: 0.015 },
      ];
      return categories.map((c) => {
        const actual = expenses * c.pct;
        const budget = actual * (0.93 + Math.random() * 0.14);
        const variance = budget - actual;
        const variancePercent = budget > 0 ? (variance / budget) * 100 : 0;
        return {
          category: c.category,
          budget: Math.round(budget),
          actual: Math.round(actual),
          variance: Math.round(variance),
          variancePercent: Math.round(variancePercent * 10) / 10,
        };
      });
    }

    default:
      return {};
  }
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

    const orgId = (profile as any).organization_id;

    const body = (await request.json()) as GenerateReportRequest;
    const { reportType, startDate, endDate, clientCompanyId } = body;

    // Get QBO credentials from client_companies table (multi-client support)
    let clientCompany: any = null;
    let clientError: any = null;

    if (clientCompanyId) {
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
      // Fallback: first active client
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
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "No client company found. Connect a QBO company first." },
        { status: 400 }
      );
    }

    // ── DEMO MODE ──────────────────────────────────────────────────────────
    // For the demo client_company (qbo_realm_id === 'DEMO-MODE'), synthesize
    // reports from the seeded dashboard_snapshots row instead of hitting QBO.
    if (clientCompany.qbo_realm_id === "DEMO-MODE") {
      const { data: snapshot } = await (supabase as any)
        .from("dashboard_snapshots")
        .select("data")
        .eq("organization_id", orgId)
        .eq("client_company_id", clientCompany.id)
        .order("pulled_at", { ascending: false })
        .limit(1)
        .single();

      const snap = snapshot?.data || {};
      const demoReport = buildDemoReport(reportType, snap);

      return NextResponse.json<ApiResponse<any>>(
        {
          success: true,
          data: demoReport,
          message: `${reportType} report generated successfully (demo)`,
        },
        { status: 200 }
      );
    }

    if (!clientCompany.qbo_realm_id || !clientCompany.qbo_access_token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "QuickBooks not connected for this client. Please connect QuickBooks first." },
        { status: 400 }
      );
    }

    let accessToken = clientCompany.qbo_access_token;
    const realmId = clientCompany.qbo_realm_id;

    // Refresh token if expired
    if (clientCompany.qbo_token_expires_at && isTokenExpired(clientCompany.qbo_token_expires_at)) {
      if (!clientCompany.qbo_refresh_token) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Cannot refresh QuickBooks token — reconnect QBO" },
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
            realmId,
            startDate,
            endDate
          );
          reportData = transformPLReport(plData);
          break;
        }

        case "balance-sheet": {
          const bsData = await qboClient.getBalanceSheet(accessToken, realmId);
          reportData = transformBalanceSheetReport(bsData);
          break;
        }

        case "cash-flow": {
          const plData = await qboClient.getProfitAndLoss(
            accessToken,
            realmId,
            startDate,
            endDate
          );
          const bsData = await qboClient.getBalanceSheet(accessToken, realmId);
          reportData = transformCashFlowReport(plData, bsData);
          break;
        }

        case "ar-aging": {
          const invoices = await qboClient.getInvoices(accessToken, realmId);
          reportData = transformARAgingReport(invoices);
          break;
        }

        case "ap-aging": {
          const bills = await qboClient.getBills(accessToken, realmId);
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
            realmId,
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
            realmId,
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
    } catch (qboError: any) {
      const errMsg = qboError?.message || String(qboError);
      console.error("QBO API error:", errMsg, "| Report:", reportType, "| Realm:", realmId);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: `Failed to fetch QuickBooks data: ${errMsg}` },
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
