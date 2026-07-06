import type { Metadata } from "next";
import { MaxCard } from "./MaxCard";

export const metadata: Metadata = {
  title: "Max Amarasinghe | Chief Travel Designer — Aitken Travels",
  description:
    "Connect with Max Amarasinghe, Chief Travel Designer at Aitken Travels. Plan your perfect Sri Lanka journey with personalized service.",
  openGraph: {
    title: "Max Amarasinghe — Aitken Travels",
    description: "Chief Travel Designer | Plan your Sri Lanka journey",
    type: "profile",
    images: ["/team/max.JPG"],
  },
};

export default function MaxPage() {
  return <MaxCard />;
}
