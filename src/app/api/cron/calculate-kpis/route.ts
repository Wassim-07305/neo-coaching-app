import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateKpis, checkKpiAlerts, type KpiInput } from "@/lib/kpi-calculator";
import { sendKpiAlertEmail } from "@/lib/email-service";

// Called by cron (daily recommended). Recalculates KPIs for all active coachees.

export async function GET(request: NextRequest) {
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
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

  const stats = { updated: 0, alerts: 0, errors: 0, details: [] as string[] };

  // Get all active coachees and salaries
  const { data: profiles } = (await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, role")
    .in("role", ["coachee", "salarie"])
    .eq("status", "actif")) as {
    data: Array<{
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
    }> | null;
  };

  if (!profiles?.length) {
    return NextResponse.json({ success: true, message: "No active coachees", ...stats });
  }

  // Get admin email for alerts
  const { data: admin } = (await supabase
    .from("profiles")
    .select("email")
    .eq("role", "admin")
    .limit(1)
    .single()) as { data: { email: string } | null };

  const adminEmail = admin?.email ?? "jc@neo-coaching.fr";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://neo-coaching.fr";

  for (const profile of profiles) {
    try {
      // 1. Get module progress data
      const { data: moduleProgress } = (await supabase
        .from("module_progress")
        .select("status, started_at, completed_at")
        .eq("user_id", profile.id)) as {
        data: Array<{ status: string; started_at: string | null; completed_at: string | null }> | null;
      };

      const completedModules = (moduleProgress ?? []).filter(
        (m) => m.status === "validated" || m.status === "completed"
      ).length;

      // Estimate minutes: 60 min per completed module
      const minutesOnModules = completedModules * 60;
      const totalPossibleMinutes = Math.max((moduleProgress ?? []).length * 60, 60);

      // 2. Get RDV count (last 30 days)
      const { count: rdvCount } = await supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("coachee_id", profile.id)
        .gte("date", thirtyDaysAgo.toISOString())
        .eq("status", "completed");

      // 3. Check community activity (last 7 days)
      const { count: recentMessages } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.id)
        .gte("created_at", sevenDaysAgo.toISOString());

      // 4. Get total messages and approximate reactions (last 30 days)
      const { count: totalMessages } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.id)
        .gte("created_at", thirtyDaysAgo.toISOString());

      // 5. Get last activity date
      const { data: lastMsg } = (await supabase
        .from("messages")
        .select("created_at")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()) as { data: { created_at: string } | null };

      const lastActivity = lastMsg?.created_at
        ? new Date(lastMsg.created_at)
        : thirtyDaysAgo;
      const noActivityDays = Math.floor(
        (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Build KPI input
      const input: KpiInput = {
        minutesOnModules,
        totalPossibleMinutes,
        rdvCount: rdvCount ?? 0,
        communityMessageThisWeek: (recentMessages ?? 0) > 0,
        noActivityDays,
        questionnaireScore: 5, // Default if no questionnaire data
        rdvFeedbackScore: 5, // Default if no feedback
        badgesCount: completedModules, // 1 badge per completed module
        maxBadges: Math.max((moduleProgress ?? []).length, 1),
        messagesCount: totalMessages ?? 0,
        reactionsCount: 0, // Would need reactions table
        eventsAttended: rdvCount ?? 0,
        periodDays: 30,
      };

      const kpiResult = calculateKpis(input);

      // 6. Get previous month's KPIs for comparison
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .slice(0, 7);

      const { data: prevKpi } = (await supabase
        .from("kpi_scores")
        .select("investissement, efficacite, participation")
        .eq("user_id", profile.id)
        .eq("month", lastMonth)
        .single()) as {
        data: {
          investissement: number;
          efficacite: number;
          participation: number;
        } | null;
      };

      // 7. Upsert current month KPI
      const { error: upsertError } = await supabase
        .from("kpi_scores")
        .upsert(
          {
            user_id: profile.id,
            month: currentMonth,
            investissement: kpiResult.investissement,
            efficacite: kpiResult.efficacite,
            participation: kpiResult.participation,
          },
          { onConflict: "user_id,month" }
        );

      if (upsertError) {
        stats.errors++;
        stats.details.push(
          `Error upserting KPI for ${profile.first_name}: ${upsertError.message}`
        );
        continue;
      }

      stats.updated++;

      // 8. Check alerts
      const alerts = checkKpiAlerts(kpiResult, prevKpi ?? undefined);

      if (alerts.length > 0) {
        stats.alerts += alerts.length;

        // Create notification in DB
        for (const alertMsg of alerts) {
          await supabase.from("notifications").insert({
            user_id: profile.id,
            type: "kpi",
            title: "Alerte indicateur",
            message: alertMsg,
          });
        }

        // Send email alert to admin
        const lowestKpi = Math.min(
          kpiResult.investissement,
          kpiResult.efficacite,
          kpiResult.participation
        );
        const kpiName =
          lowestKpi === kpiResult.investissement
            ? "Investissement"
            : lowestKpi === kpiResult.efficacite
              ? "Efficacite"
              : "Participation";

        await sendKpiAlertEmail(adminEmail, {
          coacheeName: `${profile.first_name} ${profile.last_name}`,
          kpiName,
          kpiValue: lowestKpi.toFixed(1),
          coacheeProfileUrl: `${appUrl}/admin/coachees/${profile.id}`,
        });

        stats.details.push(
          `ALERT: ${profile.first_name} ${profile.last_name} - ${alerts.join(", ")}`
        );
      }
    } catch (err) {
      stats.errors++;
      stats.details.push(
        `Exception for ${profile.id}: ${err instanceof Error ? err.message : "unknown"}`
      );
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    ...stats,
  });
}
