import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { subject, body, replyTo } = await req.json();

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Aitken Travels Website" <${process.env.SMTP_USER}>`,
      to: "travelsaitken@gmail.com",
      replyTo: replyTo || undefined,
      subject,
      text: body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
