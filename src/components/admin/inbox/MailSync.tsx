"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type State =
  | { kind: "checking" }
  | { kind: "ok"; checkedAt: string | null; imported: number }
  | { kind: "off" }
  | { kind: "error"; message: string };

type Reply = { ok?: boolean; imported?: number; skipped?: string; error?: string; stamp?: string; checkedAt?: string | null };

/** How often an open admin page asks for new mail while it's on screen. */
const POLL_MS = 30_000;

const time = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Colombo" }).format(new Date(iso));

/**
 * Keeps the admin up to date with the hotel mailbox and website messages.
 *
 * While the page is on screen it asks the server every 30 seconds, and again
 * as soon as the tab comes back into view. The server files any new email
 * (reading Gmail at most every 20 seconds, however many tabs are open) and
 * returns a stamp of the inbox; when the stamp changes, the page refreshes in
 * place, so new conversations, replies and the sidebar badge appear without
 * reloading. A reply being typed is kept, since refreshing only re-renders
 * server data.
 *
 * `quiet` renders nothing and is used by the admin layout so every page stays
 * current; the inbox list shows the visible status line instead.
 */
export function MailSync({ quiet = false }: { quiet?: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const [state, setState] = useState<State>({ kind: "checking" });
  const stamp = useRef<string | null>(null);
  // The inbox list has its own visible watcher, so the layout's quiet one stands down there.
  const standDown = quiet && path === "/admin/inbox";

  useEffect(() => {
    if (standDown) return;
    let stopped = false;
    let inFlight = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      clearTimeout(timer);
      if (!stopped && document.visibilityState === "visible") timer = setTimeout(check, POLL_MS);
    };

    async function check() {
      if (stopped || inFlight) return;
      inFlight = true;
      try {
        const res = await fetch("/api/admin/mail-sync", { method: "POST", cache: "no-store" });
        const data = (await res.json().catch(() => ({}))) as Reply;
        if (stopped) return;
        if (res.status === 401) {
          setState({ kind: "error", message: "your session has ended. Sign in again." });
          stopped = true;
          return;
        }
        if (data.stamp) {
          if (stamp.current !== null && stamp.current !== data.stamp) router.refresh();
          stamp.current = data.stamp;
        }
        if (!res.ok || data.ok === false) setState({ kind: "error", message: data.error ?? "the mailbox couldn't be read." });
        else if (data.skipped === "not_configured") setState({ kind: "off" });
        else setState((prev) => ({ kind: "ok", checkedAt: data.checkedAt ?? null, imported: (prev.kind === "ok" ? prev.imported : 0) + (data.imported ?? 0) }));
      } catch {
        if (!stopped) setState({ kind: "error", message: "no connection to the server. Retrying." });
      } finally {
        inFlight = false;
        schedule();
      }
    }

    const onVisible = () => {
      if (document.visibilityState === "visible") check();
      else clearTimeout(timer);
    };

    check();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", check);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", check);
    };
  }, [router, standDown]);

  if (quiet) return null;

  const text =
    state.kind === "checking"
      ? "Checking the mailbox…"
      : state.kind === "ok"
        ? `Mailbox checked${state.checkedAt ? ` at ${time(state.checkedAt)}` : ""}. New email appears here automatically while this page is open.${state.imported ? ` ${state.imported} new since you opened it.` : ""}`
        : state.kind === "off"
          ? "The mailbox isn't connected, so only website messages appear here. See Settings."
          : `Mailbox check failed: ${state.message}`;

  return (
    // Only problems are announced; the regular "checked at" update would be read out every 30 seconds.
    <p role={state.kind === "error" || state.kind === "off" ? "alert" : undefined} className={`text-[13px] ${state.kind === "error" || state.kind === "off" ? "text-[#7A2E24]" : "text-charcoal-mute"}`}>
      {text}
    </p>
  );
}
