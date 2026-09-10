"use server";

import nodemailer from "nodemailer";
import { z } from "zod";
import { headers } from "next/headers";

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const payloadSchema = z.object({
  identifier: z.string().trim().min(1).max(100),
  transmission: z.string().trim().min(1).max(255).email(),
  payload: z.string().trim().min(1).max(5000),
  // Honeypot: real visitors never see or fill this field. Any value means a bot.
  website: z.string().max(0).optional().default(""),
});

// Best-effort per-IP throttle. Resets whenever the serverless instance
// recycles, so it is a speed bump for casual abuse, not a durable limiter —
// pair with a persistent store (Upstash, etc.) if volume grows.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 4;
const submissionLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function buildTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_APP_PASSWORD;
  if (!emailUser || !emailPass) return null;

  // Set EMAIL_HOST/EMAIL_PORT to move off Gmail (e.g. to Resend or Postmark
  // SMTP) without touching this code; falls back to Gmail's service preset.
  const host = process.env.EMAIL_HOST;
  if (host) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: { user: emailUser, pass: emailPass },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: emailUser, pass: emailPass },
  });
}

export async function transmitPayloadAction(formData: FormData) {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return { error: "ERR_RATE_LIMITED" };
  }

  const parsed = payloadSchema.safeParse({
    identifier: formData.get("identifier"),
    transmission: formData.get("transmission"),
    payload: formData.get("payload"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { error: "ERR_VALIDATION" };
  }

  const { identifier: targetEntity, transmission: returnVector, payload: payloadData, website: honeypot } = parsed.data;

  // A filled honeypot means a bot filled the form. Report success without
  // sending anything, so scripted submitters get no signal to adapt to.
  if (honeypot) {
    return { success: true };
  }

  const transporter = buildTransporter();
  if (!transporter) {
    console.error("CRITICAL: EMAIL_USER or EMAIL_APP_PASSWORD is not defined in environment variables.");
    return { error: "ERR_SMTP_OFFLINE" };
  }

  const emailUser = process.env.EMAIL_USER as string;
  const companyEmail = process.env.COMPANY_EMAIL || emailUser;
  const safeTargetEntity = escapeHtml(targetEntity);
  const safeReturnVector = escapeHtml(returnVector);
  const safePayloadHtml = escapeHtml(payloadData).replace(/\n/g, "<br>");

  try {
    // Notify the company only. We deliberately do not send an auto-reply to
    // the submitter's address — that would let anyone use this form to
    // relay branded email to a third party who never contacted us.
    await transporter.sendMail({
      from: `"BBGeorgiaTech Website" <${emailUser}>`,
      to: companyEmail,
      replyTo: returnVector,
      subject: `New Project Inquiry: ${targetEntity}`,
      text: `You have received a new project inquiry from the website.\n\nName / Company: ${targetEntity}\nEmail Address: ${returnVector}\n\nProject Details:\n${payloadData}`,
      html: `<p>You have received a new project inquiry from the website.</p>
        <p><strong>Name / Company:</strong> ${safeTargetEntity}<br>
        <strong>Email Address:</strong> ${safeReturnVector}</p>
        <p><strong>Project Details:</strong><br>${safePayloadHtml}</p>`,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error(
      `[transmit-payload] send failed at ${new Date().toISOString()} from ip=${ip}:`,
      error
    );
    return { error: "ERR_TRANSMISSION_FAILED" };
  }
}
