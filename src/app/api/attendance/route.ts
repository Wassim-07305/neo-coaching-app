import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface AttendanceRecord {
  userId: string;
  moduleId: string;
  sessionDate: string;
  status: "present" | "absent" | "excused" | "late";
  duration?: number; // minutes
  notes?: string;
}

// GET - Fetch attendance records
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const moduleId = searchParams.get("moduleId");
  const companyId = searchParams.get("companyId");

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return mock data
    return NextResponse.json({
      success: true,
      mock: true,
      data: getMockAttendance(userId, moduleId),
    });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    let query = supabase
      .from("attendance_records")
      .select(`
        *,
        user:profiles(id, first_name, last_name, email),
        module:modules(id, title)
      `);

    if (userId) query = query.eq("user_id", userId);
    if (moduleId) query = query.eq("module_id", moduleId);
    if (companyId) {
      // Get users from company first
      const { data: companyUsers } = await supabase
        .from("profiles")
        .select("id")
        .eq("company_id", companyId);

      const userIds = companyUsers?.map(u => u.id) || [];
      if (userIds.length > 0) {
        query = query.in("user_id", userIds);
      }
    }

    const { data, error } = await query.order("session_date", { ascending: false });

    if (error) {
      console.error("Error fetching attendance:", error);
      return NextResponse.json(
        { error: "Failed to fetch attendance records" },
        { status: 500 }
      );
    }

    // Calculate attendance stats
    const stats = calculateAttendanceStats(data || []);

    return NextResponse.json({
      success: true,
      data,
      stats,
    });
  } catch (error) {
    console.error("Error in attendance API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// POST - Record attendance
export async function POST(request: NextRequest) {
  try {
    const body: AttendanceRecord | AttendanceRecord[] = await request.json();
    const records = Array.isArray(body) ? body : [body];

    // Validate records
    for (const record of records) {
      if (!record.userId || !record.moduleId || !record.sessionDate || !record.status) {
        return NextResponse.json(
          { error: "Missing required fields: userId, moduleId, sessionDate, status" },
          { status: 400 }
        );
      }
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Attendance recorded (mock mode)",
        records: records.length,
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Insert attendance records
    const { data, error } = await supabase
      .from("attendance_records")
      .upsert(
        records.map(r => ({
          user_id: r.userId,
          module_id: r.moduleId,
          session_date: r.sessionDate,
          status: r.status,
          duration_minutes: r.duration,
          notes: r.notes,
        })),
        { onConflict: "user_id,module_id,session_date" }
      )
      .select();

    if (error) {
      console.error("Error recording attendance:", error);
      return NextResponse.json(
        { error: "Failed to record attendance" },
        { status: 500 }
      );
    }

    // Update module_progress attendance rate
    for (const record of records) {
      await updateModuleAttendanceRate(supabase, record.userId, record.moduleId);
    }

    return NextResponse.json({
      success: true,
      data,
      message: `${records.length} attendance record(s) saved`,
    });
  } catch (error) {
    console.error("Error in attendance API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Helper: Calculate attendance stats
function calculateAttendanceStats(records: Array<{ status: string; duration_minutes?: number }>) {
  if (records.length === 0) {
    return {
      total: 0,
      present: 0,
      absent: 0,
      excused: 0,
      late: 0,
      attendanceRate: 0,
      totalHours: 0,
    };
  }

  const present = records.filter(r => r.status === "present").length;
  const absent = records.filter(r => r.status === "absent").length;
  const excused = records.filter(r => r.status === "excused").length;
  const late = records.filter(r => r.status === "late").length;

  // For attendance rate: present + late + excused count as attended
  const attended = present + late + excused;
  const attendanceRate = Math.round((attended / records.length) * 100);

  // Total hours
  const totalMinutes = records
    .filter(r => r.status === "present" || r.status === "late")
    .reduce((sum, r) => sum + (r.duration_minutes || 60), 0);
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

  return {
    total: records.length,
    present,
    absent,
    excused,
    late,
    attendanceRate,
    totalHours,
  };
}

// Helper: Update module progress attendance rate
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateModuleAttendanceRate(
  supabase: any,
  userId: string,
  moduleId: string
) {
  try {
    // Get all attendance records for this user/module
    const { data: records } = await supabase
      .from("attendance_records")
      .select("status")
      .eq("user_id", userId)
      .eq("module_id", moduleId);

    if (!records || records.length === 0) return;

    const attended = records.filter((r: { status: string }) =>
      r.status === "present" || r.status === "late" || r.status === "excused"
    ).length;
    const attendanceRate = Math.round((attended / records.length) * 100);

    // Update module_progress
    await supabase
      .from("module_progress")
      .update({ attendance_rate: attendanceRate })
      .eq("user_id", userId)
      .eq("module_id", moduleId);
  } catch (error) {
    console.error("Error updating attendance rate:", error);
  }
}

// Mock data for development
function getMockAttendance(userId: string | null, moduleId: string | null) {
  const mockRecords = [
    {
      id: "att-1",
      user_id: userId || "user-1",
      module_id: moduleId || "mod-1",
      session_date: "2026-03-01",
      status: "present",
      duration_minutes: 90,
      user: { first_name: "Marie", last_name: "Dupont" },
      module: { title: "Leadership Authentique" },
    },
    {
      id: "att-2",
      user_id: userId || "user-1",
      module_id: moduleId || "mod-1",
      session_date: "2026-03-08",
      status: "present",
      duration_minutes: 90,
      user: { first_name: "Marie", last_name: "Dupont" },
      module: { title: "Leadership Authentique" },
    },
    {
      id: "att-3",
      user_id: userId || "user-1",
      module_id: moduleId || "mod-2",
      session_date: "2026-02-15",
      status: "late",
      duration_minutes: 75,
      user: { first_name: "Marie", last_name: "Dupont" },
      module: { title: "Gestion du Temps" },
    },
    {
      id: "att-4",
      user_id: userId || "user-2",
      module_id: moduleId || "mod-1",
      session_date: "2026-03-01",
      status: "absent",
      duration_minutes: 0,
      user: { first_name: "Pierre", last_name: "Martin" },
      module: { title: "Leadership Authentique" },
    },
  ];

  return mockRecords;
}
