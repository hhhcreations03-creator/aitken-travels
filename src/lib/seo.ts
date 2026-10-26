import type { Metadata } from "next";
import { SITE } from "./site";

interface PageMetaInput {
  /** Full page title as it should appear in search results (no template is applied). */
  title: string;
  /** 120 to 155 characters reads best in Google results. */
  description: string;
  /** Path beginning with "/", used for the canonical URL and og:url. */
  path: string;
  /** Social preview image path under /public, 1200x630 JPEG. */
  image?: string;
  imageAlt?: string;
  /** Shorter title for social cards; defaults to `title`. */
  socialTitle?: string;
  noindex?: boolean;
}

/** Bump `v` whenever og.jpg changes so WhatsApp and Facebook fetch the new image. */
export const DEFAULT_OG_IMAGE = "/og.jpg?v=2";

export function pageMeta({ title, description, path, image = DEFAULT_OG_IMAGE, imageAlt, socialTitle, noindex }: PageMetaInput): Metadata {
  const alt = imageAlt ?? `${SITE.name}, boutique hotel in Ahangama, Sri Lanka`;
  const ogTitle = socialTitle ?? title;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: SITE.name,
      url: path,
      title: ogTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt, type: "image/jpeg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [{ url: image, alt }],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
