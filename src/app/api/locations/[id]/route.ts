/**
 * Location detail API
 * PUT    /api/locations/[id]  — update a location
 * DELETE /api/locations/[id]  — soft-delete (set is_active = false)
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .update({
        name: name.trim(),
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        zip: zip?.trim() || null,
        phone: phone?.trim() || null,
        notes: notes?.trim() || null,
      })
      .eq("id", params.id)
      .eq("organization_id", orgId)
      .select()
      .single();

    if (error) {
      console.error("Error updating location:", error);
      return NextResponse.json({ success: false, error: "Failed to update location" }, { status: 500 });
    }

    if (!location) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    console.error("Locations PUT error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Soft-delete: set is_active = false so linked rows remain valid
    const { error } = await (supabase as any)
      .from("locations")
      .update({ is_active: false })
      .eq("id", params.id)
      .eq("organization_id", orgId);

    if (error) {
      console.error("Error deleting location:", error);
      return NextResponse.json({ success: false, error: "Failed to delete location" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Locations DELETE error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
