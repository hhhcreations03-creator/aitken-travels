import "server-only";
import { ImapFlow } from "imapflow";
import { simpleParser, type AddressObject, type ParsedMail } from "mailparser";
import { db } from "@/lib/booking/db";
import { ensureSchema } from "@/lib/booking/schema";
import { hotelInbox } from "./mailer";
import {
  REF_PATTERN,
  addMessage,
  createThread,
  findRecentThreadByEmail,
  findThreadByMessageIds,
  getThreadByRef,
  updateGuest,
} from "./threads";

/**
 * Brings the hotel mailbox into the admin inbox.
 *
 * Reads the Gmail (Google Workspace) mailbox over IMAP with an app password:
 *   - Inbox: every email from a guest. It joins the conversation it answers
 *     (matched by email headers, then by the LH-/EQ- reference in the subject,
 *     then by the guest's address within 60 days); otherwise it starts a new one.
 *   - Sent: replies the team writes in Gmail, so a conversation shows both
 *     sides even when someone answers from their phone. Sent mail only joins
 *     an existing conversation; it never starts one.
 *
 * Newsletters, auto-replies, bounces and the hotel's own notifications are
 * skipped. Each email is stored once (by Message-ID), and progress is kept per
 * folder by IMAP UID, so each sync only reads what's new.
 *
 * Settings, all server-side: IMAP_USER and IMAP_PASS (default to SMTP_USER and
 * SMTP_PASS, since one Gmail app password does both), IMAP_HOST (default
 * imap.gmail.com), MAIL_SYNC_DAYS (how far back the first sync looks, default 30).
 */

const MAX_PER_FOLDER = 150;
const TIME_BUDGET_MS = 40_000;
/** Open admin pages ask every 30 seconds; the server reads Gmail at most this often. */
const MIN_INTERVAL_MS = 20_000;

export function mailboxConfigured(): boolean {
  return Boolean((process.env.IMAP_USER || process.env.SMTP_USER) && (process.env.IMAP_PASS || process.env.SMTP_PASS));
}

function ourAddresses(): Set<string> {
  return new Set(
    [process.env.IMAP_USER, process.env.SMTP_USER, hotelInbox()]
      .filter((x): x is string => Boolean(x))
      .map((x) => x.trim().toLowerCase())
  );
}

async function getSetting(key: string): Promise<string | null> {
  const d = await db();
  return (await d.query<{ value: string }>(`SELECT value FROM settings WHERE key = $1`, [key]))[0]?.value ?? null;
}

async function setSetting(key: string, value: string) {
  const d = await db();
  await d.query(`INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, [key, value]);
}

export interface MailboxStatus {
  configured: boolean;
  lastSyncAt: string | null;
  lastError: string | null;
  lastImported: number | null;
}

export async function mailboxStatus(): Promise<MailboxStatus> {
  await ensureSchema();
  const [lastSyncAt, lastError, lastImported] = await Promise.all([getSetting("mail.lastSyncAt"), getSetting("mail.lastError"), getSetting("mail.lastImported")]);
  return { configured: mailboxConfigured(), lastSyncAt, lastError: lastError || null, lastImported: lastImported ? Number(lastImported) : null };
}

/**
 * Changes whenever a conversation gets a new message or changes state, from
 * email, the website or the team, so open admin pages know to refresh.
 */
export async function inboxStamp(): Promise<string> {
  await ensureSchema();
  const d = await db();
  const [r] = await d.query<{ stamp: string }>(
    `SELECT count(*)::text || ':' || COALESCE(max(last_message_at)::text, '') || ':' ||
            count(*) FILTER (WHERE needs_reply AND status = 'open')::text || ':' || count(*) FILTER (WHERE unread)::text AS stamp
       FROM threads`
  );
  return r?.stamp ?? "";
}

/** Takes a short lease so two syncs (two admin tabs, or the daily job) don't read the same mail at once. */
async function takeLease(ms: number): Promise<boolean> {
  const d = await db();
  const now = new Date();
  const until = new Date(now.getTime() + ms).toISOString();
  const rows = await d.query(
    `INSERT INTO settings (key, value) VALUES ('mail.leaseUntil', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value WHERE settings.value < $2
     RETURNING key`,
    [until, now.toISOString()]
  );
  return rows.length > 0;
}

async function releaseLease() {
  await setSetting("mail.leaseUntil", new Date(0).toISOString());
}

export type SyncResult =
  | { ok: true; imported: number; skipped?: "recent" | "busy" | "not_configured" }
  | { ok: false; error: string };

/** Reads new mail. Without `force`, does nothing if the mailbox was read in the last 20 seconds. */
export async function syncMailbox({ force = false }: { force?: boolean } = {}): Promise<SyncResult> {
  if (!mailboxConfigured()) return { ok: true, imported: 0, skipped: "not_configured" };
  await ensureSchema();
  if (!force) {
    const last = await getSetting("mail.lastSyncAt");
    if (last && Date.now() - Date.parse(last) < MIN_INTERVAL_MS) return { ok: true, imported: 0, skipped: "recent" };
  }
  if (!(await takeLease(TIME_BUDGET_MS + 20_000))) return { ok: true, imported: 0, skipped: "busy" };

  const started = Date.now();
  const client = new ImapFlow({
    host: process.env.IMAP_HOST || "imap.gmail.com",
    port: Number(process.env.IMAP_PORT || 993),
    secure: true,
    auth: { user: (process.env.IMAP_USER || process.env.SMTP_USER)!, pass: (process.env.IMAP_PASS || process.env.SMTP_PASS)! },
    logger: false,
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
  });
  client.on("error", () => {
    /* surfaced through the awaited calls below */
  });

  let imported = 0;
  try {
    await client.connect();
    const folders = await client.list();
    const sent = folders.find((f) => f.specialUse === "\\Sent")?.path ?? "[Gmail]/Sent Mail";
    imported += await syncFolder(client, "INBOX", "inbox", started);
    if (Date.now() - started < TIME_BUDGET_MS) imported += await syncFolder(client, sent, "sent", started);
    await Promise.all([setSetting("mail.lastSyncAt", new Date().toISOString()), setSetting("mail.lastError", ""), setSetting("mail.lastImported", String(imported))]);
    return { ok: true, imported };
  } catch (e) {
    const error = describe(e);
    await Promise.all([setSetting("mail.lastSyncAt", new Date().toISOString()), setSetting("mail.lastError", error)]);
    return { ok: false, error };
  } finally {
    await client.logout().catch(() => client.close());
    await releaseLease();
  }
}

function describe(e: unknown): string {
  const err = e as { authenticationFailed?: boolean; responseText?: string; code?: string; message?: string };
  if (err?.authenticationFailed || /AUTHENTICATIONFAILED|Invalid credentials/i.test(err?.responseText ?? err?.message ?? ""))
    return "Gmail refused the login. Check that IMAP is on for the mailbox and that the app password is current.";
  if (err?.code === "CONNECT_TIMEOUT" || err?.code === "ETIMEDOUT") return "Couldn't reach the mail server in time. It will try again on the next sync.";
  return (err?.responseText || err?.message || "Mailbox sync failed").slice(0, 300);
}

async function syncFolder(client: ImapFlow, path: string, role: "inbox" | "sent", started: number): Promise<number> {
  const lock = await client.getMailboxLock(path);
  let imported = 0;
  try {
    const mb = client.mailbox;
    if (!mb) return 0;
    const validity = String(mb.uidValidity);
    const key = `mail.${role}`;
    const storedValidity = await getSetting(`${key}.uidValidity`);
    let lastUid = storedValidity === validity ? Number((await getSetting(`${key}.lastUid`)) || 0) : 0;

    let uids: number[];
    if (lastUid > 0) {
      uids = ((await client.search({ uid: `${lastUid + 1}:*` }, { uid: true })) || []).filter((u) => u > lastUid);
      uids.sort((a, b) => a - b);
      uids = uids.slice(0, MAX_PER_FOLDER); // oldest first; the rest come next time
    } else {
      const days = Math.min(365, Math.max(1, Number(process.env.MAIL_SYNC_DAYS || 30)));
      const since = new Date(Date.now() - days * 86_400_000);
      uids = ((await client.search({ since }, { uid: true })) || []).sort((a, b) => a - b).slice(-MAX_PER_FOLDER);
      if (!uids.length) lastUid = Math.max(0, Number(mb.uidNext ?? 1) - 1);
    }

    for (const uid of uids) {
      if (Date.now() - started > TIME_BUDGET_MS) break;
      const msg = await client.fetchOne(String(uid), { source: true }, { uid: true });
      if (msg && msg.source) {
        const parsed = await simpleParser(msg.source, { skipImageLinks: true, maxHtmlLengthToParse: 500_000 });
        if (await fileEmail(parsed, role)) imported++;
      }
      lastUid = uid;
    }
    await Promise.all([setSetting(`${key}.uidValidity`, validity), setSetting(`${key}.lastUid`, String(lastUid))]);
  } finally {
    lock.release();
  }
  return imported;
}

const addressList = (a: AddressObject | AddressObject[] | undefined) =>
  (Array.isArray(a) ? a : a ? [a] : []).flatMap((x) => x.value).filter((v) => v.address).map((v) => ({ name: v.name || null, address: v.address!.toLowerCase() }));

const angle = (id: string) => (id.startsWith("<") ? id : `<${id}>`);

function isAutomated(p: ParsedMail, from: string): boolean {
  const h = p.headers;
  const auto = String(h.get("auto-submitted") ?? "no").toLowerCase();
  const precedence = String(h.get("precedence") ?? "").toLowerCase();
  return (
    auto !== "no" ||
    ["bulk", "list", "junk", "auto_reply"].includes(precedence) ||
    h.has("list") || // mailparser gathers List-Id, List-Unsubscribe and friends under "list"
    h.has("list-unsubscribe") ||
    h.has("list-id") ||
    h.has("x-autoreply") ||
    h.has("x-autorespond") ||
    /^(mailer-daemon|postmaster|no-?reply|do-?not-?reply|notifications?)@/i.test(from)
  );
}

/** Keeps what the person wrote and drops the quoted history underneath. */
export function stripQuoted(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const markers = [
    /^On .{6,200}wrote:\s*$/,
    /^On .{6,200}$/, // "On Mon, 3 Nov 2026 at 10:00, Name <x@y>" with "wrote:" on the next line
    /^-{2,}\s*Original Message\s*-{2,}/i,
    /^_{8,}\s*$/,
    /^From: .+$/,
    /^Sent from my (iPhone|iPad|Android|phone)/i,
  ];
  let cut = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (markers[0].test(l) || markers[2].test(l) || markers[3].test(l) || markers[5].test(l)) { cut = i; break; }
    if (markers[1].test(l) && /wrote:\s*$/.test(lines[i + 1]?.trim() ?? "")) { cut = i; break; }
    if (markers[4].test(l) && /^(Sent|Date|To|Subject):/i.test(lines[i + 1]?.trim() ?? "")) { cut = i; break; }
  }
  const kept = lines.slice(0, cut);
  while (kept.length && (kept[kept.length - 1].trim() === "" || kept[kept.length - 1].trim().startsWith(">"))) kept.pop();
  const out = kept.join("\n").trim();
  return out || text.trim();
}

function bodyOf(p: ParsedMail): string {
  const text = p.text?.trim() || (typeof p.html === "string" ? p.html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim() : "");
  let body = stripQuoted(text || "(no text)");
  const files = (p.attachments ?? []).filter((a) => a.contentDisposition !== "inline").map((a) => a.filename).filter(Boolean);
  if (files.length) body += `\n\n[Attachments in Gmail: ${files.join(", ")}]`;
  return body;
}

/** Files one raw email (RFC 822 source). The sync uses fileEmail directly; this exists for tests. */
export async function fileRawEmail(source: Buffer | string, role: "inbox" | "sent"): Promise<boolean> {
  await ensureSchema();
  return fileEmail(await simpleParser(source, { skipImageLinks: true }), role);
}

/** Files one email under the right conversation. Returns true if it was new. */
async function fileEmail(p: ParsedMail, role: "inbox" | "sent"): Promise<boolean> {
  const messageId = p.messageId ? angle(p.messageId) : null;
  const d = await db();
  if (messageId && (await d.query(`SELECT 1 FROM messages WHERE message_id = $1`, [messageId])).length) return false;

  const ours = ourAddresses();
  const from = addressList(p.from)[0];
  if (!from) return false;
  const recipients = [...addressList(p.to), ...addressList(p.cc)];
  const subject = (p.subject || "(no subject)").slice(0, 300);

  let guest: { name: string | null; address: string } | undefined;
  if (role === "inbox") {
    if (ours.has(from.address) || isAutomated(p, from.address)) return false;
    guest = from;
  } else {
    if (!ours.has(from.address)) return false;
    guest = recipients.find((r) => !ours.has(r.address));
    if (!guest) return false; // a note to ourselves, or a website notification
  }

  const refs = [p.inReplyTo, ...(Array.isArray(p.references) ? p.references : p.references ? [p.references] : [])]
    .filter((x): x is string => Boolean(x))
    .flatMap((x) => x.split(/\s+/))
    .filter(Boolean)
    .map(angle);

  let threadId = await findThreadByMessageIds(refs);
  if (!threadId) {
    const ref = subject.match(REF_PATTERN)?.[0];
    if (ref) threadId = (await getThreadByRef(ref))?.id ?? null;
  }
  if (!threadId) threadId = await findRecentThreadByEmail(guest.address);
  if (!threadId) {
    if (role === "sent") return false;
    const t = await createThread({
      kind: "email",
      subject: subject.replace(/^(re|fwd?|aw):\s*/i, ""),
      guestName: guest.name,
      guestEmail: guest.address,
      at: p.date?.toISOString(),
    });
    threadId = t.id;
  } else if (role === "inbox") {
    await updateGuest(threadId, { name: guest.name, email: guest.address });
  }

  // Mail the site sent itself also lands in Gmail's Sent folder. It is normally recognised by its
  // Message-ID above; if Gmail changed that ID, recognise it by subject and time instead.
  if (role === "sent" && p.date) {
    const dup = await d.query(
      `SELECT 1 FROM messages WHERE thread_id = $1 AND direction = 'out' AND subject = $2 AND abs(extract(epoch FROM (at - $3::timestamptz))) < 300 LIMIT 1`,
      [threadId, subject, p.date.toISOString()]
    );
    if (dup.length) return false;
  }

  const stored = await addMessage({
    threadId,
    direction: role === "inbox" ? "in" : "out",
    channel: "email",
    author: role === "inbox" ? "guest" : `${from.address} (Gmail)`,
    fromName: from.name,
    fromAddr: from.address,
    toAddr: recipients.map((r) => r.address).join(", ") || null,
    subject,
    body: bodyOf(p),
    messageId,
    inReplyTo: p.inReplyTo ? angle(p.inReplyTo) : null,
    delivery: role === "inbox" ? "received" : "sent",
    automatic: false,
    at: p.date?.toISOString(),
  });
  return Boolean(stored);
}
