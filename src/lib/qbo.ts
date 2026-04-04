/**
 * QuickBooks Online (QBO) API helper class
 * Handles OAuth authentication and API requests to QBO
 */

import type { QBOTokenResponse } from "@/types";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  x_refresh_token_expires_in: number;
  token_type: string;
  expires_in: number;
  realm_id: string;
}

export class QBOClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private sandbox: boolean;

  constructor(
    clientId: string = process.env.QBO_CLIENT_ID || "",
    clientSecret: string = process.env.QBO_CLIENT_SECRET || "",
    redirectUri: string = process.env.QBO_REDIRECT_URI || "",
    sandbox: boolean = process.env.NODE_ENV === "development"
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.sandbox = sandbox;
  }

  /**
   * Builds the Intuit OAuth 2.0 authorization URL
   */
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      scope: "com.intuit.quickbooks.accounting",
      redirect_uri: this.redirectUri,
      state,
    });

    return `https://appcenter.intuit.com/connect/oauth2?${params.toString()}`;
  }

  /**
   * Exchanges authorization code for tokens
   */
  async exchangeCode(code: string, realmId: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.redirectUri,
    });

    const response = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to exchange code: ${error.error_description || error.error}`);
    }

    const data = (await response.json()) as TokenResponse;
    return data;
  }

  /**
   * Refreshes an expired access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    const response = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to refresh token: ${error.error_description || error.error}`);
    }

    const data = (await response.json()) as TokenResponse;
    return data;
  }

  /**
   * Makes an authenticated request to the QBO API
   */
  private async makeRequest(
    accessToken: string,
    realmId: string,
    endpoint: string,
    method: string = "GET",
    body?: Record<string, any>
  ): Promise<any> {
    const baseUrl = this.sandbox
      ? "https://sandbox-quickbooks.api.intuit.com/v3/company"
      : "https://quickbooks.api.intuit.com/v3/company";

    const url = `${baseUrl}/${realmId}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    };

    if (body) {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `QBO API error: ${error.message || error.error || response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Gets company information
   */
  async getCompanyInfo(accessToken: string, realmId: string): Promise<any> {
    return this.makeRequest(accessToken, realmId, "/companyinfo/" + realmId);
  }

  /**
   * Gets Profit & Loss report
   */
  async getProfitAndLoss(
    accessToken: string,
    realmId: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const query = encodeURIComponent(
      `select * from ProfitAndLoss startDate='${startDate}' endDate='${endDate}'`
    );
    return this.makeRequest(
      accessToken,
      realmId,
      `/query?query=${query}`
    );
  }

  /**
   * Gets Balance Sheet report
   */
  async getBalanceSheet(accessToken: string, realmId: string): Promise<any> {
    const query = encodeURIComponent("select * from BalanceSheet");
    return this.makeRequest(
      accessToken,
      realmId,
      `/query?query=${query}`
    );
  }

  /**
   * Gets Cash Flow data
   * Note: QBO doesn't have a native Cash Flow report, so we'll construct it from Journal entries
   */
  async getCashFlow(
    accessToken: string,
    realmId: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const query = encodeURIComponent(
      `select * from JournalEntry where TxnDate >= '${startDate}' and TxnDate <= '${endDate}'`
    );
    return this.makeRequest(
      accessToken,
      realmId,
      `/query?query=${query}`
    );
  }

  /**
   * Gets invoices with pagination (fetches ALL invoices, not capped at 1000)
   */
  async getInvoices(accessToken: string, realmId: string): Promise<any> {
    const allInvoices: any[] = [];
    let startPosition = 1;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const query = encodeURIComponent(
        `select * from Invoice startposition ${startPosition} maxresults ${pageSize}`
      );
      const response = await this.makeRequest(
        accessToken,
        realmId,
        `/query?query=${query}`
      );

      const invoices = response?.QueryResponse?.Invoice || [];
      allInvoices.push(...invoices);

      if (invoices.length < pageSize) {
        hasMore = false;
      } else {
        startPosition += pageSize;
      }
    }

    return {
      QueryResponse: {
        Invoice: allInvoices,
        totalCount: allInvoices.length,
      },
    };
  }

  /**
   * Gets all bills with pagination (for AP tracking)
   */
  async getBills(accessToken: string, realmId: string): Promise<any> {
    const allBills: any[] = [];
    let startPosition = 1;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const query = encodeURIComponent(
        `select * from Bill startposition ${startPosition} maxresults ${pageSize}`
      );
      const response = await this.makeRequest(
        accessToken,
        realmId,
        `/query?query=${query}`
      );

      const bills = response?.QueryResponse?.Bill || [];
      allBills.push(...bills);

      if (bills.length < pageSize) {
        hasMore = false;
      } else {
        startPosition += pageSize;
      }
    }

    return {
      QueryResponse: {
        Bill: allBills,
        totalCount: allBills.length,
      },
    };
  }

  /**
   * Gets all accounts (chart of accounts)
   */
  async getAccounts(accessToken: string, realmId: string): Promise<any> {
    const query = encodeURIComponent("select * from Account");
    return this.makeRequest(
      accessToken,
      realmId,
      `/query?query=${query}`
    );
  }

  /**
   * Gets Profit & Loss report with monthly columns for trend data
   */
  async getProfitAndLossDetail(
    accessToken: string,
    realmId: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    return this.makeRequest(
      accessToken,
      realmId,
      `/reports/ProfitAndLoss?start_date=${startDate}&end_date=${endDate}&summarize_column_by=Month`
    );
  }

  /**
   * Gets Balance Sheet report via the reports endpoint (structured)
   */
  async getBalanceSheetReport(
    accessToken: string,
    realmId: string
  ): Promise<any> {
    const today = new Date().toISOString().split("T")[0];
    return this.makeRequest(
      accessToken,
      realmId,
      `/reports/BalanceSheet?date=${today}`
    );
  }
}

// Export singleton instance
export const qboClient = new QBOClient();
