import type { MetadataRoute } from "next";
import { NAV, SITE } from "@/lib/site";
import { ROOMS } from "@/lib/rooms";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = NAV.map((n) => ({
    url: `${SITE.url}${n.href}`,
    lastModified: now,
    changeFrequency: n.href === "/" ? "weekly" : "monthly",
    priority: n.href === "/" ? 1 : n.href === "/rooms" || n.href === "/groups" ? 0.9 : 0.7,
  }));
  const rooms: MetadataRoute.Sitemap = ROOMS.map((r) => ({
    url: `${SITE.url}/rooms/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...pages, ...rooms];
}
