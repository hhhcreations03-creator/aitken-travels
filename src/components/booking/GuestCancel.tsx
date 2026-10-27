"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GuestCancel({ bookingRef, token }: { bookingRef: string; token: string }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function cancel() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/bookings/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ref: bookingRef, token }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error || "We couldn't cancel this booking.");
    router.refresh();
  }

  if (!confirming)
    return <button type="button" onClick={() => setConfirming(true)} className="btn-outline">Cancel this booking</button>;
  return (
    <div className="rounded-[2px] border border-[#9B3B2E]/30 bg-[#9B3B2E]/5 p-4">
      <p className="text-[15px] text-charcoal">Cancel booking {bookingRef}? This releases the room and can&rsquo;t be undone online.</p>
      {error && <p role="alert" className="field-error">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={cancel} className="btn bg-[#9B3B2E] text-white hover:bg-[#7A2E24] disabled:opacity-60">{busy ? "Cancelling…" : "Yes, cancel it"}</button>
        <button type="button" onClick={() => setConfirming(false)} className="btn-outline">Keep my booking</button>
      </div>
    </div>
  );
}
