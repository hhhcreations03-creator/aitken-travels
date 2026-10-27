import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin | The Lavish Haven" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F3F1EC]">{children}</div>;
}
