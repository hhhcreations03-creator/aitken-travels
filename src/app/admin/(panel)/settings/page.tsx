import { getSettings } from "@/lib/booking/settings";
import { adminConfigured, emailConfigured } from "@/lib/booking/config";
import { saveBookingSettings } from "../../actions";
import { PageTitle, Panel, adminBtnOutline, adminBtnPrimary, adminInput, adminLabel, dateTime } from "@/components/admin/ui";
import { mailboxStatus } from "@/lib/inbox/mailbox";
import { hotelInbox } from "@/lib/inbox/mailer";
import { checkMailNow } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [s, mail] = await Promise.all([getSettings(), mailboxStatus()]);
  const mailOk = mail.configured && !mail.lastError;
  const checks = [
    { label: "Database connected", ok: true },
    { label: "Admin login configured", ok: adminConfigured() },
    { label: "Sending email to guests (SMTP)", ok: emailConfigured(), help: "Set SMTP_USER and SMTP_PASS in Vercel. See “Connect the hotel mailbox” below." },
    {
      label: "Reading the hotel mailbox (IMAP)",
      ok: mailOk,
      help: !mail.configured
        ? "Not connected, so the inbox only shows website messages. Uses the same two values as sending."
        : mail.lastError
          ? `Last check failed: ${mail.lastError}`
          : undefined,
      extra: mail.configured && mail.lastSyncAt ? `Last checked ${dateTime(mail.lastSyncAt)}${mail.lastImported ? `, ${mail.lastImported} new` : ""}.` : undefined,
    },
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
              <span>
                <span className="text-charcoal">{c.label}: {c.ok ? "ready" : "extra" in c && c.extra ? "needs attention" : "not set up"}</span>
                {!c.ok && c.help && <span className="block text-[13px] text-charcoal-soft">{c.help}</span>}
                {"extra" in c && c.extra && <span className="block text-[13px] text-charcoal-mute">{c.extra}</span>}
              </span>
            </li>
          ))}
        </ul>
        {mail.configured && <form action={checkMailNow} className="mt-4"><button className={adminBtnOutline}>Check mail now</button></form>}
      </Panel>
      <Panel title="Connect the hotel mailbox">
        <div className="grid gap-3 text-[14px] leading-relaxed text-charcoal-soft">
          <p>
            With the mailbox connected, every email to {hotelInbox()} appears in the admin Inbox next to the website messages. Replies sent from here come from that address, and guests&rsquo; answers land back in the same conversation. Replies your team writes in Gmail are picked up too.
          </p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Sign in to Google as the hotel mailbox and turn on <strong className="text-charcoal">2-Step Verification</strong> (Google Account, Security).</li>
            <li>Open <strong className="text-charcoal">myaccount.google.com/apppasswords</strong> and create an app password named &ldquo;Website&rdquo;. Google shows 16 letters once; copy them.</li>
            <li>In Vercel, open the project, then <strong className="text-charcoal">Settings</strong>, <strong className="text-charcoal">Environment Variables</strong>, and add for Production: <code className="font-mono text-[13px]">SMTP_USER</code> = the mailbox address, and <code className="font-mono text-[13px]">SMTP_PASS</code> = the app password, with no spaces.</li>
            <li>Redeploy. This page then shows both mail checks as ready.</li>
          </ol>
          <p>The app password stays in Vercel and is never shown on the website or in this admin. If your Google Workspace admin has turned IMAP off, they can turn it on in the Admin console under Gmail, End user access. To stop reading mail at any time, delete the app password in Google.</p>
        </div>
      </Panel>
    </div>
  );
}
