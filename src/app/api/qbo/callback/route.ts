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

    // Store tokens in organization record
    const { error: updateError } = await (supabase as any)
      .from("organizations")
      .update({
        qbo_realm_id: realmId,
        qbo_access_token: tokenResponse.access_token,
        qbo_refresh_token: tokenResponse.refresh_token,
        qbo_token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", (profile as any).organization_id);

    if (updateError) {
      console.error("Failed to store QBO tokens:", updateError);
      return NextResponse.json(
        { error: "Failed to store authentication tokens" },
        { status: 500 }
      );
    }

    // Also upsert into integration_connections so the dashboard detects QBO
    await (supabase as any)
      .from("integration_connections")
      .upsert({
        organization_id: (profile as any).organization_id,
        provider: "quickbooks",
        status: "connected",
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token,
        token_expires_at: expiresAt.toISOString(),
        last_sync_status: "idle",
        updated_at: new Date().toISOString(),
      }, { onConflict: "organization_id,provider" });

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
