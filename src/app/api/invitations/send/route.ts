import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendInvitationEmail } from "@/lib/email-service";

interface SendInvitationBody {
  emails: Array<{
    email: string;
    firstName: string;
  }>;
  companyName: string;
  companyId: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin role
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: { role: string } | null };

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as SendInvitationBody;

    if (!body.emails?.length || !body.companyName || !body.companyId) {
      return NextResponse.json(
        { error: "emails, companyName et companyId sont requis" },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://neo-coaching.fr";

    const results: Array<{
      email: string;
      success: boolean;
      error?: string;
    }> = [];

    for (const { email, firstName } of body.emails) {
      // Create invitation token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: tokenError } = await supabase
        .from("invitation_tokens" as never)
        .insert({
          token,
          email,
          company_id: body.companyId,
          role: "salarie",
          expires_at: expiresAt.toISOString(),
        } as never);

      if (tokenError) {
        results.push({
          email,
          success: false,
          error: `Token creation failed: ${tokenError.message}`,
        });
        continue;
      }

      const inviteUrl = `${appUrl}/invitation/${token}`;
      const emailResult = await sendInvitationEmail(email, {
        firstName,
        companyName: body.companyName,
        inviteUrl,
      });

      results.push({
        email,
        success: emailResult.success,
        error: emailResult.error,
      });
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      sent,
      failed,
      results,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
