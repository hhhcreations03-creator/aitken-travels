/** Phones only: a quiet line under a swipe row saying how much is in it. */
export function SwipeHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 flex items-center gap-3 text-[13px] text-charcoal-mute md:hidden">
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
      {children}
    </p>
  );
}
