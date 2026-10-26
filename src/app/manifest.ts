import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Lavish Haven, Ahangama",
    short_name: "Lavish Haven",
    description: "Boutique hotel in Ahangama, Sri Lanka, two minutes' walk from Kabalana Beach.",
    start_url: "/",
    display: "browser",
    background_color: "#EFE3CD",
    theme_color: "#1E3A2F",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
