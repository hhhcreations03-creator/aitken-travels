"use client";

import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Hero } from "@/components/sections/Hero";
import { SearchSection } from "@/components/sections/BookingBar";
import { Marquee } from "@/components/sections/Marquee";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Experiences";
import { Fleet } from "@/components/sections/Tours";
import { SriLankaMap } from "@/components/sections/SriLankaMap";
import { TourGallery } from "@/components/sections/TourGallery";
import { WhyAitken } from "@/components/sections/WhyAitken";
import { Testimonials } from "@/components/sections/Testimonials";
import { Offers } from "@/components/sections/Offers";
import { Stories } from "@/components/sections/Stories";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Footer } from "@/components/Footer";
import { BookingFlow } from "@/components/modals/BookingFlow";
import { VehicleDetail } from "@/components/modals/TourDetail";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Vehicle } from "@/lib/data";

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState<Vehicle | null>(null);
  const [prefillVehicle, setPrefillVehicle] = useState<Vehicle | null>(null);

  const onOpenBooking = (vehicle?: Vehicle) => {
    setPrefillVehicle(vehicle || null);
    setBookingOpen(true);
  };

  return (
    <>
      <TopNav onOpenBooking={() => onOpenBooking()} />

      <main>
        <Hero onOpenBooking={() => onOpenBooking()} />
        <SearchSection onOpenBooking={() => onOpenBooking()} />
        <Marquee />
        <Intro />
        <Services />
        <Fleet onOpenVehicle={setVehicleOpen} />
        <SriLankaMap onOpenBooking={() => onOpenBooking()} />
        <TourGallery />
        <WhyAitken />
        <Testimonials />
        <Offers />
        <Stories />
        <ClosingCTA onOpenBooking={() => onOpenBooking()} />
      </main>

      <Footer />

      <WhatsAppButton />

      <BookingFlow
        open={bookingOpen}
        onClose={() => {
          setBookingOpen(false);
          setPrefillVehicle(null);
        }}
        prefillVehicle={prefillVehicle}
      />
      <VehicleDetail
        vehicle={vehicleOpen}
        open={!!vehicleOpen}
        onClose={() => setVehicleOpen(null)}
        onBook={() => {
          const v = vehicleOpen;
          setVehicleOpen(null);
          onOpenBooking(v || undefined);
        }}
      />
    </>
  );
}
