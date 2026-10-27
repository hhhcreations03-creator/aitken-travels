import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { login } from "../actions";
import { Flash } from "@/components/admin/Flash";
import { adminBtnPrimary, adminInput, adminLabel } from "@/components/admin/ui";
import { adminConfigured, bookingConfigured } from "@/lib/booking/config";
import { currentAdmin } from "@/lib/booking/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  if (adminConfigured() && (await currentAdmin())) redirect("/admin");
  const ready = adminConfigured();
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Image src="/brand/logo.png" alt="The Lavish Haven" width={120} height={143} priority className="h-[110px] w-auto" />
        </div>
        <div className="rounded-[4px] border border-[color:var(--line)] bg-white p-7">
          <h1 className="font-display text-[1.6rem] text-forest">Bookings admin</h1>
          <p className="mt-1 text-[14px] text-charcoal-soft">Sign in to manage reservations.</p>
          <div className="mt-5">
            <Suspense><Flash /></Suspense>
          </div>
          {ready ? (
            <form key={searchParams.error ?? "login"} action={login} className="grid gap-4">
              <input type="hidden" name="next" value={searchParams.next ?? ""} />
              <div>
                <label htmlFor="email" className={adminLabel}>Email</label>
                <input id="email" name="email" type="email" autoComplete="username" required className={adminInput} />
              </div>
              <div>
                <label htmlFor="password" className={adminLabel}>Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required className={adminInput} />
              </div>
              <button type="submit" className={`${adminBtnPrimary} mt-2 w-full`}>Sign in</button>
            </form>
          ) : (
            <div className="text-[14px] leading-relaxed text-charcoal-soft">
              <p className="font-medium text-charcoal">Admin login isn&rsquo;t set up yet.</p>
              <p className="mt-2">Add these environment variables in Vercel, then redeploy:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-[12.5px]">
                <li>ADMIN_EMAIL</li>
                <li>ADMIN_PASSWORD_HASH</li>
                <li>SESSION_SECRET</li>
                {!bookingConfigured() && <li>DATABASE_URL (from the Neon integration)</li>}
              </ul>
              <p className="mt-2">Run <code className="font-mono">npm run admin:password</code> to create the password hash and secret.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
