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

const ALL_DISHES = BREAKFAST.flatMap((c) => c.dishes);
const dish = (file: string) => ALL_DISHES.find((d) => d.image.endsWith(`/${file}.webp`))!;

/**
 * Plates set around the table, seen from above: x/y are percentages of the
 * section, size is in pixels. The photos are small, so no plate goes past 88px.
 * Four down each side, leaving the middle clear for the words.
 */
const TABLE: Array<{ d: Dish; x: number; y: number; size: number}> = [
  { d: dish("avocado-hoppers"), x: 3, y: 4, size: 84 },
  { d: dish("tropical-smoothie-bowl"), x: 15, y: 30, size: 72 },
  { d: dish("full-english"), x: 2, y: 54, size: 88 },
  { d: dish("dosa"), x: 14, y: 80, size: 68 },
  { d: dish("coconut-roti"), x: 89, y: 2, size: 80 },
  { d: dish("shakshuka"), x: 78, y: 28, size: 72 },
  { d: dish("banana-pancakes"), x: 90, y: 52, size: 88 },
  { d: dish("french-toast"), x: 79, y: 79, size: 72 },
];

/**
 * The opening of the breakfast section: the words in the middle of the table,
 * the plates laid around them. On smaller screens the plates gather into one
 * row above the heading instead.
 */
export function BreakfastTable({ dishCount }: { dishCount: number }) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
        {TABLE.map(({ d, x, y, size }) => (
          <figure key={d.name} className="absolute flex w-[132px] flex-col items-center" style={{ left: `${x}%`, top: `${y}%`, marginLeft: -(132 - size) / 2 }}>
            <Plate dish={d} size={size} className="shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-ivory/15" />
            <figcaption className="mt-2.5 text-center font-display text-[13.5px] italic leading-tight text-sand/70">{d.name}</figcaption>
          </figure>
        ))}
      </div>

      <div className="relative mx-auto max-w-[40rem] text-center xl:py-10">
        <PlateRow dishes={TABLE.slice(0, 6).map((t) => t.d)} size={64} ring="ring-forest" className="mb-8 justify-center xl:hidden [&>*:nth-child(n+6)]:max-[380px]:hidden" />
        <p className="font-display text-[1.1rem] italic text-sand">Breakfast is on us</p>
        <h2 className="display-lg mx-auto mt-3 max-w-[16ch]">A breakfast unlike any other in Ahangama</h2>
        <span aria-hidden="true" className="mx-auto mt-7 block h-px w-16 bg-sand/50" />
        <p className="lede mx-auto mt-7 max-w-[36ch] !text-ivory/85 [text-wrap:balance]">
          Every morning, choose from {dishCount} dishes, cooked to order by our professional chef. Fruit, a fresh juice or king coconut, and Ceylon tea or coffee come with it. All of it is complimentary.
        </p>
        <p className="body mx-auto mt-5 max-w-[42ch] !text-ivory/70 [text-wrap:balance]">
          Then our head chef comes out to the tables to ask how you enjoyed it, and takes what you say back to the kitchen.
        </p>
      </div>
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
