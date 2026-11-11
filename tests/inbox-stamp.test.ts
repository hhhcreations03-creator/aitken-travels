import { describe, expect, it } from "vitest";
import { fileRawEmail, inboxStamp } from "@/lib/inbox/mailbox";
import { markRead } from "@/lib/inbox/threads";
import { db } from "@/lib/booking/db";
import { setupHotel } from "./helpers";

const email = (id: string, subject: string, extra = "") =>
  [
    "From: Ana Guest <ana@example.com>",
    "To: hello@thelavishhaven.com",
    `Subject: ${subject}`,
    `Message-ID: <${id}@example.com>`,
    "Date: Wed, 11 Nov 2026 09:00:00 +0530",
    extra,
    "Content-Type: text/plain; charset=utf-8",
    "",
    "Hello, do you have a room next week?",
  ]
    .filter(Boolean)
    .join("\r\n");

describe("inbox stamp (tells open admin pages to refresh)", () => {
  it("changes when an email is filed, and only then", async () => {
    await setupHotel();
    const before = await inboxStamp();
    expect(await inboxStamp()).toBe(before);

    expect(await fileRawEmail(email("a1", "Room next week"), "inbox")).toBe(true);
    const afterFirst = await inboxStamp();
    expect(afterFirst).not.toBe(before);

    // The same email read again is not filed twice, so nothing changes.
    expect(await fileRawEmail(email("a1", "Room next week"), "inbox")).toBe(false);
    expect(await inboxStamp()).toBe(afterFirst);

    // A reply in the same conversation changes it, though the thread count doesn't.
    const reply = email("a2", "Re: Room next week", "In-Reply-To: <a1@example.com>").replace("09:00:00", "09:05:00");
    expect(await fileRawEmail(reply, "inbox")).toBe(true);
    const afterReply = await inboxStamp();
    expect(afterReply).not.toBe(afterFirst);

    // Reading a conversation changes it too, so the unread state stays in step across tabs.
    const [t] = await (await db()).query<{ id: string }>(`SELECT id FROM threads WHERE guest_email = 'ana@example.com'`);
    await markRead(t.id);
    expect(await inboxStamp()).not.toBe(afterReply);
  });
});
