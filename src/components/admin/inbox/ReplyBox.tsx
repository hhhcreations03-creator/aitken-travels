"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { addThreadNote, logContact, sendReply } from "@/app/admin/actions";
import { adminBtnOutline, adminBtnPrimary, adminInput, adminLabel } from "../ui";

interface Props {
  threadId: string;
  subject: string;
  guestName: string | null;
  guestEmail: string | null;
  canEmail: boolean;
  /** Where to come back to after sending, e.g. the booking page. */
  returnTo?: string;
}

type Mode = "email" | "log" | "note";

function Submit({ children, primary = true }: { children: React.ReactNode; primary?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${primary ? adminBtnPrimary : adminBtnOutline} disabled:opacity-60`}>
      {pending ? "Working…" : children}
    </button>
  );
}

/** Answer a conversation: email the guest, log a WhatsApp message or call, or leave an internal note. */
export function ReplyBox({ threadId, subject, guestName, guestEmail, canEmail, returnTo }: Props) {
  const emailable = canEmail && Boolean(guestEmail);
  const [mode, setMode] = useState<Mode>(emailable ? "email" : "log");
  const first = guestName?.trim().split(/\s+/)[0];
  const tabs: Array<{ id: Mode; label: string }> = [
    { id: "email", label: "Email the guest" },
    { id: "log", label: "Log WhatsApp or call" },
    { id: "note", label: "Internal note" },
  ];

  return (
    <div className="rounded-[4px] border border-[color:var(--line)] bg-white">
      <div role="tablist" aria-label="How to respond" className="flex flex-wrap gap-1 border-b border-[color:var(--line-soft)] px-3 pt-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={mode === t.id}
            onClick={() => setMode(t.id)}
            className={`-mb-px rounded-t-[3px] border px-3 py-2 text-[13.5px] ${mode === t.id ? "border-[color:var(--line)] border-b-white bg-white font-medium text-forest" : "border-transparent text-charcoal-soft hover:text-forest"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {mode === "email" && (
          <form action={sendReply} className="grid gap-3">
            <input type="hidden" name="threadId" value={threadId} />
            {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
            {!emailable && (
              <p className="rounded-[3px] bg-[#FBF3DF] px-3 py-2 text-[13px] text-[#6B4A0E]">
                {!guestEmail ? "There's no email address for this guest. Use WhatsApp or a call, then log it." : "Email sending isn't set up yet, so a reply can't go out from here. See Settings."}
              </p>
            )}
            <p className="text-[13px] text-charcoal-soft">To <strong className="font-medium text-charcoal">{guestEmail ?? "no address"}</strong>, from the hotel mailbox. Their reply comes back to this conversation.</p>
            <div>
              <label htmlFor={`subj-${threadId}`} className={adminLabel}>Subject</label>
              <input id={`subj-${threadId}`} name="subject" defaultValue={`Re: ${subject.replace(/^re:\s*/i, "")}`} className={adminInput} />
            </div>
            <div>
              <label htmlFor={`body-${threadId}`} className={adminLabel}>Message</label>
              <textarea id={`body-${threadId}`} name="body" rows={8} required defaultValue={`Dear ${first || "Guest"},\n\n\n\nWarm regards,\nThe Lavish Haven`} className={adminInput} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-[13px] text-charcoal-soft">
                <input type="checkbox" name="close" className="h-4 w-4 accent-[#1E3A2F]" />
                Close the conversation after sending
              </label>
              <Submit>{emailable ? "Send email" : "Save without sending"}</Submit>
            </div>
          </form>
        )}

        {mode === "log" && (
          <form action={logContact} className="grid gap-3">
            <input type="hidden" name="threadId" value={threadId} />
            {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
            <p className="text-[13px] text-charcoal-soft">WhatsApp and phone calls happen outside this system. Log them here so everyone sees the whole conversation.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={`ch-${threadId}`} className={adminLabel}>Channel</label>
                <select id={`ch-${threadId}`} name="channel" className={adminInput}><option value="whatsapp">WhatsApp</option><option value="phone">Phone call</option></select>
              </div>
              <div>
                <label htmlFor={`dir-${threadId}`} className={adminLabel}>Who</label>
                <select id={`dir-${threadId}`} name="direction" className={adminInput}><option value="out">We wrote or called the guest</option><option value="in">The guest wrote or called us</option></select>
              </div>
            </div>
            <div>
              <label htmlFor={`log-${threadId}`} className={adminLabel}>What was said</label>
              <textarea id={`log-${threadId}`} name="body" rows={4} required placeholder="For example: confirmed the rate of USD 120 a night; guest will pay on arrival." className={adminInput} />
            </div>
            <div className="flex justify-end"><Submit>Log it</Submit></div>
          </form>
        )}

        {mode === "note" && (
          <form action={addThreadNote} className="grid gap-3">
            <input type="hidden" name="threadId" value={threadId} />
            {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
            <p className="text-[13px] text-charcoal-soft">Only the team sees notes. The guest is never sent them.</p>
            <label htmlFor={`note-${threadId}`} className="sr-only">Note</label>
            <textarea id={`note-${threadId}`} name="body" rows={3} required placeholder="For example: asked the owner about a discount for 10 nights." className={adminInput} />
            <div className="flex justify-end"><Submit primary={false}>Add note</Submit></div>
          </form>
        )}
      </div>
    </div>
  );
}
