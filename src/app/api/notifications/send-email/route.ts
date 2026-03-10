import { NextRequest, NextResponse } from "next/server";

// Email notification types
type EmailType =
  | "appointment_reminder"
  | "module_completed"
  | "questionnaire_reminder"
  | "parcours_assigned"
  | "certificate_ready"
  | "kpi_alert";

interface SendEmailRequest {
  type: EmailType;
  to: string;
  recipientName: string;
  data: Record<string, string | number>;
}

// Email templates
function getEmailContent(type: EmailType, recipientName: string, data: Record<string, string | number>) {
  const templates: Record<EmailType, { subject: string; html: string }> = {
    appointment_reminder: {
      subject: `Rappel : Seance de coaching le ${data.date}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #0A1628; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0A1628; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight { background: #D4A843; color: white; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; background: #D4A843; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>NEO-FORMATIONS</h1>
            </div>
            <div class="content">
              <p>Bonjour ${recipientName},</p>
              <p>Ceci est un rappel pour votre seance de coaching programmee.</p>
              <div class="highlight">
                <strong>${data.date} a ${data.time}</strong><br/>
                ${data.topic || "Seance de coaching"}
              </div>
              ${data.zoomLink ? `<p style="text-align: center;"><a href="${data.zoomLink}" class="button">Rejoindre la reunion Zoom</a></p>` : ""}
              <p>A bientot,<br/><strong>Jean-Claude YEKPE</strong><br/>Coach certifie</p>
            </div>
            <div class="footer">
              <p>Neo-Formations - Coaching & Developpement Personnel</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    module_completed: {
      subject: `Felicitations ! Vous avez termine le module "${data.moduleTitle}"`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #0A1628; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A1628, #1B2A4A); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .achievement { background: #D4A843; color: white; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .achievement h2 { margin: 0 0 10px; font-size: 20px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat { text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #2D8C4E; }
            .button { display: inline-block; background: #0A1628; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Felicitations !</h1>
            </div>
            <div class="content">
              <p>Bonjour ${recipientName},</p>
              <div class="achievement">
                <h2>Module Complete</h2>
                <p style="margin: 0;">${data.moduleTitle}</p>
              </div>
              <p>Vous avez fait un excellent travail en completant ce module. Votre certificat est maintenant disponible sur votre tableau de bord.</p>
              <p style="text-align: center;"><a href="${data.dashboardUrl || "#"}" class="button">Voir mon certificat</a></p>
              <p>Continuez sur cette lancee !<br/><strong>Jean-Claude YEKPE</strong></p>
            </div>
            <div class="footer">
              <p>Neo-Formations - Coaching & Developpement Personnel</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    questionnaire_reminder: {
      subject: `Rappel : Questionnaire "${data.questionnaireType}" a completer`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #0A1628; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #003B6F; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; border: 1px solid #E5E7EB; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #003B6F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Questionnaire Qualiopi</h1>
            </div>
            <div class="content">
              <p>Bonjour ${recipientName},</p>
              <p>Un questionnaire ${data.questionnaireType} est en attente pour le module :</p>
              <div class="info-box">
                <strong>${data.moduleTitle}</strong>
                <p style="color: #9CA3AF; margin-bottom: 0;">Ce questionnaire nous aide a ameliorer la qualite de nos formations (conformite Qualiopi).</p>
              </div>
              <p style="text-align: center;"><a href="${data.questionnaireUrl || "#"}" class="button">Completer le questionnaire</a></p>
              <p>Merci de votre participation,<br/><strong>L'equipe Neo-Formations</strong></p>
            </div>
            <div class="footer">
              <p>Neo-Formations - Organisme certifie Qualiopi</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    parcours_assigned: {
      subject: `Nouveau parcours : "${data.parcoursTitle}" vous a ete assigne`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #0A1628; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0A1628; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .parcours-card { background: white; border: 2px solid #D4A843; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .parcours-title { font-size: 18px; font-weight: bold; color: #0A1628; margin-bottom: 10px; }
            .meta { color: #9CA3AF; font-size: 14px; }
            .button { display: inline-block; background: #D4A843; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nouveau Parcours Assigne</h1>
            </div>
            <div class="content">
              <p>Bonjour ${recipientName},</p>
              <p>Un nouveau parcours de formation vous a ete assigne :</p>
              <div class="parcours-card">
                <div class="parcours-title">${data.parcoursTitle}</div>
                <p class="meta">📅 Du ${data.startDate} au ${data.endDate}</p>
                <p class="meta">📚 ${data.moduleCount} modules a completer</p>
              </div>
              <p style="text-align: center;"><a href="${data.parcoursUrl || "#"}" class="button">Commencer le parcours</a></p>
              <p>Bon courage !<br/><strong>Jean-Claude YEKPE</strong></p>
            </div>
            <div class="footer">
              <p>Neo-Formations - Coaching & Developpement Personnel</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    certificate_ready: {
      subject: `Votre certificat "${data.moduleTitle}" est pret !`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #0A1628; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4A843, #E8D5A0); color: #0A1628; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .certificate-preview { background: white; border: 3px solid #D4A843; padding: 30px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; background: #0A1628; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 Certificat Disponible</h1>
            </div>
            <div class="content">
              <p>Bonjour ${recipientName},</p>
              <div class="certificate-preview">
                <p style="color: #9CA3AF; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Certificat de completion</p>
                <h2 style="color: #D4A843; margin: 10px 0;">${data.moduleTitle}</h2>
                <p style="color: #9CA3AF; margin: 0;">Delivre le ${data.completionDate}</p>
              </div>
              <p style="text-align: center;"><a href="${data.downloadUrl || "#"}" class="button">Telecharger mon certificat</a></p>
              <p>Bravo pour ce succes !<br/><strong>Jean-Claude YEKPE</strong></p>
            </div>
            <div class="footer">
              <p>Neo-Formations - Coaching & Developpement Personnel</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    kpi_alert: {
      subject: `Alerte KPI : ${data.kpiType} necessitant attention`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #0A1628; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F39C12; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert-box { background: #FEF3C7; border: 1px solid #F39C12; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .kpi-value { font-size: 36px; font-weight: bold; color: #F39C12; text-align: center; }
            .button { display: inline-block; background: #0A1628; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Alerte KPI</h1>
            </div>
            <div class="content">
              <p>Bonjour ${recipientName},</p>
              <p>Un indicateur KPI necessite votre attention :</p>
              <div class="alert-box">
                <p style="text-align: center; margin: 0; color: #92400E;">${data.kpiType}</p>
                <div class="kpi-value">${data.value}/10</div>
                <p style="text-align: center; margin: 0; color: #92400E;">Objectif : ${data.target}/10</p>
              </div>
              <p>Des actions peuvent etre mises en place pour ameliorer cet indicateur. Contactez votre coach pour en discuter.</p>
              <p style="text-align: center;"><a href="${data.dashboardUrl || "#"}" class="button">Voir mon tableau de bord</a></p>
            </div>
            <div class="footer">
              <p>Neo-Formations - Coaching & Developpement Personnel</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
  };

  return templates[type];
}

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailRequest = await request.json();
    const { type, to, recipientName, data } = body;

    // Validate required fields
    if (!type || !to || !recipientName) {
      return NextResponse.json(
        { error: "Missing required fields: type, to, recipientName" },
        { status: 400 }
      );
    }

    // Get email content
    const emailContent = getEmailContent(type, recipientName, data);

    // If Resend API key is configured, send real email
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Neo-Formations <notifications@neo-formations.fr>",
          to: [to],
          subject: emailContent.subject,
          html: emailContent.html,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Resend API error:", error);
        return NextResponse.json(
          { error: "Failed to send email", details: error },
          { status: 500 }
        );
      }

      const result = await response.json();
      return NextResponse.json({
        success: true,
        messageId: result.id,
        message: "Email sent successfully",
      });
    }

    // Mock mode - log the email instead
    console.log("=== Mock Email Sent ===");
    console.log("To:", to);
    console.log("Subject:", emailContent.subject);
    console.log("Type:", type);
    console.log("=======================");

    return NextResponse.json({
      success: true,
      mock: true,
      message: "Email logged (Resend API key not configured)",
      preview: {
        to,
        subject: emailContent.subject,
        type,
      },
    });
  } catch (error) {
    console.error("Error in send-email API:", error);
    return NextResponse.json(
      { error: "Failed to process email request" },
      { status: 500 }
    );
  }
}
