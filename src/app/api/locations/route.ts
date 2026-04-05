/**
 * Locations API
 * GET  /api/locations  — list active locations for the user's org
 * POST /api/locations  — create a new location
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getOrgId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", userId)
    .single() as any;
  return profile?.organization_id as string | undefined;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const orgId = await getOrgId(supabase, user.id);
    if (!orgId) {
      return NextResponse.json({ success: false, error: "No organization" }, { status: 400 });
    }

    const { data: locations, error } = await (supabase as any)
      .from("locations")
      .select("id, name, address, city, state, zip, phone, notes, is_active, created_at, updated_at")
      .eq("organization_id", orgId)
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching locations:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch locations" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: locations ?? [] });
  } catch (error) {
    console.error("Locations GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const orgId = await getOrgId(supabase, user.id);
    if (!orgId) {
      return NextResponse.json({ success: false, error: "No organization" }, { status: 400 });
    }

    const body = await request.json();
    const { name, address, city, state, zip, phone, notes } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const { data: location, error } = await (supabase as any)
      .from("locations")
      .insert({
        organization_id: orgId,
        name: name.trim(),
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        zip: zip?.trim() || null,
        phone: phone?.trim() || null,
        notes: notes?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating location:", error);
      return NextResponse.json({ success: false, error: "Failed to create location" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: location }, { status: 201 });
  } catch (error) {
    console.error("Locations POST error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
