/**
 * QBO API response transformation utilities
 * Converts raw QBO data into dashboard-ready formats
 *
 * QBO Reports API returns data in this structure:
 * { Header: {...}, Rows: { Row: [ { type: "Section", group: "Income",
 *     Header: { ColData: [{value: "Income"}, ...] },
 *     Rows: { Row: [ { ColData: [{value: "Services"}, {value: "5000.00"}] } ] },
 *     Summary: { ColData: [{value: "Total Income"}, {value: "5000.00"}] }
 * } ] } }
 */

import type {
  DashboardData,
  Invoice,
  CashFlowData,
  JobData,
  FinancialMetric,
} from "@/types";

/**
 * QBO Reports API response shape
 */
interface QBOReportRow {
  type?: string;
  group?: string;
  Header?: { ColData: Array<{ value: string }> };
  Rows?: { Row: QBOReportRow[] };
  Summary?: { ColData: Array<{ value: string }> };
  ColData?: Array<{ value: string }>;
}

interface QBOReportData {
  Header?: Record<string, any>;
  Rows?: { Row?: QBOReportRow[] };
  // Legacy fallback for old format
  groupOf?: Array<{
    groupName: string;
    summary?: { totalAmt: string };
  }>;
}

type ProfitAndLossData = QBOReportData;
type BalanceSheetData = QBOReportData;

interface InvoiceData {
  Id: string;
  DocNumber: string;
  CustomerRef?: {
    value: string;
    name: string;
  };
  TxnDate: string;
  DueDate: string;
  TotalAmt: number;
  Balance: number;
  EmailStatus?: string;
  PrintStatus?: string;
}

interface JournalEntryData {
  TxnDate: string;
  Line: Array<{
    DetailType: string;
    Amount: number;
    AccountRef: {
      value: string;
      name: string;
    };
  }>;
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
 * Extracts the summary total from a QBO Report section row
 */
function getSectionTotal(row: QBOReportRow): number {
  if (row.Summary?.ColData && row.Summary.ColData.length >= 2) {
    return extractAmount(row.Summary.ColData[row.Summary.ColData.length - 1].value);
  }
  // Fallback: single-row sections may have ColData directly
  if (row.ColData && row.ColData.length >= 2) {
    return extractAmount(row.ColData[row.ColData.length - 1].value);
  }
  return 0;
}

/**
 * Transforms QBO Profit & Loss data
 * Handles both new Reports API format (Rows>Row>ColData) and legacy groupOf format
 */
export function transformProfitAndLoss(
  qboData: ProfitAndLossData
): {
  revenue: number;
  expenses: number;
  profit: number;
  monthlyData: Array<{ month: string; revenue: number; expenses: number }>;
} {
  let revenue = 0;
  let expenses = 0;

  // New format: Rows > Row[] with type="Section" and group names
  if (qboData.Rows?.Row) {
    for (const row of qboData.Rows.Row) {
      const group = (row.group || "").toLowerCase();
      const headerLabel = (row.Header?.ColData?.[0]?.value || "").toLowerCase();
      const label = group || headerLabel;

      if (label.includes("income") || label.includes("revenue")) {
        revenue += getSectionTotal(row);
      } else if (
        label.includes("expense") ||
        label.includes("cost of goods") ||
        label.includes("cogs")
      ) {
        expenses += getSectionTotal(row);
      }
    }
  }
  // Legacy fallback
  else if (qboData.groupOf) {
    for (const group of qboData.groupOf) {
      if (
        group.groupName?.toLowerCase().includes("income") ||
        group.groupName?.toLowerCase().includes("revenue")
      ) {
        revenue += extractAmount(group.summary?.totalAmt);
      } else if (
        group.groupName?.toLowerCase().includes("expense") ||
        group.groupName?.toLowerCase().includes("cost")
      ) {
        expenses += extractAmount(group.summary?.totalAmt);
      }
    }
  }

  const profit = revenue - expenses;

  return {
    revenue: Math.max(0, revenue),
    expenses: Math.max(0, expenses),
    profit,
    monthlyData: [],
  };
}

/**
 * Transforms QBO Balance Sheet data
 * Handles both new Reports API format (Rows>Row>ColData) and legacy groupOf format
 */
export function transformBalanceSheet(
  qboData: BalanceSheetData
): {
  cashBalance: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
} {
  let cashBalance = 0;
  let totalAssets = 0;
  let totalLiabilities = 0;
  let equity = 0;

  // New format: Rows > Row[] with type="Section"
  if (qboData.Rows?.Row) {
    for (const row of qboData.Rows.Row) {
      const group = (row.group || "").toLowerCase();
      const headerLabel = (row.Header?.ColData?.[0]?.value || "").toLowerCase();
      const label = group || headerLabel;
      const amount = getSectionTotal(row);

      if (label.includes("asset")) {
        totalAssets += amount;
        // Look inside sub-rows for bank/cash accounts
        if (row.Rows?.Row) {
          for (const subRow of row.Rows.Row) {
            const subGroup = (subRow.group || "").toLowerCase();
            const subHeader = (subRow.Header?.ColData?.[0]?.value || "").toLowerCase();
            const subLabel = subGroup || subHeader;
            if (
              subLabel.includes("bank") ||
              subLabel.includes("cash") ||
              subLabel.includes("checking") ||
              subLabel.includes("savings")
            ) {
              cashBalance += getSectionTotal(subRow);
            }
          }
        }
        // If no sub-rows matched cash, check if the whole asset section is cash-like
        if (cashBalance === 0 && (label.includes("bank") || label.includes("cash"))) {
          cashBalance = amount;
        }
      } else if (label.includes("liabilit")) {
        totalLiabilities += amount;
      } else if (label.includes("equity")) {
        equity += amount;
      }
    }
  }
  // Legacy fallback
  else if (qboData.groupOf) {
    for (const group of qboData.groupOf) {
      const groupName = group.groupName?.toLowerCase() || "";
      const amount = extractAmount(group.summary?.totalAmt);

      if (groupName.includes("asset")) {
        totalAssets += amount;
        if (groupName.includes("cash") || groupName.includes("bank")) {
          cashBalance += amount;
        }
      } else if (groupName.includes("liability")) {
        totalLiabilities += amount;
      } else if (groupName.includes("equity")) {
        equity += amount;
      }
    }
  }

  return {
    cashBalance: Math.max(0, cashBalance),
    totalAssets: Math.max(0, totalAssets),
    totalLiabilities: Math.max(0, totalLiabilities),
    equity: Math.max(0, equity),
  };
}

/**
 * Calculates days overdue for an invoice
 */
function calculateDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Determines invoice status
 */
function getInvoiceStatus(
  invoice: InvoiceData
): "draft" | "sent" | "viewed" | "paid" | "overdue" {
  if (invoice.Balance === 0) {
    return "paid";
  }

  const daysOverdue = calculateDaysOverdue(invoice.DueDate);
  if (daysOverdue > 0) {
    return "overdue";
  }

  if (invoice.EmailStatus?.toLowerCase() === "sent") {
    return "sent";
  }

  return "draft";
}

/**
 * Transforms QBO Invoice data
 */
export function transformInvoices(qboData: {
  QueryResponse?: {
    Invoice?: InvoiceData[];
  };
}): Invoice[] {
  const invoices: Invoice[] = [];

  if (qboData.QueryResponse?.Invoice) {
    for (const qboInvoice of qboData.QueryResponse.Invoice) {
      const daysOverdue = calculateDaysOverdue(qboInvoice.DueDate);

      invoices.push({
        id: qboInvoice.Id,
        invoice_number: qboInvoice.DocNumber,
        customer_name: qboInvoice.CustomerRef?.name || "Unknown",
        amount: qboInvoice.TotalAmt || 0,
        due_date: qboInvoice.DueDate,
        status: getInvoiceStatus(qboInvoice),
        days_overdue: daysOverdue,
      });
    }
  }

  return invoices;
}

/**
 * Transforms QBO Journal Entry data into Cash Flow
 */
export function transformCashFlow(
  qboData: {
    QueryResponse?: {
      JournalEntry?: JournalEntryData[];
    };
  }
): CashFlowData[] {
  const monthlyData: Map<
    string,
    { inflow: number; outflow: number; net: number }
  > = new Map();

  if (qboData.QueryResponse?.JournalEntry) {
    for (const entry of qboData.QueryResponse.JournalEntry) {
      const date = new Date(entry.TxnDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      let monthEntry = monthlyData.get(monthKey);
      if (!monthEntry) {
        monthEntry = { inflow: 0, outflow: 0, net: 0 };
        monthlyData.set(monthKey, monthEntry);
      }

      for (const line of entry.Line) {
        const amount = Math.abs(line.Amount);
        if (
          line.AccountRef.name.toLowerCase().includes("bank") ||
          line.AccountRef.name.toLowerCase().includes("cash")
        ) {
          if (line.Amount > 0) {
            monthEntry.inflow += amount;
          } else {
            monthEntry.outflow += amount;
          }
        }
      }
    }
  }

  const cashFlowData: CashFlowData[] = [];
  const sortedMonths = Array.from(monthlyData.keys()).sort();

  for (const month of sortedMonths) {
    const data = monthlyData.get(month)!;
    data.net = data.inflow - data.outflow;
    cashFlowData.push({
      month: formatMonthForDisplay(month),
      inflow: Math.max(0, data.inflow),
      outflow: Math.max(0, data.outflow),
      net: data.net,
    });
  }

  return cashFlowData;
}

/**
 * Formats month string (YYYY-MM) for display
 */
function formatMonthForDisplay(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

/**
 * Creates financial metrics from dashboard data
 */
export function createMetrics(dashboardData: {
  revenue: number;
  expenses: number;
  profit: number;
  cash_balance: number;
}): FinancialMetric[] {
  const profitMargin =
    dashboardData.revenue > 0
      ? (dashboardData.profit / dashboardData.revenue) * 100
      : 0;

  return [
    {
      label: "Total Revenue",
      value: dashboardData.revenue,
      change: 0,
      changeType: "neutral",
      format: "currency",
    },
    {
      label: "Total Expenses",
      value: dashboardData.expenses,
      change: 0,
      changeType: "neutral",
      format: "currency",
    },
    {
      label: "Net Profit",
      value: dashboardData.profit,
      change: 0,
      changeType: dashboardData.profit > 0 ? "positive" : "negative",
      format: "currency",
    },
    {
      label: "Profit Margin",
      value: profitMargin,
      change: 0,
      changeType: profitMargin > 0 ? "positive" : "negative",
      format: "percent",
    },
    {
      label: "Cash Balance",
      value: dashboardData.cash_balance,
      change: 0,
      changeType: "neutral",
      format: "currency",
    },
  ];
}

/**
 * Combines all transformed data into a complete DashboardData object
 */
export function buildDashboardData(
  profitAndLoss: ReturnType<typeof transformProfitAndLoss>,
  balanceSheet: ReturnType<typeof transformBalanceSheet>,
  invoices: Invoice[],
  cashFlow: CashFlowData[]
): DashboardData {
  const dashboardData: DashboardData = {
    revenue: profitAndLoss.revenue,
    expenses: profitAndLoss.expenses,
    profit: profitAndLoss.profit,
    cash_balance: balanceSheet.cashBalance,
    accounts_receivable: 0,
    accounts_payable: balanceSheet.totalLiabilities,
    jobs: [],
    invoices,
    cash_flow: cashFlow,
    metrics: [],
    last_updated: new Date().toISOString(),
  };

  dashboardData.metrics = createMetrics(dashboardData);

  return dashboardData;
}
