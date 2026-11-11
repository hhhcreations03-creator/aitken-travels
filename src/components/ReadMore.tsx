"use client";

import { useState, type ReactNode } from "react";

/**
 * Phones only: keeps longer passages folded behind a "Read more" link so a
 * section costs one idea, not a screen of text. Tablets and desktops always
 * show everything, and the text stays in the page for search engines.
 */
export function ReadMore({ children, label = "Read more" }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={open ? "" : "max-md:hidden"}>{children}</div>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} className="textlink mt-5 text-[14.5px] md:hidden">
          {label}
        </button>
      )}
    </>
  );
}
