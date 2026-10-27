import { ROOMS } from "@/lib/rooms";
import { roomTypes } from "@/lib/booking/availability";
import { getSettings } from "@/lib/booking/settings";
import { saveRoomTypes } from "../../actions";
import { PageTitle, adminBtnPrimary, adminInput } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function RoomsAdmin() {
  const [types, settings] = await Promise.all([roomTypes(true), getSettings()]);
  const bySlug = new Map(types.map((t) => [t.slug, t]));
  const total = types.filter((t) => t.active).reduce((n, t) => n + t.units, 0);
  return (
    <div>
      <PageTitle title="Rooms & rates" />
      <p className="mb-6 max-w-[70ch] text-[14px] text-charcoal-soft">
        Set how many physical rooms you have of each type. The website never offers more than this on any night. The nightly rate is optional: when set, guests see an estimated total; when blank, they see &ldquo;Rate confirmed by the hotel&rdquo;. Rates are in {settings.currency}.
      </p>
      <form action={saveRoomTypes}>
        <div className="overflow-x-auto rounded-[4px] border border-[color:var(--line)] bg-white">
          <table className="w-full min-w-[820px] text-left text-[13.5px]">
            <thead className="border-b border-[color:var(--line)] bg-[#FAF8F4] text-[12.5px] text-charcoal-soft">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Room type</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Rooms of this type</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Sleeps up to</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Nightly rate ({settings.currency})</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Bookable online</th>
              </tr>
            </thead>
            <tbody>
              {ROOMS.map((r) => {
                const t = bySlug.get(r.slug);
                return (
                  <tr key={r.slug} className="border-b border-[color:var(--line-soft)] last:border-0">
                    <th scope="row" className="px-4 py-2.5 font-normal"><span className="text-charcoal">{r.name}</span><span className="block text-[12.5px] text-charcoal-mute">{r.beds}, {r.sizeSqm} m²</span></th>
                    <td className="px-4 py-2.5"><label className="sr-only" htmlFor={`units:${r.slug}`}>Rooms of {r.shortName}</label><input id={`units:${r.slug}`} name={`units:${r.slug}`} type="number" min={0} max={50} required defaultValue={t?.units ?? 1} className={`${adminInput} w-20`} /></td>
                    <td className="px-4 py-2.5"><label className="sr-only" htmlFor={`max:${r.slug}`}>Max guests in {r.shortName}</label><input id={`max:${r.slug}`} name={`max:${r.slug}`} type="number" min={1} max={20} required defaultValue={t?.max_guests ?? 2} className={`${adminInput} w-20`} /></td>
                    <td className="px-4 py-2.5"><label className="sr-only" htmlFor={`rate:${r.slug}`}>Nightly rate for {r.shortName}</label><input id={`rate:${r.slug}`} name={`rate:${r.slug}`} type="number" min={0} step="0.01" placeholder="Not shown" defaultValue={t?.nightly_rate ?? ""} className={`${adminInput} w-32`} /></td>
                    <td className="px-4 py-2.5"><label className="flex items-center gap-2"><input type="checkbox" name={`active:${r.slug}`} defaultChecked={t?.active ?? true} className="h-4 w-4 accent-[#1E3A2F]" /><span className="sr-only">{r.shortName} bookable online</span></label></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[13px] text-charcoal-soft">{total} bookable room{total === 1 ? "" : "s"} in total.</p>
          <button className={adminBtnPrimary}>Save room settings</button>
        </div>
      </form>
    </div>
  );
}
