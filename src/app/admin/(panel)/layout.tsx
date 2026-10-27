import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/booking/auth";
import { bookingConfigured } from "@/lib/booking/config";
import { db } from "@/lib/booking/db";
import { ensureSchema } from "@/lib/booking/schema";
import { AdminNav } from "@/components/admin/AdminNav";
import { Flash } from "@/components/admin/Flash";
import { logout } from "../actions";

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

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const configured = bookingConfigured();
  return (
    <>
      <header className="relative bg-forest text-ivory">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5" aria-label="Bookings admin home">
            <Image src="/brand/symbol-light.png" alt="" width={36} height={33} className="h-[30px] w-auto" />
            <span className="whitespace-nowrap font-display text-[1.15rem]">Lavish Haven <span className="text-sand-deep">Admin</span></span>
          </Link>
          <div className="flex items-center gap-3 lg:order-last">
            <span className="hidden text-[12.5px] text-ivory/70 md:inline">{admin.email}</span>
            <form action={logout}>
              <button type="submit" className="whitespace-nowrap rounded-[3px] border border-ivory/30 px-3 py-1.5 text-[13px] text-ivory hover:bg-ivory/10">Sign out</button>
            </form>
          </div>
          <div className="flex-1 lg:flex lg:justify-center">
            <AdminNav pending={configured ? await pendingCount() : 0} />
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
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
    </>
  );
}
