import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface SessionNote {
  appointmentId: string;
  coachId: string;
  clientId: string;
  content: string;
  privateNotes?: string;
  keyTakeaways?: string[];
  nextSteps?: string[];
  moodRating?: number;
  progressRating?: number;
}

// GET - Fetch session notes
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const appointmentId = searchParams.get("appointmentId");
  const clientId = searchParams.get("clientId");
  const coachId = searchParams.get("coachId");

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({
      success: true,
      mock: true,
      data: getMockSessionNotes(appointmentId, clientId),
    });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    let query = supabase.from("session_notes").select(`
      *,
      appointment:appointments(*),
      client:profiles!session_notes_client_id_fkey(id, first_name, last_name, email)
    `);

    if (appointmentId) query = query.eq("appointment_id", appointmentId);
    if (clientId) query = query.eq("client_id", clientId);
    if (coachId) query = query.eq("coach_id", coachId);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching session notes:", error);
      return NextResponse.json(
        { error: "Failed to fetch session notes" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in session notes API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// POST - Create or update session notes
export async function POST(request: NextRequest) {
  try {
    const body: SessionNote = await request.json();
    const {
      appointmentId,
      coachId,
      clientId,
      content,
      privateNotes,
      keyTakeaways,
      nextSteps,
      moodRating,
      progressRating,
    } = body;

    // Validate required fields
    if (!appointmentId || !coachId || !clientId || !content) {
      return NextResponse.json(
        { error: "Missing required fields: appointmentId, coachId, clientId, content" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Session notes saved (mock mode)",
        data: {
          id: `note-${Date.now()}`,
          appointment_id: appointmentId,
          coach_id: coachId,
          client_id: clientId,
          content,
          private_notes: privateNotes,
          key_takeaways: keyTakeaways,
          next_steps: nextSteps,
          mood_rating: moodRating,
          progress_rating: progressRating,
          created_at: new Date().toISOString(),
        },
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Upsert session notes
    const { data, error } = await supabase
      .from("session_notes")
      .upsert(
        {
          appointment_id: appointmentId,
          coach_id: coachId,
          client_id: clientId,
          content,
          private_notes: privateNotes,
          key_takeaways: keyTakeaways,
          next_steps: nextSteps,
          mood_rating: moodRating,
          progress_rating: progressRating,
        },
        { onConflict: "appointment_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving session notes:", error);
      return NextResponse.json(
        { error: "Failed to save session notes" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Session notes saved successfully",
    });
  } catch (error) {
    console.error("Error in session notes API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Mock data for development
function getMockSessionNotes(appointmentId: string | null, clientId: string | null) {
  const mockNotes = [
    {
      id: "note-1",
      appointment_id: appointmentId || "appt-1",
      coach_id: "coach-1",
      client_id: clientId || "client-1",
      content: "Session tres productive. Marie a montre une grande progression sur la gestion du stress. Elle applique les techniques de respiration au quotidien.",
      private_notes: "Surveiller le niveau d'anxiete lors des presentations en public.",
      key_takeaways: [
        "Technique de respiration maitrisee",
        "Meilleure gestion des emotions",
        "Progres sur la confiance en soi",
      ],
      next_steps: [
        "Pratiquer la visualisation positive 10 min/jour",
        "Preparer la presentation du mois prochain",
        "Tenir un journal des reussites",
      ],
      mood_rating: 8,
      progress_rating: 7,
      created_at: "2026-03-08T14:00:00Z",
      client: {
        id: clientId || "client-1",
        first_name: "Marie",
        last_name: "Dupont",
        email: "marie.dupont@example.com",
      },
    },
    {
      id: "note-2",
      appointment_id: "appt-2",
      coach_id: "coach-1",
      client_id: clientId || "client-1",
      content: "Session de suivi sur les objectifs fixes le mois dernier. Marie a atteint 3 objectifs sur 4.",
      private_notes: null,
      key_takeaways: [
        "Objectifs professionnels en bonne voie",
        "Equilibre vie pro/perso ameliore",
      ],
      next_steps: [
        "Finaliser le dernier objectif",
        "Definir les objectifs du trimestre prochain",
      ],
      mood_rating: 9,
      progress_rating: 8,
      created_at: "2026-02-22T10:00:00Z",
      client: {
        id: clientId || "client-1",
        first_name: "Marie",
        last_name: "Dupont",
        email: "marie.dupont@example.com",
      },
    },
  ];

  return mockNotes;
}
