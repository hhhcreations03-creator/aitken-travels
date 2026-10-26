import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Delivers website enquiries by email.
 *
 * Requires SMTP_USER and SMTP_PASS (and optionally SMTP_HOST, SMTP_PORT,
 * ENQUIRY_TO) to be set in the hosting environment. When they are missing the
 * route answers 503 with { configured: false } so the client can offer a
 * WhatsApp or email handoff instead of pretending the message was delivered.
 */
export async function POST(req: NextRequest) {
  let data: { subject?: string; body?: string; replyTo?: string; name?: string; website?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this field.
  if (data.website) return NextResponse.json({ ok: true });

  const subject = (data.subject ?? "").toString().slice(0, 200).trim();
  const body = (data.body ?? "").toString().slice(0, 10000).trim();
  const replyTo = (data.replyTo ?? "").toString().slice(0, 200).trim();
  if (!subject || !body) {
    return NextResponse.json({ error: "Missing subject or body" }, { status: 400 });
  }
  if (replyTo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) {
    return NextResponse.json({ error: "Invalid reply-to address" }, { status: 400 });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const to = process.env.ENQUIRY_TO || "hello@thelavishhaven.com";

  try {
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    await transporter.sendMail({
      from: `"The Lavish Haven website" <${user}>`,
      to,
      replyTo: replyTo || undefined,
      subject,
      text: body,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Enquiry email failed:", message);
    return NextResponse.json({ error: "Email could not be sent" }, { status: 502 });
  }
}
