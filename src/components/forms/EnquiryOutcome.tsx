"use client";

import { SITE, mailtoUrl, whatsappUrl } from "@/lib/site";
import type { SubmitResult } from "@/lib/enquiry-client";

interface Props {
  result: SubmitResult | null;
  subject: string;
  message: string;
  onReset?: () => void;
}

/**
 * Honest post-submit state. Email delivery only shows as "sent" when the API
 * confirmed it; otherwise the visitor gets a working WhatsApp or email handoff
 * carrying the same message.
 */
export function EnquiryOutcome({ result, subject, message, onReset }: Props) {
  if (!result) return null;

  if (result.status === "sent") {
    return (
      <div role="status" className="rounded-[2px] border border-forest/20 bg-white/60 p-6">
        <h3 className="font-display text-[1.5rem] text-forest">Your enquiry has been sent</h3>
        <p className="body mt-2">
          It&rsquo;s on its way to {SITE.email}. The hotel team will reply to confirm availability and arrangements directly. Nothing is reserved until they do.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            Also send on WhatsApp
          </a>
          {onReset && (
            <button type="button" onClick={onReset} className="btn-outline">Send another enquiry</button>
          )}
        </div>
      </div>
    );
  }

  const heading = result.status === "unconfigured" ? "Send your enquiry on WhatsApp or by email" : "Email couldn't be sent from the site";
  const note =
    result.status === "unconfigured"
      ? "Email delivery isn't switched on for this website yet, so nothing has been sent. Your enquiry is ready to go; choose how to send it and it will open with everything filled in."
      : `${result.message} Your enquiry is ready to go; choose how to send it and it will open with everything filled in.`;

  return (
    <div role="status" className="rounded-[2px] border border-forest/20 bg-white/60 p-6">
      <h3 className="font-display text-[1.5rem] text-forest">{heading}</h3>
      <p className="body mt-2">{note}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          Send on WhatsApp
        </a>
        <a href={mailtoUrl(subject, message)} className="btn-outline">
          Send by email
        </a>
      </div>
      <details className="mt-5 text-[13.5px] text-charcoal-soft">
        <summary className="cursor-pointer text-forest">Preview the message</summary>
        <pre className="mt-3 whitespace-pre-wrap rounded-[2px] bg-ivory-deep p-4 font-sans text-[13px] leading-relaxed">{message}</pre>
      </details>
    </div>
  );
}
