"use client";

interface MarqueeItem {
  icon: string;
  label: string;
}

const ITEMS: MarqueeItem[] = [
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1L9.5 5H14L10.5 7.5L12 12L8 9L4 12L5.5 7.5L2 5H6.5L8 1Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M4 14.5C4 14.5 4.5 13 8 13C11.5 13 12 14.5 12 14.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    label: "SLTDA Licensed",
  },
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/><path d="M8 4V8.5L10.5 10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    label: "2+ Years of Service",
  },
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="6" r="3" stroke="currentColor" stroke-width="1.2"/><path d="M2.5 13.5C2.5 10 5 8 8 8C11 8 13.5 10 13.5 13.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    label: "Island-wide Coverage",
  },
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/><path d="M8 4V8.5L10.5 10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 8H3M13 8H15M8 1V3M8 13V15" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>`,
    label: "24/7 Airport Transfers",
  },
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M3 14C3 11.2 5.2 9 8 9C10.8 9 13 11.2 13 14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    label: "Professional Drivers",
  },
  {
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="4" width="13" height="8" rx="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="4.5" cy="12" r="1.5" stroke="currentColor" stroke-width="1"/><circle cx="11.5" cy="12" r="1.5" stroke="currentColor" stroke-width="1"/><path d="M1.5 7H14.5" stroke="currentColor" stroke-width="1"/></svg>`,
    label: "Fleet of 50+ Vehicles",
  },
];

export function Marquee() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="bg-white border-y border-slate-100 py-5 overflow-hidden group">
      <div
        className="flex items-center gap-0 animate-marquee whitespace-nowrap"
        style={{ animationPlayState: "running" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = "running";
        }}
      >
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center gap-0 flex-shrink-0">
            <div className="flex items-center gap-2 px-4">
              <span
                className="text-slate-400 flex-shrink-0"
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />
              <span className="text-[12px] font-medium tracking-[0.08em] text-slate-500 uppercase">
                {item.label}
              </span>
            </div>
            <span className="text-primary-300 text-[10px] flex-shrink-0">&middot;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
