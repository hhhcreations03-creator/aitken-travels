import { RATINGS, type Rating } from "@/lib/ratings";

function Stars({ score, outOf }: { score: number; outOf: number }) {
  const pct = Math.max(0, Math.min(1, score / outOf)) * 100;
  return (
    <span className="relative inline-block text-[15px] leading-none tracking-[0.18em]" aria-hidden="true">
      <span className="text-sand-deep">★★★★★</span>
      <span className="absolute inset-0 overflow-hidden whitespace-nowrap text-olive-deep" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  );
}

function RatingEntry({ r }: { r: Rating }) {
  const hasScore = r.score !== null;
  const scoreText = hasScore ? r.score!.toFixed(1) : null;
  const label = hasScore
    ? `${r.source} guest rating: ${scoreText} out of ${r.outOf}${r.reviewCount ? `, from ${r.reviewCount} reviews` : ""}.`
    : `Guest reviews on ${r.source}.`;

  return (
    <li className="flex flex-col justify-between gap-5 border-t border-[color:var(--line)] pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
      <div>
        <p className="text-[14px] text-charcoal-soft">{r.source}</p>
        {hasScore ? (
          <p className="mt-2 flex items-baseline gap-2" aria-label={label}>
            <span className="font-display text-[clamp(3rem,6vw,4.5rem)] font-light leading-none tracking-snug text-forest tabular-nums" aria-hidden="true">
              {scoreText}
            </span>
            <span className="text-[15px] text-charcoal-soft" aria-hidden="true">/ {r.outOf}</span>
          </p>
        ) : (
          <p className="mt-2 max-w-[22ch] font-display text-[1.45rem] leading-snug text-forest">See what guests say on {r.source}</p>
        )}
        {hasScore && (
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-charcoal-soft">
            {r.outOf === 5 && <Stars score={r.score!} outOf={r.outOf} />}
            {r.reviewCount !== null && <span>{r.reviewCount} guest reviews</span>}
          </p>
        )}
      </div>
      <a href={r.url} target="_blank" rel="noopener noreferrer" className="textlink self-start text-[14px]">
        {r.linkLabel}
      </a>
    </li>
  );
}

export function GuestRatings() {
  const scored = RATINGS.filter((r) => r.score !== null);
  const asOf = scored[0]?.asOf;
  return (
    <section aria-labelledby="ratings-heading" className="bg-ivory-deep">
      <div className="wrap grid gap-10 py-14 lg:grid-cols-12 lg:items-end lg:py-16">
        <div className="lg:col-span-4">
          <h2 id="ratings-heading" className="display-md text-forest">Rated by our guests</h2>
          <p className="body mt-3 max-w-[34ch]">Scores from guests who have stayed at the Haven, published on independent review sites.</p>
        </div>
        <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {RATINGS.map((r) => <RatingEntry key={r.source} r={r} />)}
        </ul>
        {asOf && <p className="small text-charcoal-soft lg:col-span-12">Scores as published in {asOf}. Follow the links for the latest figures.</p>}
      </div>
    </section>
  );
}
