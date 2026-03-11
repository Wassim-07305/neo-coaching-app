import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuditLog, type AuditAction } from "@/lib/audit-log";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null };

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") as AuditAction | null;
  const userId = searchParams.get("userId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const limit = searchParams.get("limit");

  const entries = await getAuditLog({
    action: action || undefined,
    userId: userId || undefined,
    from: from || undefined,
    to: to || undefined,
    limit: limit ? parseInt(limit, 10) : 50,
  });

  return NextResponse.json(entries);
}
