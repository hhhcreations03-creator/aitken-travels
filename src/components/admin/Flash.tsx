"use client";

import { useSearchParams } from "next/navigation";

export function Flash() {
  const params = useSearchParams();
  const msg = params.get("msg");
  const error = params.get("error");
  if (!msg && !error) return null;
  return (
    <div
      role={error ? "alert" : "status"}
      className={`mb-6 rounded-[3px] border px-4 py-3 text-[14px] ${error ? "border-[#9B3B2E]/30 bg-[#9B3B2E]/5 text-[#7A2E24]" : "border-forest/20 bg-[#DCE7DF]/60 text-forest"}`}
    >
      {error || msg}
    </div>
  );
}
