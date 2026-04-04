/**
 * QBO API response transformation utilities
 * Converts raw QBO data into dashboard-ready formats
 */

import type {
  DashboardData,
  Invoice,
  Bill,
  CashFlowData,
  JobData,
  FinancialMetric,
} from "@/types";

interface ProfitAndLossData {
  Header?: {
    ReportName?: string;
    Option?: Array<{ Name: string; Value: string }>;
  };
  Columns?: {
    Column?: Array<{ ColTitle: string; ColType: string }>;
  };
  Rows?: {
    Row?: Array<{
      type?: string;
      group?: string;
      Summary?: { ColData?: Array<{ value: string }> };
      Header?: { ColData?: Array<{ value: string }> };
      Rows?: {
        Row?: Array<{
          ColData?: Array<{ value: string }>;
        }>;
      };
      ColData?: Array<{ value: string }>;
    }>;
  };
  // Legacy format from query endpoint
  groupOf?: Array<{
    groupName: string;
    summary?: {
      totalAmt: string;
    };
    rows?: Array<{
      colData: Array<{ value: string | number }>;
    }>;
  }>;
  rows?: Array<{
    colData: Array<{ value: string | number }>;
  }>;
}

interface BalanceSheetData {
  Header?: {
    ReportName?: string;
  };
  Rows?: {
    Row?: Array<{
      type?: string;
      group?: string;
      Header?: { ColData?: Array<{ value: string }> };
      Summary?: { ColData?: Array<{ value: string }> };
      Rows?: {
        Row?: Array<{
          type?: string;
          group?: string;
          Header?: { ColData?: Array<{ value: string }> };
          Summary?: { ColData?: Array<{ value: string }> };
          Rows?: {
            Row?: Array<{
              ColData?: Array<{ value: string }>;
            }>;
          };
          ColData?: Array<{ value: string }>;
        }>;
      };
      ColData?: Array<{ value: string }>;
    }>;
  };
  // Legacy format from query endpoint
  groupOf?: Array<{
    groupName: string;
    summary?: {
      totalAmt: string;
    };
    rows?: Array<{
      colData: Array<{ value: string | number }>;
    }>;
  }>;
}

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

interface BillData {
  Id: string;
  DocNumber?: string;
  VendorRef?: {
    value: string;
    name: string;
  };
  TxnDate: string;
  DueDate: string;
  TotalAmt: number;
  Balance: number;
}

interface AccountData {
  Id: string;
  Name: string;
  AccountType: string;
  AccountSubType?: string;
  CurrentBalance?: number;
  Active?: boolean;
  Classification?: string;
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
    JournalEntryLineDetail?: {
      PostingType?: string;
      AccountRef?: {
        value: string;
        name: string;
      };
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
 * Transforms QBO Profit & Loss report data
 * Supports both the /reports/ProfitAndLoss endpoint (structured) and query endpoint (legacy)
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
  const monthlyRevenue: Map<number, number> = new Map();
  const monthlyExpenses: Map<number, number> = new Map();

  // Try structured report format first (from /reports/ProfitAndLoss)
  if (qboData.Rows?.Row) {
    for (const section of qboData.Rows.Row) {
      const groupName = (section.group || section.Header?.ColData?.[0]?.value || "").toLowerCase();

      if (groupName.includes("income") || groupName.includes("revenue")) {
        // Last ColData value in Summary is the total
        const summaryValues = section.Summary?.ColData || [];
        if (summaryValues.length > 0) {
          revenue += extractAmount(summaryValues[summaryValues.length - 1]?.value);
        }
        // Extract monthly columns if available
        if (section.Summary?.ColData && section.Summary.ColData.length > 2) {
          for (let i = 1; i < section.Summary.ColData.length - 1; i++) {
            const val = extractAmount(section.Summary.ColData[i]?.value);
            monthlyRevenue.set(i, (monthlyRevenue.get(i) || 0) + val);
          }
        }
      } else if (
        groupName.includes("expense") ||
        groupName.includes("cost of goods") ||
        groupName.includes("cost")
      ) {
        const summaryValues = section.Summary?.ColData || [];
        if (summaryValues.length > 0) {
          expenses += extractAmount(summaryValues[summaryValues.length - 1]?.value);
        }
        if (section.Summary?.ColData && section.Summary.ColData.length > 2) {
          for (let i = 1; i < section.Summary.ColData.length - 1; i++) {
            const val = extractAmount(section.Summary.ColData[i]?.value);
            monthlyExpenses.set(i, (monthlyExpenses.get(i) || 0) + val);
          }
        }
      }
    }
  }

  // Fallback to legacy query format
  if (revenue === 0 && expenses === 0 && qboData.groupOf) {
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

  // Build monthly data from column headers
  const monthlyData: Array<{ month: string; revenue: number; expenses: number }> = [];
  const columns = qboData.Columns?.Column || [];

  if (columns.length > 2 && monthlyRevenue.size > 0) {
    // Skip first column (label) and last column (total)
    for (let i = 1; i < columns.length - 1; i++) {
      const colTitle = columns[i]?.ColTitle || "";
      monthlyData.push({
        month: colTitle,
        revenue: Math.max(0, monthlyRevenue.get(i) || 0),
        expenses: Math.max(0, monthlyExpenses.get(i) || 0),
      });
    }
  }

  const profit = revenue - expenses;

  return {
    revenue: Math.max(0, revenue),
    expenses: Math.max(0, expenses),
    profit,
    monthlyData,
  };
}

/**
 * Transforms QBO Balance Sheet data
 * Extracts specific AR and AP account balances instead of lumping all liabilities
 */
export function transformBalanceSheet(
  qboData: BalanceSheetData
): {
  cashBalance: number;
  accountsReceivable: number;
  accountsPayable: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
} {
  let cashBalance = 0;
  let accountsReceivable = 0;
  let accountsPayable = 0;
  let totalAssets = 0;
  let totalLiabilities = 0;
  let equity = 0;

  // Helper to recursively search rows for specific account types
  function processRows(rows: any[], parentGroup: string) {
    for (const row of rows) {
      const groupName = (
        row.group ||
        row.Header?.ColData?.[0]?.value ||
        ""
      ).toLowerCase();
      const fullGroup = parentGroup ? `${parentGroup}/${groupName}` : groupName;

      // Check for summary amounts
      const summaryAmt = extractAmount(
        row.Summary?.ColData?.[row.Summary?.ColData?.length - 1]?.value
      );
      const colDataAmt = extractAmount(
        row.ColData?.[row.ColData?.length - 1]?.value
      );
      const amount = summaryAmt || colDataAmt;

      // Identify account types
      if (groupName.includes("accounts receivable") || groupName.includes("a/r")) {
        accountsReceivable += amount;
      } else if (groupName.includes("accounts payable") || groupName.includes("a/p")) {
        accountsPayable += amount;
      } else if (
        (groupName.includes("bank") || groupName.includes("cash")) &&
        parentGroup.includes("asset")
      ) {
        cashBalance += amount;
      }

      // Top-level totals
      if (row.type === "Section" && !parentGroup) {
        if (groupName.includes("asset")) {
          totalAssets += summaryAmt;
        } else if (groupName.includes("liability")) {
          totalLiabilities += summaryAmt;
        } else if (groupName.includes("equity")) {
          equity += summaryAmt;
        }
      }

      // Recurse into nested rows
      if (row.Rows?.Row) {
        processRows(row.Rows.Row, fullGroup || parentGroup);
      }
    }
  }

  // Process structured report format
  if (qboData.Rows?.Row) {
    processRows(qboData.Rows.Row, "");
  }

  // Fallback to legacy query format
  if (totalAssets === 0 && totalLiabilities === 0 && qboData.groupOf) {
    for (const group of qboData.groupOf) {
      const groupName = group.groupName?.toLowerCase() || "";
      const amount = extractAmount(group.summary?.totalAmt);

      if (groupName.includes("asset")) {
        totalAssets += amount;
        if (groupName.includes("cash") || groupName.includes("bank")) {
          cashBalance += amount;
        }
        if (groupName.includes("accounts receivable") || groupName.includes("a/r")) {
          accountsReceivable += amount;
        }
      } else if (groupName.includes("liability")) {
        totalLiabilities += amount;
        if (groupName.includes("accounts payable") || groupName.includes("a/p")) {
          accountsPayable += amount;
        }
      } else if (groupName.includes("equity")) {
        equity += amount;
      }
    }
  }

  return {
    cashBalance: Math.max(0, cashBalance),
    accountsReceivable: Math.max(0, accountsReceivable),
    accountsPayable: Math.max(0, accountsPayable),
    totalAssets: Math.max(0, totalAssets),
    totalLiabilities: Math.max(0, totalLiabilities),
    equity: Math.max(0, equity),
  };
}

/**
 * Calculates days overdue for an invoice or bill
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
        balance: qboInvoice.Balance || 0,
        due_date: qboInvoice.DueDate,
        status: getInvoiceStatus(qboInvoice),
        days_overdue: daysOverdue,
      });
    }
  }

  return invoices;
}

/**
 * Transforms QBO Bill data into Bill[] for AP tracking
 */
export function transformBills(qboData: {
  QueryResponse?: {
    Bill?: BillData[];
  };
}): Bill[] {
  const bills: Bill[] = [];

  if (qboData.QueryResponse?.Bill) {
    for (const qboBill of qboData.QueryResponse.Bill) {
      const daysOverdue = calculateDaysOverdue(qboBill.DueDate);

      let status: "unpaid" | "paid" | "overdue" = "unpaid";
      if (qboBill.Balance === 0) {
        status = "paid";
      } else if (daysOverdue > 0) {
        status = "overdue";
      }

      bills.push({
        id: qboBill.Id,
        doc_number: qboBill.DocNumber,
        vendor_name: qboBill.VendorRef?.name || "Unknown",
        amount: qboBill.TotalAmt || 0,
        balance: qboBill.Balance || 0,
        due_date: qboBill.DueDate,
        txn_date: qboBill.TxnDate,
        status,
        days_overdue: daysOverdue,
      });
    }
  }

  return bills;
}

/**
 * Builds an account type lookup map from QBO accounts
 * Maps account ID → AccountType for reliable cash flow classification
 */
export function buildAccountTypeMap(qboData: {
  QueryResponse?: {
    Account?: AccountData[];
  };
}): Map<string, { type: string; subType: string; classification: string }> {
  const map = new Map<string, { type: string; subType: string; classification: string }>();

  if (qboData.QueryResponse?.Account) {
    for (const acct of qboData.QueryResponse.Account) {
      map.set(acct.Id, {
        type: acct.AccountType || "",
        subType: acct.AccountSubType || "",
        classification: acct.Classification || "",
      });
    }
  }

  return map;
}

/**
 * Cash-flow account types that represent actual bank/cash movement
 */
const CASH_ACCOUNT_TYPES = new Set(["Bank", "Other Current Asset"]);
const CASH_ACCOUNT_SUBTYPES = new Set([
  "CashOnHand",
  "Checking",
  "MoneyMarket",
  "RentsHeldInTrust",
  "Savings",
  "TrustAccounts",
  "CashAndCashEquivalents",
]);

/**
 * Transforms QBO Journal Entry data into Cash Flow
 * Uses account type lookups instead of fragile name matching
 */
export function transformCashFlow(
  qboData: {
    QueryResponse?: {
      JournalEntry?: JournalEntryData[];
    };
  },
  accountTypeMap?: Map<string, { type: string; subType: string; classification: string }>
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
        const accountId = line.JournalEntryLineDetail?.AccountRef?.value || line.AccountRef?.value;
        const accountName = line.AccountRef?.name?.toLowerCase() || "";

        let isCashAccount = false;

        // Primary: Use account type map (reliable)
        if (accountTypeMap && accountId) {
          const acctInfo = accountTypeMap.get(accountId);
          if (acctInfo) {
            isCashAccount =
              CASH_ACCOUNT_TYPES.has(acctInfo.type) &&
              (acctInfo.type === "Bank" || CASH_ACCOUNT_SUBTYPES.has(acctInfo.subType));
          }
        }

        // Fallback: Name matching (legacy behavior)
        if (!accountTypeMap && !isCashAccount) {
          isCashAccount =
            accountName.includes("bank") ||
            accountName.includes("cash") ||
            accountName.includes("checking") ||
            accountName.includes("savings") ||
            accountName.includes("money market");
        }

        if (isCashAccount) {
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
  accounts_receivable: number;
  accounts_payable: number;
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
    {
      label: "Accounts Receivable",
      value: dashboardData.accounts_receivable,
      change: 0,
      changeType: "neutral",
      format: "currency",
    },
    {
      label: "Accounts Payable",
      value: dashboardData.accounts_payable,
      change: 0,
      changeType: "neutral",
      format: "currency",
    },
  ];
}

/**
 * Calculates total AR from unpaid invoices
 */
export function calculateAR(invoices: Invoice[]): number {
  return invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.balance, 0);
}

/**
 * Calculates total AP from unpaid bills
 */
export function calculateAP(bills: Bill[]): number {
  return bills
    .filter((bill) => bill.status !== "paid")
    .reduce((sum, bill) => sum + bill.balance, 0);
}

/**
 * Combines all transformed data into a complete DashboardData object
 */
export function buildDashboardData(
  profitAndLoss: ReturnType<typeof transformProfitAndLoss>,
  balanceSheet: ReturnType<typeof transformBalanceSheet>,
  invoices: Invoice[],
  bills: Bill[],
  cashFlow: CashFlowData[]
): DashboardData {
  // Calculate AR from unpaid invoices — cross-check with balance sheet AR
  const invoiceAR = calculateAR(invoices);
  const balanceSheetAR = balanceSheet.accountsReceivable;
  // Use balance sheet AR if available (more authoritative), fall back to invoice sum
  const accountsReceivable = balanceSheetAR > 0 ? balanceSheetAR : invoiceAR;

  // Calculate AP from unpaid bills — cross-check with balance sheet AP
  const billAP = calculateAP(bills);
  const balanceSheetAP = balanceSheet.accountsPayable;
  // Use balance sheet AP if available (more authoritative), fall back to bill sum
  const accountsPayable = balanceSheetAP > 0 ? balanceSheetAP : billAP;

  const dashboardData: DashboardData = {
    revenue: profitAndLoss.revenue,
    expenses: profitAndLoss.expenses,
    profit: profitAndLoss.profit,
    cash_balance: balanceSheet.cashBalance,
    accounts_receivable: accountsReceivable,
    accounts_payable: accountsPayable,
    jobs: [],
    invoices,
    bills,
    cash_flow: cashFlow,
    metrics: [],
    last_updated: new Date().toISOString(),
  };

  dashboardData.metrics = createMetrics(dashboardData);

  return dashboardData;
}
