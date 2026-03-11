import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendRdvReminderEmail } from "@/lib/email-service";

// This endpoint is designed to be called by a cron job (e.g. Vercel Cron, n8n)
// It finds appointments happening in the next 24h or 2h and sends reminders.

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const now = new Date();
  const in2h = new Date(now.getTime() + 2.5 * 60 * 60 * 1000);
  const in1h30 = new Date(now.getTime() + 1.5 * 60 * 60 * 1000);
  const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000);

  const results: { sent: number; errors: number; details: string[] } = {
    sent: 0,
    errors: 0,
    details: [],
  };

  // Find appointments in ~24h window
  const { data: rdv24h } = (await supabase
    .from("appointments")
    .select("id, date, coachee_id, type")
    .gte("date", in23h.toISOString())
    .lte("date", in25h.toISOString())
    .eq("status", "confirmed")) as { data: Array<{ id: string; date: string; coachee_id: string; type: string }> | null };

  // Find appointments in ~2h window
  const { data: rdv2h } = (await supabase
    .from("appointments")
    .select("id, date, coachee_id, type")
    .gte("date", in1h30.toISOString())
    .lte("date", in2h.toISOString())
    .eq("status", "confirmed")) as { data: Array<{ id: string; date: string; coachee_id: string; type: string }> | null };

  const allRdvs = [
    ...(rdv24h ?? []).map((r) => ({ ...r, hoursUntil: "24" })),
    ...(rdv2h ?? []).map((r) => ({ ...r, hoursUntil: "2" })),
  ];

  for (const rdv of allRdvs) {
    // Get coachee profile
    const { data: profile } = (await supabase
      .from("profiles")
      .select("first_name, last_name, email")
      .eq("id", rdv.coachee_id)
      .single()) as { data: { first_name: string; last_name: string; email: string } | null };

    if (!profile?.email) {
      results.details.push(`Skipped RDV ${rdv.id}: no profile/email`);
      continue;
    }

    const rdvDate = new Date(rdv.date);
    const dateStr = rdvDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const timeStr = rdvDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const result = await sendRdvReminderEmail(profile.email, {
      firstName: profile.first_name,
      date: dateStr,
      time: timeStr,
      coachName: "Jean-Claude YEKPE",
      zoomLink: "https://zoom.us",
      hoursUntil: rdv.hoursUntil,
    });

    if (result.success) {
      results.sent++;
      results.details.push(
        `Sent ${rdv.hoursUntil}h reminder to ${profile.first_name} ${profile.last_name}`
      );
    } else {
      results.errors++;
      results.details.push(
        `Failed for ${profile.email}: ${result.error}`
      );
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    ...results,
  });
}
