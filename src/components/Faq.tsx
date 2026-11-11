"use client";

import { useState } from "react";

/**
 * Questions that open one at a time. On a phone the full list of answers was
 * several screens of text; now it is a short list of questions to tap.
 * `phoneShows` keeps phones to the first few questions, with the rest one tap
 * away. Every answer stays in the page for search engines either way.
 */
export function Faq({ items, phoneShows }: { items: Array<[string, string]>; phoneShows?: number }) {
  const [all, setAll] = useState(false);
  const limited = phoneShows !== undefined && phoneShows < items.length && !all;
  return (
    <>
      <div className="border-t border-[color:var(--line-soft)]">
        {items.map(([q, a], i) => (
          <details key={q} className={`group border-b border-[color:var(--line-soft)] ${limited && i >= phoneShows ? "max-md:hidden" : ""}`}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-display text-[1.2rem] leading-snug text-forest md:text-[1.25rem] [&::-webkit-details-marker]:hidden">
              <span>{q}</span>
              <span className="relative mt-2 h-3 w-3 shrink-0" aria-hidden="true">
                <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
              </span>
            </summary>
            <p className="body -mt-1 max-w-[62ch] pb-6">{a}</p>
          </details>
        ))}
      </div>
      {limited && (
        <button type="button" onClick={() => setAll(true)} className="textlink mt-6 text-[14.5px] md:hidden">
          Show all {items.length} questions
        </button>
      )}
    </>
  );
}
