import { getSettings } from "@/lib/booking/settings";
import { adminConfigured, emailConfigured } from "@/lib/booking/config";
import { saveBookingSettings } from "../../actions";
import { PageTitle, Panel, adminBtnPrimary, adminInput, adminLabel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const s = await getSettings();
  const checks = [
    { label: "Database connected", ok: true },
    { label: "Admin login configured", ok: adminConfigured() },
    { label: "Email notifications (SMTP)", ok: emailConfigured(), help: "Set SMTP_USER and SMTP_PASS in Vercel to email guests and the hotel automatically." },
    { label: "Daily calendar sync (CRON_SECRET)", ok: Boolean(process.env.CRON_SECRET), help: "Set CRON_SECRET in Vercel so the daily sync can run." },
  ];
  return (
    <div className="grid max-w-[900px] gap-8">
      <PageTitle title="Settings" />
      <Panel title="Online booking">
        <form action={saveBookingSettings} className="grid gap-5">
          <label className="flex items-start gap-3 text-[14px]">
            <input type="checkbox" name="onlineBooking" defaultChecked={s.onlineBooking} className="mt-0.5 h-4 w-4 accent-[#1E3A2F]" />
            <span><span className="font-medium text-charcoal">Accept booking requests on the website</span><span className="block text-charcoal-soft">When off, the Book page shows the enquiry form instead.</span></span>
          </label>
          <div className="max-w-[160px]">
            <label htmlFor="currency" className={adminLabel}>Currency for rates</label>
            <input id="currency" name="currency" maxLength={3} defaultValue={s.currency} className={`${adminInput} uppercase`} />
          </div>
          <div>
            <label htmlFor="policyNote" className={adminLabel}>What guests agree to before sending a request</label>
            <textarea id="policyNote" name="policyNote" rows={3} defaultValue={s.policyNote} className={adminInput} />
            <p className="mt-1 text-[12.5px] text-charcoal-mute">Add your cancellation and payment terms here once they&rsquo;re decided.</p>
          </div>
          <div><button className={adminBtnPrimary}>Save settings</button></div>
        </form>
      </Panel>
      <Panel title="System status">
        <ul className="grid gap-3 text-[14px]">
          {checks.map((c) => (
            <li key={c.label} className="flex items-start gap-3">
              <span aria-hidden="true" className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${c.ok ? "bg-whatsapp" : "bg-[#C98A1B]"}`} />
              <span><span className="text-charcoal">{c.label}: {c.ok ? "ready" : "not set up"}</span>{!c.ok && c.help && <span className="block text-[13px] text-charcoal-soft">{c.help}</span>}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
