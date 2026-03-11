// ===========================================================================
// Email Service for Neo-Coaching Platform
// Abstraction layer ready for Resend integration.
// In development (no RESEND_API_KEY), emails are logged to console.
// ===========================================================================

import {
  generateWelcomeEmail,
  generateRdvConfirmationEmail,
  generateModuleCompleteEmail,
  generateKpiAlertEmail,
  generateInvitationEmail,
  generateRdvReminderEmail,
  generateBookingConfirmationEmail,
} from "@/lib/email-templates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_FROM = "Neo-Coaching <contact@neo-coaching.fr>";

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const from = payload.from ?? DEFAULT_FROM;

  const apiKey = process.env.RESEND_API_KEY;

  // Development mode – no API key configured
  if (!apiKey) {
    const devId = `dev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    console.log("──────────────────────────────────────────");
    console.log("[EMAIL-SERVICE] Mode developpement (pas de RESEND_API_KEY)");
    console.log(`  From   : ${from}`);
    console.log(`  To     : ${payload.to}`);
    console.log(`  Subject: ${payload.subject}`);
    console.log(`  ReplyTo: ${payload.replyTo ?? "(aucun)"}`);
    console.log(`  ID     : ${devId}`);
    console.log("──────────────────────────────────────────");
    return { success: true, id: devId };
  }

  // Production mode – call Resend API
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[EMAIL-SERVICE] Resend API error:", response.status, errorBody);
      return {
        success: false,
        error: `Resend API error (${response.status}): ${errorBody}`,
      };
    }

    const data: { id: string } = await response.json();
    return { success: true, id: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[EMAIL-SERVICE] Send failed:", message);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Template-specific helpers
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(
  to: string,
  firstName: string
): Promise<EmailResult> {
  try {
    const html = generateWelcomeEmail({
      firstName,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://neo-coaching.fr"}/coaching/dashboard`,
    });

    return sendEmail({
      to,
      subject: `Bienvenue sur Neo-Coaching, ${firstName} !`,
      html,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[EMAIL-SERVICE] sendWelcomeEmail failed:", message);
    return { success: false, error: message };
  }
}

export async function sendRdvConfirmationEmail(
  to: string,
  vars: {
    firstName: string;
    date: string;
    time: string;
    duration: string;
    coachName: string;
    zoomLink: string;
  }
): Promise<EmailResult> {
  try {
    const html = generateRdvConfirmationEmail(vars);

    return sendEmail({
      to,
      subject: `Votre rendez-vous du ${vars.date} est confirme`,
      html,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[EMAIL-SERVICE] sendRdvConfirmationEmail failed:", message);
    return { success: false, error: message };
  }
}

export async function sendModuleCompleteEmail(
  to: string,
  vars: {
    firstName: string;
    moduleTitle: string;
    certificateUrl: string;
  }
): Promise<EmailResult> {
  try {
    const html = generateModuleCompleteEmail(vars);

    return sendEmail({
      to,
      subject: `Felicitations ${vars.firstName} ! Module termine`,
      html,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[EMAIL-SERVICE] sendModuleCompleteEmail failed:", message);
    return { success: false, error: message };
  }
}

export async function sendKpiAlertEmail(
  to: string,
  vars: {
    coacheeName: string;
    kpiName: string;
    kpiValue: string;
    coacheeProfileUrl: string;
  }
): Promise<EmailResult> {
  try {
    const html = generateKpiAlertEmail(vars);
    return sendEmail({
      to,
      subject: `Alerte : indicateur en baisse pour ${vars.coacheeName}`,
      html,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[EMAIL-SERVICE] sendKpiAlertEmail failed:", message);
    return { success: false, error: message };
  }
}

export async function sendInvitationEmail(
  to: string,
  vars: {
    firstName: string;
    companyName: string;
    inviteUrl: string;
  }
): Promise<EmailResult> {
  try {
    const html = generateInvitationEmail(vars);
    return sendEmail({
      to,
      subject: `${vars.companyName} vous invite sur Neo-Coaching`,
      html,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[EMAIL-SERVICE] sendInvitationEmail failed:", message);
    return { success: false, error: message };
  }
}

export async function sendRdvReminderEmail(
  to: string,
  vars: {
    firstName: string;
    date: string;
    time: string;
    coachName: string;
    zoomLink: string;
    hoursUntil: string;
  }
): Promise<EmailResult> {
  try {
    const html = generateRdvReminderEmail(vars);
    return sendEmail({
      to,
      subject: `Rappel : votre coaching est dans ${vars.hoursUntil}h`,
      html,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[EMAIL-SERVICE] sendRdvReminderEmail failed:", message);
    return { success: false, error: message };
  }
}

export async function sendBookingConfirmationEmail(
  to: string,
  vars: {
    firstName: string;
    date: string;
    time: string;
  }
): Promise<EmailResult> {
  try {
    const html = generateBookingConfirmationEmail(vars);
    return sendEmail({
      to,
      subject: `Votre demande de consultation a ete recue`,
      html,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[EMAIL-SERVICE] sendBookingConfirmationEmail failed:", message);
    return { success: false, error: message };
  }
}
