import type { Message, Thread } from "@/lib/inbox/threads";
import { KIND_LABELS } from "@/lib/inbox/threads";
import { dateTime } from "../ui";

const CHANNEL: Record<Message["channel"], string> = {
  web: "website",
  email: "email",
  whatsapp: "WhatsApp",
  phone: "phone",
  system: "admin",
};

function who(m: Message, guestName: string | null): string {
  if (m.direction === "note") return `Note by ${m.author ?? "admin"}`;
  if (m.direction === "in") return `${m.from_name || guestName || m.from_addr || "Guest"}, by ${CHANNEL[m.channel]}`;
  if (m.automatic) return `Automatic ${CHANNEL[m.channel]} from the hotel`;
  return `${(m.author ?? "Hotel team").replace(/ \(Gmail\)$/, "")}${m.author?.endsWith("(Gmail)") ? ", from Gmail" : ""}, by ${CHANNEL[m.channel]}`;
}

function DeliveryNote({ m }: { m: Message }) {
  if (m.delivery === "failed") return <p className="mt-2 text-[12.5px] font-medium text-[#7A2E24]">Not delivered: {m.error ?? "the email was refused"}.</p>;
  if (m.delivery === "not_sent") return <p className="mt-2 text-[12.5px] font-medium text-[#7A2E24]">Not sent: {m.error ?? "email isn't set up"}.</p>;
  if (m.direction === "out" && m.channel !== "email") return <p className="mt-2 text-[12.5px] text-charcoal-mute">Logged in admin</p>;
  return null;
}

const LONG = 1600;

function Body({ text }: { text: string }) {
  if (text.length <= LONG) return <p className="whitespace-pre-wrap break-words">{text}</p>;
  return (
    <details className="group">
      <summary className="cursor-pointer list-none whitespace-pre-wrap break-words [&::-webkit-details-marker]:hidden">
        {text.slice(0, LONG)}… <span className="font-medium text-forest underline group-open:hidden">Show all</span>
      </summary>
      <p className="whitespace-pre-wrap break-words">{text.slice(LONG)}</p>
    </details>
  );
}

/** A conversation, oldest first: what the guest wrote, what the hotel sent, and internal notes. */
export function Conversation({ thread, messages }: { thread: Thread; messages: Message[] }) {
  if (!messages.length) {
    return (
      <p className="rounded-[3px] border border-dashed border-[color:var(--line)] px-4 py-6 text-center text-[14px] text-charcoal-mute">
        No messages yet. {thread.kind === "booking" ? "Emails about this booking, and the guest's replies, will appear here." : ""}
      </p>
    );
  }
  return (
    <ol className="grid gap-3 text-[14px] leading-relaxed">
      {messages.map((m) => {
        const tone =
          m.direction === "in"
            ? "mr-6 border-[color:var(--line)] bg-white sm:mr-16"
            : m.direction === "out"
              ? `ml-6 sm:ml-16 ${m.automatic ? "border-[color:var(--line-soft)] bg-[#F7F5F0] text-charcoal-soft" : "border-forest/20 bg-[#EEF3EF]"}`
              : "mx-2 border-[#E9C46A]/60 bg-[#FBF3DF] sm:mx-10";
        return (
          <li key={m.id} className={`rounded-[4px] border px-4 py-3 ${tone}`}>
            <p className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-[12.5px] text-charcoal-mute">
              <span className="font-medium text-charcoal">{who(m, thread.guest_name)}</span>
              <span>{dateTime(m.at)}</span>
            </p>
            {m.subject && m.channel === "email" && <p className="mb-1.5 text-[12.5px] text-charcoal-soft">Subject: {m.subject}</p>}
            <Body text={m.body} />
            <DeliveryNote m={m} />
          </li>
        );
      })}
    </ol>
  );
}

export function KindBadge({ kind }: { kind: Thread["kind"] }) {
  const tone: Record<Thread["kind"], string> = {
    booking: "bg-[#DCE7DF] text-forest",
    contact: "bg-[#E6E3DC] text-charcoal-soft",
    group: "bg-[#E2E8F0] text-[#2F4A6B]",
    surf: "bg-[#DDEBEA] text-[#245B5E]",
    availability: "bg-[#F4E4C1] text-[#6B4A0E]",
    email: "bg-[#ECE6F2] text-[#4E3A66]",
  };
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium ${tone[kind]}`}>{KIND_LABELS[kind]}</span>;
}
