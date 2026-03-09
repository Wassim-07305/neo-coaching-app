import { NextRequest, NextResponse } from "next/server";
import {
  sendWelcomeEmail,
  sendRdvConfirmationEmail,
  sendModuleCompleteEmail,
  sendEmail,
} from "@/lib/email-service";
import type { EmailResult } from "@/lib/email-service";

// ---------------------------------------------------------------------------
// Types for request body
// ---------------------------------------------------------------------------

type TemplateType = "welcome" | "rdv_confirmation" | "module_complete" | "custom";

interface WelcomeVariables {
  firstName: string;
}

interface RdvConfirmationVariables {
  firstName: string;
  date: string;
  time: string;
  duration: string;
  coachName: string;
  zoomLink: string;
}

interface ModuleCompleteVariables {
  firstName: string;
  moduleTitle: string;
  certificateUrl: string;
}

interface CustomVariables {
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

type TemplateVariables =
  | WelcomeVariables
  | RdvConfirmationVariables
  | ModuleCompleteVariables
  | CustomVariables;

interface SendEmailBody {
  template: TemplateType;
  to: string;
  variables: TemplateVariables;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasRequiredFields(
  variables: Record<string, unknown>,
  fields: string[]
): string | null {
  for (const field of fields) {
    if (!variables[field] || typeof variables[field] !== "string") {
      return `Le champ "${field}" est requis et doit etre une chaine de caracteres.`;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // TODO: In production, authenticate the request (e.g. check session/JWT token).
  // For now this endpoint is unprotected.

  try {
    const body = (await request.json()) as SendEmailBody;

    // Basic validation
    if (!body.template || !body.to || !body.variables) {
      return NextResponse.json(
        { success: false, error: "Les champs template, to et variables sont requis." },
        { status: 400 }
      );
    }

    if (!isValidEmail(body.to)) {
      return NextResponse.json(
        { success: false, error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const validTemplates: TemplateType[] = [
      "welcome",
      "rdv_confirmation",
      "module_complete",
      "custom",
    ];
    if (!validTemplates.includes(body.template)) {
      return NextResponse.json(
        {
          success: false,
          error: `Template invalide. Templates disponibles : ${validTemplates.join(", ")}`,
        },
        { status: 400 }
      );
    }

    let result: EmailResult;
    const vars = body.variables as unknown as Record<string, string>;

    switch (body.template) {
      case "welcome": {
        const err = hasRequiredFields(vars, ["firstName"]);
        if (err) {
          return NextResponse.json({ success: false, error: err }, { status: 400 });
        }
        result = await sendWelcomeEmail(body.to, vars.firstName);
        break;
      }

      case "rdv_confirmation": {
        const requiredFields = [
          "firstName",
          "date",
          "time",
          "duration",
          "coachName",
          "zoomLink",
        ];
        const err = hasRequiredFields(vars, requiredFields);
        if (err) {
          return NextResponse.json({ success: false, error: err }, { status: 400 });
        }
        result = await sendRdvConfirmationEmail(body.to, {
          firstName: vars.firstName,
          date: vars.date,
          time: vars.time,
          duration: vars.duration,
          coachName: vars.coachName,
          zoomLink: vars.zoomLink,
        });
        break;
      }

      case "module_complete": {
        const err = hasRequiredFields(vars, [
          "firstName",
          "moduleTitle",
          "certificateUrl",
        ]);
        if (err) {
          return NextResponse.json({ success: false, error: err }, { status: 400 });
        }
        result = await sendModuleCompleteEmail(body.to, {
          firstName: vars.firstName,
          moduleTitle: vars.moduleTitle,
          certificateUrl: vars.certificateUrl,
        });
        break;
      }

      case "custom": {
        const err = hasRequiredFields(vars, ["subject", "html"]);
        if (err) {
          return NextResponse.json({ success: false, error: err }, { status: 400 });
        }
        result = await sendEmail({
          to: body.to,
          subject: vars.subject,
          html: vars.html,
          from: vars.from,
          replyTo: vars.replyTo,
        });
        break;
      }

      default: {
        return NextResponse.json(
          { success: false, error: "Template non supporte." },
          { status: 400 }
        );
      }
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur interne du serveur";
    console.error("[API/send-email] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
