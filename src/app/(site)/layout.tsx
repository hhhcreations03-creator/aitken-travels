import { Footer } from "@/components/Footer";
import { MobileDock } from "@/components/MobileDock";
import { ROOMS } from "@/lib/rooms";

const DOCK_ROOMS = ROOMS.map(({ slug, name, sizeSqm, beds }) => ({ slug, name, sizeSqm, beds }));

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
      <MobileDock rooms={DOCK_ROOMS} />
    </>
  );
}
