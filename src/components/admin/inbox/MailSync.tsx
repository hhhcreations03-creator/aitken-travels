"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type State =
  | { kind: "checking" }
  | { kind: "done"; imported: number }
  | { kind: "recent" }
  | { kind: "off" }
  | { kind: "error"; message: string };

/**
 * Checks the hotel mailbox in the background when the inbox opens, so new
 * email appears without pressing anything. The server reads at most once a
 * minute, however many tabs are open.
 */
export function MailSync({ lastSyncLabel }: { lastSyncLabel: string | null }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "checking" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/mail-sync", { method: "POST" })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; imported?: number; skipped?: string; error?: string };
        if (cancelled) return;
        if (!res.ok || data.ok === false) return setState({ kind: "error", message: data.error ?? "The mailbox couldn't be read." });
        if (data.skipped === "not_configured") return setState({ kind: "off" });
        if (data.skipped === "recent" || data.skipped === "busy") return setState({ kind: "recent" });
        setState({ kind: "done", imported: data.imported ?? 0 });
        if (data.imported) router.refresh();
      })
      .catch(() => !cancelled && setState({ kind: "error", message: "No connection to the server." }));
    return () => {
      cancelled = true;
    };
  }, [router]);

  const text =
    state.kind === "checking"
      ? "Checking the mailbox…"
      : state.kind === "done"
        ? state.imported
          ? `Mailbox checked: ${state.imported} new email${state.imported === 1 ? "" : "s"} filed.`
          : "Mailbox checked just now. Nothing new."
        : state.kind === "recent"
          ? `Mailbox checked${lastSyncLabel ? ` at ${lastSyncLabel}` : " a moment ago"}.`
          : state.kind === "off"
            ? "The mailbox isn't connected, so only website messages appear here. See Settings."
            : `Mailbox check failed: ${state.message}`;

  return (
    <p role="status" className={`text-[13px] ${state.kind === "error" || state.kind === "off" ? "text-[#7A2E24]" : "text-charcoal-mute"}`}>
      {text}
    </p>
  );
}
