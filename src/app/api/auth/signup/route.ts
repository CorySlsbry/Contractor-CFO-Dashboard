/**
 * Server-side Signup Endpoint
 * POST /api/auth/signup
 * Creates user with auto-confirmed email, org, and profile in one transaction
 * Uses service role key to bypass email confirmation and RLS
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, companyName } = await request.json();

    // Validate inputs
    if (!email || !password || !fullName || !companyName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Step 1: Create auth user with auto-confirmed email
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email confirmation entirely
        user_metadata: {
          full_name: fullName,
          company_name: companyName,
        },
      });

    if (authError) {
      // Handle duplicate email
      if (authError.message.includes("already been registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in." },
          { status: 409 }
        );
      }
      console.error("Auth create error:", authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // Step 2: Create organization (service role bypasses RLS)
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: companyName,
        slug,
        trial_ends_at: trialEndsAt,
        subscription_status: "trialing",
      })
      .select("id")
      .single();

    if (orgError) {
      // Rollback: delete the auth user since org creation failed
      await supabase.auth.admin.deleteUser(userId);
      console.error("Org create error:", orgError);
      return NextResponse.json(
        { error: "Failed to create organization: " + orgError.message },
        { status: 500 }
      );
    }

    // Step 3: Create or update profile linked to the organization
    // Use upsert because a database trigger may have auto-created the profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          full_name: fullName,
          organization_id: orgData.id,
          role: "owner" as any,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      // Rollback: delete org and auth user
      await supabase.from("organizations").delete().eq("id", orgData.id);
      await supabase.auth.admin.deleteUser(userId);
      console.error("Profile create error:", profileError);
      return NextResponse.json(
        { error: "Failed to create profile: " + profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: authData.user.email,
      },
    });
  } catch (err) {
    console.error("Unexpected signup error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
