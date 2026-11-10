import "server-only";
import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";
import { emailConfigured } from "@/lib/booking/config";
import { REF_PATTERN, addMessage, getThread, newMessageId, replyHeaders, type Message } from "./threads";

/**
 * Outgoing email. Every email to a guest goes through sendToGuest so that it
 * is stored in the guest's conversation, carries the conversation reference in
 * its subject, and threads in the guest's mail app; their reply then finds its
 * way back to the same conversation when the mailbox is synced.
 */

export function transport() {
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/** Where the hotel reads its mail. Guests' replies go here. */
export const hotelInbox = () => process.env.ENQUIRY_TO || SITE.email;

const fromHeader = (label: string = SITE.name) => `"${label}" <${process.env.SMTP_USER}>`;

/** Adds the reference to a subject once, e.g. "Your stay is confirmed [LH-7K3P9Q]". */
export function withRef(subject: string, ref: string): string {
  return REF_PATTERN.test(subject) ? subject : `${subject} [${ref}]`;
}

export interface GuestEmail {
  threadId: string;
  subject: string;
  text: string;
  /** Admin email for a reply written by the team; omit for automatic emails. */
  author?: string;
  automatic?: boolean;
  /** What to keep in the conversation when the email holds a secret, such as the guest's private manage link. */
  storedText?: string;
}

export type SendOutcome = { sent: true; message: Message | null } | { sent: false; reason: "not_configured" | "no_address" | "failed"; error?: string; message: Message | null };

export async function sendToGuest(e: GuestEmail): Promise<SendOutcome> {
  const thread = await getThread(e.threadId);
  if (!thread) return { sent: false, reason: "failed", error: "Conversation not found", message: null };
  const to = thread.guest_email;
  const subject = withRef(e.subject, thread.ref);
  const base = {
    threadId: thread.id,
    direction: "out" as const,
    channel: "email" as const,
    author: e.author ?? "system",
    fromName: SITE.name,
    fromAddr: process.env.SMTP_USER || hotelInbox(),
    toAddr: to,
    subject,
    body: e.storedText ?? e.text,
    automatic: e.automatic ?? !e.author,
  };

  if (!to) {
    const message = await addMessage({ ...base, delivery: "not_sent", error: "The guest has no email address" });
    return { sent: false, reason: "no_address", message };
  }
  if (!emailConfigured()) {
    const message = await addMessage({ ...base, delivery: "not_sent", error: "Email sending isn't set up" });
    return { sent: false, reason: "not_configured", message };
  }

  const messageId = newMessageId();
  const { inReplyTo, references } = await replyHeaders(thread.id);
  try {
    await transport().sendMail({
      from: fromHeader(),
      to,
      replyTo: hotelInbox(),
      subject,
      text: e.text,
      messageId,
      inReplyTo,
      references,
    });
    const message = await addMessage({ ...base, messageId, inReplyTo: inReplyTo ?? null, delivery: "sent" });
    return { sent: true, message };
  } catch (err) {
    const error = err instanceof Error ? err.message : "error";
    const message = await addMessage({ ...base, delivery: "failed", error });
    return { sent: false, reason: "failed", error, message };
  }
}

/**
 * A notification to the hotel's own inbox. Not stored in the conversation (it
 * duplicates what the guest sent), but it carries the reference in its subject
 * and the guest as Reply-To, so answering it from Gmail reaches the guest and
 * the mailbox sync files that answer under the right conversation.
 */
export async function notifyHotel(subject: string, text: string, replyTo?: string | null): Promise<boolean> {
  if (!emailConfigured()) return false;
  try {
    await transport().sendMail({
      from: fromHeader(`${SITE.name} website`),
      to: hotelInbox(),
      replyTo: replyTo || undefined,
      subject,
      text,
      messageId: newMessageId(),
    });
    return true;
  } catch (err) {
    console.error("Hotel notification failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
