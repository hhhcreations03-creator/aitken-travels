import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { subject, body, replyTo } = await req.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      return NextResponse.json({ error: "Email not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Aitken Travels Website" <${user}>`,
      to: "travelsaitken@gmail.com",
      replyTo: replyTo || undefined,
      subject,
      text: body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Email send error:", message);
    return NextResponse.json(
      { error: "Failed to send email", detail: message },
      { status: 500 }
    );
  }
}
