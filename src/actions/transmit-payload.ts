"use server";

import nodemailer from "nodemailer";
import { getTranslations } from "next-intl/server";

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function transmitPayloadAction(formData: FormData) {
  const targetEntity = formData.get("identifier") as string;
  const returnVector = formData.get("transmission") as string;
  const payloadData = formData.get("payload") as string;

  if (!targetEntity || !returnVector || !payloadData) {
    return { error: "ERR_MISSING_PARAMETERS" };
  }

  const t = await getTranslations("EmailReceipt");

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailPass) {
    console.error("CRITICAL: EMAIL_USER or EMAIL_APP_PASSWORD is not defined in environment variables.");
    return { error: "ERR_SMTP_OFFLINE" };
  }

  // Configure Nodemailer to use Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const companyEmail = process.env.COMPANY_EMAIL || emailUser;

  try {
    // 1. Notify the Company (You)
    await transporter.sendMail({
      from: `"BBGeorgiaTech Website" <${emailUser}>`,
      to: companyEmail,
      replyTo: returnVector,
      subject: `New Project Inquiry: ${targetEntity}`,
      text: `You have received a new project inquiry from the website.\n\nName / Company: ${targetEntity}\nEmail Address: ${returnVector}\n\nProject Details:\n${payloadData}`,
    });

    const safeTargetEntity = escapeHtml(targetEntity);
    const safeReturnVector = escapeHtml(returnVector);
    // Create an HTML-safe version of the payload (replace newlines with <br>)
    const safePayloadHtml = escapeHtml(payloadData).replace(/\n/g, "<br>");

    // 2. Auto-Reply to the User (HTML Template)
    const htmlEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Courier New', Courier, monospace; background-color: #0A0A0A; color: #FFFFFF; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0A0A0A; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #111111; border: 1px solid #333333;" cellspacing="0" cellpadding="0">
          
          <!-- Brutalist Header Bar -->
          <tr>
            <td style="padding: 20px; border-bottom: 1px solid #333333; background-color: #151515;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="60">
                    <div style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#EF4444; margin-right:4px;"></div>
                    <div style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#F59E0B; margin-right:4px;"></div>
                    <div style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#10B981;"></div>
                  </td>
                  <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #10B981; letter-spacing: 2px;">
                    SECURE_TERMINAL_V1.0
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content -->
          <tr>
            <td style="padding: 40px 30px; font-family: 'Courier New', Courier, monospace;">
              <h1 style="font-size: 20px; font-weight: normal; margin-top: 0; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; color: #FFFFFF;">${t("title")}</h1>
              <p style="font-size: 14px; line-height: 1.6; color: #A3A3A3; margin-top: 0; margin-bottom: 30px;">
                ${t("greeting")} <strong style="color: #FFFFFF;">${safeTargetEntity}</strong>,<br><br>
                ${t("p1")}
              </p>

              <!-- Payload Receipt Block -->
              <div style="background-color: #000000; border-left: 2px solid #10B981; padding: 20px; margin-bottom: 30px;">
                <p style="font-size: 10px; text-transform: uppercase; color: #666666; margin: 0 0 15px 0; letter-spacing: 1px;">${t("payloadRecord")}</p>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #FFFFFF; font-size: 12px; text-transform: uppercase; display:block; margin-bottom:5px;">${t("entity")}</strong>
                  <span style="color: #10B981; font-size: 14px;">${safeTargetEntity}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #FFFFFF; font-size: 12px; text-transform: uppercase; display:block; margin-bottom:5px;">${t("returnVector")}</strong>
                  <span style="color: #10B981; font-size: 14px;">${safeReturnVector}</span>
                </div>
                
                <div style="margin-bottom: 0;">
                  <strong style="color: #FFFFFF; font-size: 12px; text-transform: uppercase; display:block; margin-bottom:5px;">${t("requirements")}</strong>
                  <span style="color: #A3A3A3; font-size: 14px; line-height: 1.6;">${safePayloadHtml}</span>
                </div>
              </div>

              <p style="font-size: 14px; line-height: 1.6; color: #A3A3A3; margin: 0;">
                ${t("regards1")}<br>
                <strong style="color: #FFFFFF;">${t("regards2")}</strong>
              </p>
            </td>
          </tr>

          <!-- Brutalist Footer -->
          <tr>
            <td style="padding: 20px 30px; border-top: 1px solid #333333; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #666666; text-align: center;">
              &copy; ${new Date().getFullYear()} ${t("rightsReserved")}<br><br>
              <a href="https://github.com/GBaga" style="color: #10B981; text-decoration: none;">GitHub</a> &nbsp;|&nbsp; 
              <a href="https://www.linkedin.com/in/goga-bagauri" style="color: #10B981; text-decoration: none;">LinkedIn</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"BBGeorgiaTech" <${emailUser}>`,
      to: returnVector,
      subject: t("subject"),
      text: `${t("greeting")} ${targetEntity},\n\n${t("p1")}\n\n${t("regards1")}\n${t("regards2")}`,
      html: htmlEmailTemplate,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Nodemailer Exception:", error);
    return { error: error.message || "ERR_TRANSMISSION_FAILED" };
  }
}
