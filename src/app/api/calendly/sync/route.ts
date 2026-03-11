import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CALENDLY_API_URL = "https://api.calendly.com";

interface CalendlyEvent {
  uri: string;
  name: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location?: {
    type: string;
    location?: string;
    join_url?: string;
  };
  invitees_counter: {
    total: number;
    active: number;
  };
  status: string;
  cancel_url?: string;
  reschedule_url?: string;
}

interface CalendlyInvitee {
  uri: string;
  email: string;
  name: string;
  status: string;
}

// GET - Fetch and sync Calendly bookings
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({
      success: true,
      mock: true,
      data: getMockCalendlyBookings(),
      message: "Mock data - Supabase not configured",
    });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Get user's Calendly settings
    const { data: settings, error: settingsError } = await supabase
      .from("calendly_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({
        success: false,
        error: "Calendly settings not found for this user",
        setupRequired: true,
      });
    }

    // If no API key, return existing bookings from DB
    if (!settings.api_key) {
      const { data: bookings } = await supabase
        .from("calendly_bookings")
        .select("*")
        .eq("user_id", userId)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true });

      return NextResponse.json({
        success: true,
        data: bookings || [],
        synced: false,
        message: "API key not configured - showing cached bookings",
      });
    }

    // Fetch events from Calendly API
    const eventsResponse = await fetch(
      `${CALENDLY_API_URL}/scheduled_events?user=${settings.calendly_url}&status=active&min_start_time=${new Date().toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${settings.api_key}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!eventsResponse.ok) {
      console.error("Calendly API error:", await eventsResponse.text());

      // Return cached bookings on API error
      const { data: cachedBookings } = await supabase
        .from("calendly_bookings")
        .select("*")
        .eq("user_id", userId)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true });

      return NextResponse.json({
        success: true,
        data: cachedBookings || [],
        synced: false,
        message: "Using cached bookings - Calendly API unavailable",
      });
    }

    const eventsData = await eventsResponse.json();
    const events: CalendlyEvent[] = eventsData.collection || [];

    // Sync events to database
    const syncedBookings = [];
    for (const event of events) {
      const eventId = event.uri.split("/").pop()!;

      // Get invitee details
      let invitee: CalendlyInvitee | null = null;
      try {
        const inviteesResponse = await fetch(
          `${CALENDLY_API_URL}/scheduled_events/${eventId}/invitees`,
          {
            headers: {
              Authorization: `Bearer ${settings.api_key}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (inviteesResponse.ok) {
          const inviteesData = await inviteesResponse.json();
          invitee = inviteesData.collection?.[0] || null;
        }
      } catch {
        // Continue without invitee data
      }

      // Upsert booking
      const { data: booking, error: bookingError } = await supabase
        .from("calendly_bookings")
        .upsert(
          {
            calendly_event_id: eventId,
            user_id: userId,
            client_name: invitee?.name || null,
            client_email: invitee?.email || null,
            event_type: event.name,
            start_time: event.start_time,
            end_time: event.end_time,
            location: event.location?.join_url || event.location?.location || null,
            status: event.status,
            cancel_url: event.cancel_url || null,
            reschedule_url: event.reschedule_url || null,
            raw_data: event,
          },
          { onConflict: "calendly_event_id" }
        )
        .select()
        .single();

      if (!bookingError && booking) {
        syncedBookings.push(booking);
      }
    }

    // Update last synced timestamp
    await supabase
      .from("calendly_settings")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("user_id", userId);

    return NextResponse.json({
      success: true,
      data: syncedBookings,
      synced: true,
      count: syncedBookings.length,
    });
  } catch (error) {
    console.error("Error syncing Calendly:", error);
    return NextResponse.json(
      { error: "Failed to sync Calendly bookings" },
      { status: 500 }
    );
  }
}

// POST - Save Calendly settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, calendlyUrl, apiKey } = body;

    if (!userId || !calendlyUrl) {
      return NextResponse.json(
        { error: "userId and calendlyUrl are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Settings saved (mock mode)",
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Upsert settings
    const { data, error } = await supabase
      .from("calendly_settings")
      .upsert(
        {
          user_id: userId,
          calendly_url: calendlyUrl,
          api_key: apiKey || null,
          is_active: true,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving Calendly settings:", error);
      return NextResponse.json(
        { error: "Failed to save settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Calendly settings saved successfully",
    });
  } catch (error) {
    console.error("Error in Calendly settings API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Mock data for development
function getMockCalendlyBookings() {
  return [
    {
      id: "cal-1",
      calendly_event_id: "evt-001",
      user_id: "user-1",
      client_name: "Marie Dupont",
      client_email: "marie.dupont@example.com",
      event_type: "Seance de coaching",
      start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      end_time: new Date(Date.now() + 86400000 + 3600000).toISOString(),
      location: "https://zoom.us/j/123456789",
      status: "active",
    },
    {
      id: "cal-2",
      calendly_event_id: "evt-002",
      user_id: "user-1",
      client_name: "Pierre Martin",
      client_email: "pierre.martin@example.com",
      event_type: "Appel decouverte",
      start_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      end_time: new Date(Date.now() + 172800000 + 1800000).toISOString(),
      location: "https://zoom.us/j/987654321",
      status: "active",
    },
  ];
}
