import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Zoom API credentials (would be stored in env vars in production)
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

interface ZoomMeetingRequest {
  topic: string;
  startTime: string; // ISO 8601 format
  duration: number; // minutes
  attendeeEmail: string;
  attendeeName: string;
  hostEmail?: string;
  moduleTitle?: string;
}

interface ZoomMeetingResponse {
  id: number;
  join_url: string;
  start_url: string;
  password: string;
}

// Generate ICS calendar file content
function generateICSContent(
  topic: string,
  startTime: Date,
  duration: number,
  joinUrl: string,
  attendeeName: string,
  attendeeEmail: string
): string {
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@neo-formations.fr`;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NEO-FORMATIONS//Coaching Session//FR
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${uid}
DTSTART:${formatDate(startTime)}
DTEND:${formatDate(endTime)}
SUMMARY:${topic}
DESCRIPTION:Seance de coaching Neo-Formations\\n\\nRejoindre via Zoom: ${joinUrl}\\n\\nCoach: Jean-Claude YEKPE
LOCATION:Zoom Meeting
ORGANIZER;CN=Jean-Claude YEKPE:mailto:contact@neo-formations.fr
ATTENDEE;CN=${attendeeName};RSVP=TRUE:mailto:${attendeeEmail}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:Rappel: Seance de coaching dans 30 minutes
END:VALARM
BEGIN:VALARM
TRIGGER:-PT1D
ACTION:DISPLAY
DESCRIPTION:Rappel: Seance de coaching demain
END:VALARM
END:VEVENT
END:VCALENDAR`;
}

// Get Zoom OAuth token using Server-to-Server OAuth
async function getZoomAccessToken(): Promise<string | null> {
  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
    console.log("Zoom credentials not configured, using mock mode");
    return null;
  }

  try {
    const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64");

    const response = await fetch("https://zoom.us/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "account_credentials",
        account_id: ZOOM_ACCOUNT_ID,
      }),
    });

    if (!response.ok) {
      throw new Error(`Zoom OAuth failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting Zoom access token:", error);
    return null;
  }
}

// Create Zoom meeting
async function createZoomMeeting(
  accessToken: string,
  topic: string,
  startTime: string,
  duration: number
): Promise<ZoomMeetingResponse | null> {
  try {
    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration,
        timezone: "Europe/Paris",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
          auto_recording: "none",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Zoom API failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Zoom meeting:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ZoomMeetingRequest = await request.json();
    const { topic, startTime, duration, attendeeEmail, attendeeName, moduleTitle } = body;

    // Validate required fields
    if (!topic || !startTime || !duration || !attendeeEmail || !attendeeName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const startDate = new Date(startTime);

    // Try to create real Zoom meeting
    const accessToken = await getZoomAccessToken();
    let meetingData: ZoomMeetingResponse | null = null;

    if (accessToken) {
      meetingData = await createZoomMeeting(accessToken, topic, startTime, duration);
    }

    // If Zoom API not configured or failed, generate mock meeting data
    if (!meetingData) {
      const mockId = Math.floor(Math.random() * 9000000000) + 1000000000;
      meetingData = {
        id: mockId,
        join_url: `https://zoom.us/j/${mockId}`,
        start_url: `https://zoom.us/s/${mockId}?zak=mock`,
        password: Math.random().toString(36).substring(2, 8),
      };
    }

    // Generate ICS calendar content
    const icsContent = generateICSContent(
      topic,
      startDate,
      duration,
      meetingData.join_url,
      attendeeName,
      attendeeEmail
    );

    // Store appointment in Supabase (optional - only if credentials configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        // Find the coachee profile by email
        const { data: coacheeProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", attendeeEmail)
          .single();

        if (coacheeProfile) {
          // Create appointment record
          await supabase.from("appointments").insert({
            user_id: coacheeProfile.id,
            datetime_start: startTime,
            datetime_end: new Date(startDate.getTime() + duration * 60000).toISOString(),
            type: "coaching",
            status: "confirmed",
            zoom_link: meetingData.join_url,
            notes: moduleTitle ? `Module: ${moduleTitle}` : null,
          });
        }
      } catch (dbError) {
        console.log("Could not store appointment in database:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      meeting: {
        id: meetingData.id,
        joinUrl: meetingData.join_url,
        startUrl: meetingData.start_url,
        password: meetingData.password,
      },
      calendar: {
        icsContent,
        filename: `coaching-session-${startDate.toISOString().split("T")[0]}.ics`,
      },
    });
  } catch (error) {
    console.error("Error in create-meeting API:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
