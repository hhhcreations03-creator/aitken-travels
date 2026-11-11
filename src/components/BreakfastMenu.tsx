import Image from "next/image";
import { BREAKFAST, WITH_EVERY_BREAKFAST, type Dish } from "@/lib/breakfast";

/** Where the second desktop column begins, so the two columns come out about even. */
const RIGHT_COLUMN_STARTS = "Eggs & classics";

/**
 * A dish photo, cut round like a plate seen from above. The photos come from
 * the hotel's printed menu and are small, so they are only ever shown small.
 */
export function Plate({ dish, size = 72, className = "" }: { dish: Pick<Dish, "name" | "image">; size?: number; className?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-full bg-sand ${className}`} style={{ width: size, height: size }}>
      <Image src={dish.image} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}

/** A loose row of overlapping plates, like dishes set down along a table. */
export function PlateRow({ dishes, size = 76, ring = "ring-ivory", className = "" }: { dishes: Array<Pick<Dish, "name" | "image">>; size?: number; ring?: string; className?: string }) {
  return (
    <div className={`flex items-center ${className}`} role="img" aria-label={`Breakfast dishes: ${dishes.map((d) => d.name).join(", ")}`}>
      {dishes.map((d, i) => (
        <Plate key={d.name} dish={d} size={size} className={`${i ? "-ml-3" : ""} ring-[3px] ${ring} shadow-[0_8px_20px_-10px_rgba(0,0,0,0.5)]`} />
      ))}
    </div>
  );
}

/**
 * The complimentary breakfast menu, set like a printed card on the table.
 * Desktop: one ivory card with the courses in two columns.
 * Phone: each course becomes its own card in a swipe rail, so the menu
 * costs one screen instead of five.
 */
export function BreakfastMenu() {
  return (
    <div className="md:bg-ivory md:p-3 md:text-charcoal">
      <div className="md:border md:border-[color:var(--line)] md:px-10 md:py-12 lg:px-16 lg:py-14">
        <div className="hidden text-center md:block">
          <p className="font-display text-[1.05rem] italic text-olive-deep">Complimentary, cooked to order</p>
          <h3 className="mt-2 font-display text-[2.4rem] font-light leading-none tracking-snug text-forest">The breakfast menu</h3>
          <span aria-hidden="true" className="mx-auto mt-6 block h-px w-16 bg-olive/60" />
        </div>

        <div className="rail-md rail-narrow md:mt-12 md:columns-2 md:gap-16 lg:gap-24">
          {BREAKFAST.map((course) => (
            <section key={course.title} className={`break-inside-avoid max-md:rounded-[2px] max-md:bg-ivory max-md:p-5 max-md:text-charcoal md:mb-11 ${course.title === RIGHT_COLUMN_STARTS ? "md:break-before-column" : ""}`}>
              <h4 className="flex items-baseline gap-4 font-display text-[1.3rem] italic text-olive-deep">
                {course.title}
                <span aria-hidden="true" className="h-px flex-1 translate-y-[-0.3em] bg-[color:var(--line)]" />
              </h4>
              <ul className="mt-5 grid gap-5">
                {course.dishes.map((d) => (
                  <li key={d.name} className="flex items-start gap-4 md:gap-5">
                    <Plate dish={d} size={56} className="md:hidden" />
                    <Plate dish={d} size={76} className="max-md:hidden" />
                    <div className="min-w-0 md:pt-1.5">
                      <p className="font-display text-[1.15rem] leading-snug text-forest md:text-[1.2rem]">{d.name}</p>
                      <p className="mt-1 text-[14px] leading-[1.6] text-charcoal-soft md:text-[14.5px]">{d.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-3 text-[13px] text-ivory/60 md:hidden">
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
          Swipe through all {BREAKFAST.length} courses
        </p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-[2px] border-y border-ivory/20 bg-ivory/20 sm:grid-cols-3 md:mt-2 md:border-[color:var(--line)] md:bg-[color:var(--line)]">
          {WITH_EVERY_BREAKFAST.map((x) => (
            <div key={x.title} className="bg-forest p-5 md:bg-ivory md:px-6 md:py-6 md:text-center">
              <p className="text-[12.5px] text-sand md:text-charcoal-mute">With every breakfast</p>
              <p className="mt-1 font-display text-[1.2rem] text-ivory md:text-forest">{x.title}</p>
              <p className="mt-1 text-[14px] leading-[1.55] text-ivory/75 md:text-charcoal-soft">{x.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[14px] leading-[1.6] text-ivory/75 md:text-center md:text-charcoal-soft">
          Every breakfast is freshly prepared to order. Please tell our team about any dietary requirements or allergies.
        </p>
      </div>
    </div>
  );
}
