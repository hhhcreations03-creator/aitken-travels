import Link from "next/link";
import type { BookingStatus } from "@/lib/booking/validation";
import { STATUS_LABELS } from "@/lib/booking/validation";

const BADGE: Record<BookingStatus, string> = {
  pending: "bg-[#F4E4C1] text-[#6B4A0E]",
  confirmed: "bg-[#DCE7DF] text-forest",
  checked_in: "bg-forest text-ivory",
  completed: "bg-[#E6E3DC] text-charcoal-soft",
  cancelled: "bg-[#F1DDD9] text-[#7A2E24]",
  declined: "bg-[#F1DDD9] text-[#7A2E24]",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12.5px] font-medium ${BADGE[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-display text-[2rem] leading-tight text-forest">{title}</h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Panel({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-[4px] border border-[color:var(--line)] bg-white">
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--line-soft)] px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-charcoal">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-[14px] text-charcoal-mute">{children}</p>;
}

export const adminBtn = "inline-flex items-center justify-center gap-2 rounded-[3px] px-3.5 py-2 text-[13.5px] font-medium transition-colors min-h-[38px]";
export const adminBtnPrimary = `${adminBtn} bg-forest text-ivory hover:bg-forest-deep`;
export const adminBtnOutline = `${adminBtn} border border-[color:var(--line)] bg-white text-charcoal hover:border-forest hover:text-forest`;
export const adminBtnDanger = `${adminBtn} border border-[#9B3B2E]/40 bg-white text-[#7A2E24] hover:bg-[#9B3B2E] hover:text-white`;
export const adminInput = "w-full rounded-[3px] border border-[color:var(--line)] bg-white px-3 py-2 text-[14px] text-charcoal focus:border-forest min-h-[38px]";
export const adminLabel = "mb-1 block text-[12.5px] font-medium text-charcoal-soft";

export function LinkButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return <Link href={href} className={primary ? adminBtnPrimary : adminBtnOutline}>{children}</Link>;
}

export function money(n: number | null, currency: string) {
  if (n === null || n === undefined) return "–";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
}

export function shortDate(iso: string) {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit", timeZone: "UTC" });
}

export function dateTime(ts: string) {
  return new Date(ts).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" });
}
