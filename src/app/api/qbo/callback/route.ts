/**
 * QBO OAuth Callback Endpoint
 * GET /api/qbo/callback
 * Handles the OAuth callback from QuickBooks Online
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { qboClient } from "@/lib/qbo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const realmId = searchParams.get("realmId");
    const state = searchParams.get("state");

    // Validate required parameters
    if (!code || !realmId || !state) {
      return NextResponse.json(
        { error: "Missing required OAuth parameters" },
        { status: 400 }
      );
    }

    // Verify state parameter
    const storedState = request.cookies.get("qbo_oauth_state")?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.json(
        { error: "Invalid state parameter" },
        { status: 400 }
      );
    }

    // Ensure user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
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
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokenResponse = await qboClient.exchangeCode(code, realmId);

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

    const orgId = (profile as any).organization_id;

    // Store tokens in organization record (backward compat)
    await (supabase as any)
      .from("organizations")
      .update({
        qbo_realm_id: realmId,
        qbo_access_token: tokenResponse.access_token,
        qbo_refresh_token: tokenResponse.refresh_token,
        qbo_token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", orgId);

    // Get the company name from QBO
    let companyName = `QBO Company (${realmId})`;
    try {
      const companyInfo = await qboClient.getCompanyInfo(tokenResponse.access_token, realmId);
      companyName = companyInfo?.CompanyInfo?.CompanyName || companyName;
    } catch {
      // Use default name if company info fetch fails
    }

    // Upsert into client_companies — if realm already connected, update tokens
    const { error: clientError } = await (supabase as any)
      .from("client_companies")
      .upsert(
        {
          organization_id: orgId,
          name: companyName,
          qbo_realm_id: realmId,
          qbo_access_token: tokenResponse.access_token,
          qbo_refresh_token: tokenResponse.refresh_token,
          qbo_token_expires_at: expiresAt.toISOString(),
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "qbo_realm_id" }
      );

    if (clientError) {
      console.error("Failed to upsert client company:", clientError);
      // Non-fatal: org-level tokens still saved
    }

    // Create response redirecting to dashboard
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?qbo_connected=true`
    );

    // Clear state cookie
    response.cookies.delete("qbo_oauth_state");

    return response;
  } catch (error) {
    console.error("QBO Callback Error:", error);

    // Redirect to dashboard with error
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?qbo_error=connection_failed`
    );

    response.cookies.delete("qbo_oauth_state");

    return response;
  }
}
