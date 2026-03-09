// ===========================================================================
// Email Templates for Neo-Coaching Platform
// These templates define the structure and content for transactional emails.
// Integration: Use with Resend, SendGrid, or any SMTP provider.
// ===========================================================================

export type EmailTemplateType =
  | "welcome"
  | "rdv_confirmation"
  | "rdv_reminder"
  | "module_complete"
  | "kpi_alert"
  | "password_reset"
  | "invoice"
  | "newsletter";

export interface EmailTemplate {
  type: EmailTemplateType;
  subject: string;
  description: string;
  variables: string[];
  active: boolean;
}

export const emailTemplates: EmailTemplate[] = [
  {
    type: "welcome",
    subject: "Bienvenue sur Neo-Coaching, {{firstName}} !",
    description:
      "Envoye automatiquement a la creation du compte. Contient les informations de connexion et un lien vers le premier module.",
    variables: ["firstName", "lastName", "email", "loginUrl", "dashboardUrl"],
    active: true,
  },
  {
    type: "rdv_confirmation",
    subject: "Votre rendez-vous du {{date}} est confirme",
    description:
      "Envoye apres la reservation d'un rendez-vous. Inclut la date, l'heure et le lien Zoom.",
    variables: ["firstName", "date", "time", "duration", "coachName", "zoomLink", "calendarLink"],
    active: true,
  },
  {
    type: "rdv_reminder",
    subject: "Rappel : votre coaching est dans {{hoursUntil}}h",
    description:
      "Envoye 24h et 1h avant le rendez-vous. Rappelle les details et le lien de connexion.",
    variables: ["firstName", "date", "time", "coachName", "zoomLink", "hoursUntil"],
    active: true,
  },
  {
    type: "module_complete",
    subject: "Felicitations {{firstName}} ! Module termine",
    description:
      "Envoye quand un module est marque comme termine. Inclut le score de satisfaction et le lien vers le certificat.",
    variables: ["firstName", "moduleTitle", "satisfactionScore", "certificateUrl", "nextModuleTitle"],
    active: true,
  },
  {
    type: "kpi_alert",
    subject: "Alerte : indicateur en baisse pour {{coacheeName}}",
    description:
      "Envoye au coach quand un KPI passe en zone rouge. Inclut les details du coachee et les indicateurs concernes.",
    variables: ["coacheeName", "kpiName", "kpiValue", "previousValue", "coacheeProfileUrl"],
    active: true,
  },
  {
    type: "password_reset",
    subject: "Reinitialisation de votre mot de passe Neo-Coaching",
    description:
      "Envoye sur demande de reinitialisation. Contient un lien temporaire valable 1h.",
    variables: ["firstName", "resetUrl", "expiresIn"],
    active: true,
  },
  {
    type: "invoice",
    subject: "Facture Neo-Coaching - {{period}}",
    description:
      "Envoye mensuellement aux clients entreprise. Inclut le detail de la facturation et le lien de telechargement.",
    variables: ["companyName", "period", "amount", "invoiceUrl", "dueDate"],
    active: false,
  },
  {
    type: "newsletter",
    subject: "Neo-Coaching - {{title}}",
    description:
      "Newsletter mensuelle avec les actualites, nouveaux articles du blog et conseils.",
    variables: ["firstName", "title", "previewText", "unsubscribeUrl"],
    active: true,
  },
];

// ---------------------------------------------------------------------------
// Email rendering helpers
// ---------------------------------------------------------------------------

export interface EmailData {
  to: string;
  template: EmailTemplateType;
  variables: Record<string, string>;
}

/**
 * Resolves template variables in a subject or body string.
 * Example: "Bonjour {{firstName}}" + { firstName: "Marie" } => "Bonjour Marie"
 */
export function resolveTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || "");
}

/**
 * Generates the base HTML wrapper for all emails.
 * Uses inline styles for maximum email client compatibility.
 */
export function generateEmailHtml(content: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neo-Coaching</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Inter',Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0A1628;padding:24px 32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#2D8C4E;border-radius:8px;padding:6px 10px;">
                    <span style="color:#ffffff;font-weight:bold;font-size:14px;">NC</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-weight:bold;font-size:18px;">Neo-Coaching</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; 2026 Neo-Coaching. Tous droits reserves.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">
                Cet email a ete envoye automatiquement. Ne pas repondre.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates a CTA button for emails (inline styles for compatibility).
 */
export function emailButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background-color:#D4A843;border-radius:8px;">
      <a href="${url}" target="_blank" style="display:inline-block;padding:12px 24px;color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;">
        ${text}
      </a>
    </td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------
// Pre-built email content generators
// ---------------------------------------------------------------------------

export function generateWelcomeEmail(vars: {
  firstName: string;
  dashboardUrl: string;
}): string {
  const content = `
    <h1 style="margin:0 0 16px;font-size:24px;color:#0A1628;">Bienvenue, ${vars.firstName} !</h1>
    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.6;">
      Votre compte Neo-Coaching a ete cree avec succes. Vous pouvez maintenant acceder a votre espace personnel
      et commencer votre parcours de developpement.
    </p>
    <p style="margin:0 0 8px;font-size:14px;color:#4b5563;line-height:1.6;">
      <strong>Prochaines etapes :</strong>
    </p>
    <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;color:#4b5563;line-height:1.8;">
      <li>Completez votre profil</li>
      <li>Decouvrez vos modules assignes</li>
      <li>Reservez votre premier rendez-vous coaching</li>
    </ul>
    ${emailButton("Acceder a mon espace", vars.dashboardUrl)}
    <p style="margin:0;font-size:13px;color:#9ca3af;">
      Si vous avez des questions, n'hesitez pas a contacter votre coach.
    </p>
  `;
  return generateEmailHtml(content, `Bienvenue sur Neo-Coaching, ${vars.firstName} !`);
}

export function generateRdvConfirmationEmail(vars: {
  firstName: string;
  date: string;
  time: string;
  duration: string;
  coachName: string;
  zoomLink: string;
}): string {
  const content = `
    <h1 style="margin:0 0 16px;font-size:24px;color:#0A1628;">Rendez-vous confirme</h1>
    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.6;">
      Bonjour ${vars.firstName}, votre rendez-vous de coaching a bien ete confirme.
    </p>
    <table role="presentation" width="100%" style="background-color:#f9fafb;border-radius:8px;padding:16px;margin:0 0 16px;">
      <tr>
        <td style="padding:8px 16px;font-size:14px;color:#6b7280;">Date</td>
        <td style="padding:8px 16px;font-size:14px;color:#0A1628;font-weight:600;">${vars.date}</td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-size:14px;color:#6b7280;">Heure</td>
        <td style="padding:8px 16px;font-size:14px;color:#0A1628;font-weight:600;">${vars.time}</td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-size:14px;color:#6b7280;">Duree</td>
        <td style="padding:8px 16px;font-size:14px;color:#0A1628;font-weight:600;">${vars.duration}</td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-size:14px;color:#6b7280;">Coach</td>
        <td style="padding:8px 16px;font-size:14px;color:#0A1628;font-weight:600;">${vars.coachName}</td>
      </tr>
    </table>
    ${emailButton("Rejoindre la session Zoom", vars.zoomLink)}
  `;
  return generateEmailHtml(content, `RDV confirme le ${vars.date} a ${vars.time}`);
}

export function generateModuleCompleteEmail(vars: {
  firstName: string;
  moduleTitle: string;
  certificateUrl: string;
}): string {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background-color:#2D8C4E;border-radius:50%;width:64px;height:64px;line-height:64px;text-align:center;">
        <span style="font-size:28px;">&#127942;</span>
      </div>
    </div>
    <h1 style="margin:0 0 16px;font-size:24px;color:#0A1628;text-align:center;">Felicitations, ${vars.firstName} !</h1>
    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.6;text-align:center;">
      Vous avez termine le module <strong>&laquo; ${vars.moduleTitle} &raquo;</strong> avec succes.
      Votre certificat de completion est maintenant disponible.
    </p>
    <div style="text-align:center;">
      ${emailButton("Telecharger mon certificat", vars.certificateUrl)}
    </div>
  `;
  return generateEmailHtml(content, `Module ${vars.moduleTitle} termine !`);
}

export function generateKpiAlertEmail(vars: {
  coacheeName: string;
  kpiName: string;
  kpiValue: string;
  coacheeProfileUrl: string;
}): string {
  const content = `
    <h1 style="margin:0 0 16px;font-size:24px;color:#0A1628;">Alerte indicateur</h1>
    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.6;">
      L'indicateur <strong>${vars.kpiName}</strong> de <strong>${vars.coacheeName}</strong>
      est passe a <span style="color:#E74C3C;font-weight:600;">${vars.kpiValue}/10</span>.
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.6;">
      Une intervention rapide est recommandee pour eviter un risque de decrochage.
    </p>
    ${emailButton("Voir le profil", vars.coacheeProfileUrl)}
  `;
  return generateEmailHtml(content, `Alerte KPI pour ${vars.coacheeName}`);
}
