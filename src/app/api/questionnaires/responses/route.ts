import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface SubmitResponseRequest {
  questionnaireId: string;
  userId: string;
  moduleProgressId?: string;
  answers: Record<string, string | number>;
}

// GET - Fetch questionnaire responses
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const questionnaireId = searchParams.get("questionnaireId");
  const moduleProgressId = searchParams.get("moduleProgressId");
  const moduleId = searchParams.get("moduleId");
  const phase = searchParams.get("phase"); // amont | aval

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({
      success: true,
      mock: true,
      data: [],
    });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // If checking for specific module questionnaire completion
    if (moduleId && userId && phase) {
      // First get the questionnaire for this module and phase
      const { data: questionnaire } = await supabase
        .from("questionnaires")
        .select("id")
        .eq("module_id", moduleId)
        .eq("phase", phase)
        .eq("is_active", true)
        .single();

      if (!questionnaire) {
        return NextResponse.json({
          success: true,
          data: null,
          completed: false,
        });
      }

      // Check if user has responded
      const { data: response } = await supabase
        .from("questionnaire_responses")
        .select("*")
        .eq("questionnaire_id", questionnaire.id)
        .eq("user_id", userId)
        .single();

      return NextResponse.json({
        success: true,
        data: response,
        completed: !!response,
        questionnaireId: questionnaire.id,
      });
    }

    // General query for responses
    let query = supabase.from("questionnaire_responses").select(`
      *,
      questionnaire:questionnaires(id, title, phase, module_id),
      user:profiles(id, first_name, last_name, email)
    `);

    if (userId) query = query.eq("user_id", userId);
    if (questionnaireId) query = query.eq("questionnaire_id", questionnaireId);
    if (moduleProgressId) query = query.eq("module_progress_id", moduleProgressId);

    const { data, error } = await query.order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching responses:", error);
      return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in questionnaire responses API:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// POST - Submit questionnaire response
export async function POST(request: NextRequest) {
  try {
    const body: SubmitResponseRequest = await request.json();
    const { questionnaireId, userId, moduleProgressId, answers } = body;

    if (!questionnaireId || !userId || !answers) {
      return NextResponse.json(
        { error: "questionnaireId, userId, and answers are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Response saved (mock mode)",
        data: {
          id: `response-${Date.now()}`,
          questionnaire_id: questionnaireId,
          user_id: userId,
          answers,
          submitted_at: new Date().toISOString(),
        },
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Check if response already exists
    const { data: existing } = await supabase
      .from("questionnaire_responses")
      .select("id")
      .eq("questionnaire_id", questionnaireId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      // Update existing response
      const { data, error } = await supabase
        .from("questionnaire_responses")
        .update({
          answers,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating response:", error);
        return NextResponse.json({ error: "Failed to update response" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data,
        updated: true,
        message: "Response updated successfully",
      });
    }

    // Insert new response
    const { data, error } = await supabase
      .from("questionnaire_responses")
      .insert({
        questionnaire_id: questionnaireId,
        user_id: userId,
        module_progress_id: moduleProgressId || null,
        answers,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving response:", error);
      return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
    }

    // Get questionnaire to check phase
    const { data: questionnaire } = await supabase
      .from("questionnaires")
      .select("phase, module_id")
      .eq("id", questionnaireId)
      .single();

    // If this is an "aval" questionnaire, calculate satisfaction and update module_progress
    if (questionnaire?.phase === "aval" && moduleProgressId) {
      // Calculate satisfaction score from slider answers
      const sliderAnswers = Object.values(answers).filter(
        (v) => typeof v === "number" && v >= 1 && v <= 10
      ) as number[];

      if (sliderAnswers.length > 0) {
        const avgSatisfaction =
          Math.round(
            (sliderAnswers.reduce((sum, v) => sum + v, 0) / sliderAnswers.length) * 10
          ) / 10;

        await supabase
          .from("module_progress")
          .update({ satisfaction_score: avgSatisfaction })
          .eq("id", moduleProgressId);
      }
    }

    // Create notification for admin
    await supabase.from("notifications").insert({
      user_id: userId, // In production, this would be the admin ID
      type: "module_complete",
      title: `Questionnaire ${questionnaire?.phase || ""} complete`,
      body: `Un utilisateur a complete le questionnaire ${questionnaire?.phase || "Qualiopi"}.`,
      link: "/admin/questionnaires",
    });

    return NextResponse.json({
      success: true,
      data,
      message: "Response saved successfully",
    });
  } catch (error) {
    console.error("Error in questionnaire responses API:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// GET stats for a questionnaire
export async function getQuestionnaireStats(questionnaireId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: responses } = await supabase
    .from("questionnaire_responses")
    .select("answers")
    .eq("questionnaire_id", questionnaireId);

  if (!responses || responses.length === 0) {
    return { totalResponses: 0 };
  }

  // Aggregate slider answers
  const sliderStats: Record<string, { sum: number; count: number }> = {};

  for (const response of responses) {
    const answers = response.answers as Record<string, string | number>;
    for (const [key, value] of Object.entries(answers)) {
      if (typeof value === "number") {
        if (!sliderStats[key]) {
          sliderStats[key] = { sum: 0, count: 0 };
        }
        sliderStats[key].sum += value;
        sliderStats[key].count += 1;
      }
    }
  }

  const averages: Record<string, number> = {};
  for (const [key, stats] of Object.entries(sliderStats)) {
    averages[key] = Math.round((stats.sum / stats.count) * 10) / 10;
  }

  return {
    totalResponses: responses.length,
    averages,
  };
}
