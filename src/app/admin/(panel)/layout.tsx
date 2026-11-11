import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/booking/auth";
import { bookingConfigured } from "@/lib/booking/config";
import { db } from "@/lib/booking/db";
import { ensureSchema } from "@/lib/booking/schema";
import { Sidebar } from "@/components/admin/Sidebar";
import { Flash } from "@/components/admin/Flash";
import { logout } from "../actions";
import { inboxCounts } from "@/lib/inbox/threads";

export const dynamic = "force-dynamic";

async function pendingCount(): Promise<number> {
  try {
    await ensureSchema();
    const d = await db();
    const [r] = await d.query<{ n: number }>(`SELECT count(*)::int AS n FROM bookings WHERE status = 'pending'`);
    return r?.n ?? 0;
  } catch {
    return 0;
  }
}

async function needsReplyCount(): Promise<number> {
  try {
    return (await inboxCounts()).needsReply;
  } catch {
    return 0;
  }
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const configured = bookingConfigured();
  const [pending, needsReply] = configured ? await Promise.all([pendingCount(), needsReplyCount()]) : [0, 0];
  const account = (
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0 truncate text-[12.5px] text-ivory/70" title={admin.email}>{admin.email}</span>
      <form action={logout}>
        <button type="submit" className="whitespace-nowrap rounded-[3px] border border-ivory/30 px-2.5 py-1 text-[12.5px] text-ivory hover:bg-ivory/10">Sign out</button>
      </form>
    </div>
  );
  return (
    <div className="lg:pl-[248px]">
      <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[#F3F1EC]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <Sidebar counts={{ pending, needsReply }} account={account} />
          <Link href="/admin" className="hidden whitespace-nowrap font-display text-[1.1rem] text-forest sm:inline lg:hidden">Lavish Haven</Link>
          <form action="/admin/bookings" method="get" role="search" className="ml-auto w-full max-w-[22rem]">
            <label htmlFor="admin-search" className="sr-only">Search reservations</label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-mute" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <input id="admin-search" name="q" type="search" placeholder="Search guest, email, phone or LH- ref" className="w-full rounded-[4px] border border-[color:var(--line)] bg-white py-2 pl-9 pr-3 text-[14px] text-charcoal placeholder:text-charcoal-mute focus:border-forest" />
            </div>
          </form>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6">
        <Suspense><Flash /></Suspense>
        {configured ? (
          children
        ) : (
          <div className="max-w-[44rem] rounded-[4px] border border-[color:var(--line)] bg-white p-6 text-[14.5px] leading-relaxed text-charcoal-soft">
            <h1 className="font-display text-[1.6rem] text-forest">Connect a database to start taking bookings</h1>
            <p className="mt-3">Online booking needs a database. Until one is connected, the website keeps using the enquiry form.</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>In Vercel, open the project, then <strong>Storage</strong>, and create a <strong>Neon</strong> Postgres database.</li>
              <li>Connect it to this project for Production. Vercel adds <code className="font-mono">DATABASE_URL</code> automatically.</li>
              <li>Redeploy. Tables are created on first use.</li>
            </ol>
          </div>
        )}
      </main>
    </div>
  );
}
