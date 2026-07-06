import type { Metadata } from "next";
import { MaxCard } from "./MaxCard";

export const metadata: Metadata = {
  title: "Max Amarasinghe | Chief Travel Designer — Aitken Travels",
  description:
    "Connect with Max Amarasinghe, Chief Travel Designer at Aitken Travels. Plan your perfect Sri Lanka journey with personalized service.",
  alternates: {
    canonical: "/max",
  },
  openGraph: {
    title: "Max Amarasinghe — Chief Travel Designer",
    description: "Aitken Travels · Galle, Sri Lanka · Plan your perfect Sri Lanka journey",
    type: "profile",
    url: "https://aitkentravel.com/max",
    images: [
      {
        url: "https://aitkentravel.com/team/max-og.jpg",
        width: 1200,
        height: 630,
        alt: "Max Amarasinghe — Chief Travel Designer at Aitken Travels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Max Amarasinghe — Chief Travel Designer",
    description: "Aitken Travels · Galle, Sri Lanka",
    images: ["https://aitkentravel.com/team/max-og.jpg"],
  },
};

export default function MaxPage() {
  return <MaxCard />;
}
