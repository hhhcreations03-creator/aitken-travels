import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SITE } from "@/lib/site";
import { bookingConfigured, emailConfigured } from "@/lib/booking/config";
import { rateLimit } from "@/lib/booking/ratelimit";
import { addMessage, createThread, type ThreadKind } from "@/lib/inbox/threads";
import { notifyHotel, sendToGuest } from "@/lib/inbox/mailer";

export const dynamic = "force-dynamic";

/**
 * Website enquiries (contact, group, surf retreat and availability forms).
 *
 * With a database, every enquiry is saved to the admin inbox first, so it is
 * never lost even if email fails. The guest then gets an acknowledgement
 * carrying the enquiry reference (their reply joins the same conversation),
 * and the hotel gets a notification it can answer straight from Gmail.
 *
 * Without a database the route can only email the hotel; when email isn't set
 * up either, it answers 503 { configured: false } so the form offers WhatsApp
 * or email instead of pretending the message was delivered.
 */

const KINDS = ["contact", "group", "surf", "availability"] as const;

const schema = z.object({
  kind: z.enum(KINDS).default("contact"),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(10000),
  name: z.string().trim().max(120).optional().default(""),
  replyTo: z.string().trim().max(200).optional().default(""),
  phone: z.string().trim().max(60).optional().default(""),
  fields: z.array(z.tuple([z.string().max(80), z.string().max(4000)])).max(30).optional(),
  website: z.string().optional(),
});

const ACK_SUBJECT: Record<ThreadKind, string> = {
  contact: "We've received your message",
  group: "We've received your group enquiry",
  surf: "We've received your surf retreat enquiry",
  availability: "We've received your availability enquiry",
  booking: "We've received your request",
  email: "We've received your message",
};

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Missing or invalid details." }, { status: 400 });
  const data = parsed.data;

  // Honeypot: real visitors never fill this field.
  if (data.website) return NextResponse.json({ ok: true });

  const email = data.replyTo.toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid email address." }, { status: 400 });

  if (!bookingConfigured()) return emailOnly(data.subject, data.body, email);

  try {
    if (!(await rateLimit("enquiry", 8, 60))) return NextResponse.json({ error: "Too many messages from this connection. Please message us on WhatsApp." }, { status: 429 });

    const fields = (data.fields ?? []).filter(([, v]) => v.trim() !== "");
    const thread = await createThread({
      kind: data.kind,
      subject: data.subject,
      guestName: data.name || null,
      guestEmail: email || null,
      guestPhone: data.phone || null,
      details: fields.length ? fields : null,
    });
    await addMessage({
      threadId: thread.id,
      direction: "in",
      channel: "web",
      author: "guest",
      fromName: data.name || null,
      fromAddr: email || null,
      subject: data.subject,
      body: data.body,
      delivery: "received",
    });

    const first = data.name.split(" ")[0] || "there";
    const ack = `Dear ${first},

Thank you for getting in touch with The Lavish Haven. We've received your enquiry (reference ${thread.ref}) and a member of our team will reply personally, usually within 24 hours. Nothing is reserved until we confirm it with you.

If you'd like to add anything, just reply to this email.

Your message:
${data.body}

The Lavish Haven
WhatsApp ${SITE.whatsappDisplay}
${SITE.address.street}, ${SITE.address.locality} ${SITE.address.postalCode}, ${SITE.address.country}`;

    const hotel = `${data.body}

Reply to this email to answer the guest directly; the reply is filed under ${thread.ref} in the admin inbox.
${SITE.url}/admin/inbox/${thread.id}`;

    await Promise.all([
      email ? sendToGuest({ threadId: thread.id, subject: ACK_SUBJECT[data.kind], text: ack, automatic: true }) : null,
      notifyHotel(`${data.subject} [${thread.ref}]`, hotel, email || null),
    ]);
    return NextResponse.json({ ok: true, ref: thread.ref });
  } catch (e) {
    console.error("Enquiry could not be saved:", e instanceof Error ? e.message : e);
    // The database failed; still try to get the message to the hotel by email.
    return emailOnly(data.subject, data.body, email);
  }
}

async function emailOnly(subject: string, body: string, replyTo: string) {
  if (!emailConfigured()) return NextResponse.json({ configured: false }, { status: 503 });
  const sent = await notifyHotel(subject, body, replyTo || null);
  return sent ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Email could not be sent" }, { status: 502 });
}
