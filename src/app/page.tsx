"use client";

import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Hero } from "@/components/sections/Hero";
import { SearchSection, SearchData } from "@/components/sections/BookingBar";
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
import { FAQ } from "@/components/sections/FAQ";
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
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const onOpenBooking = (vehicle?: Vehicle) => {
    setPrefillVehicle(vehicle || null);
    setSearchData(null);
    setBookingOpen(true);
  };

  const onSearch = (data: SearchData) => {
    setSearchData(data);
    setPrefillVehicle(null);
    setBookingOpen(true);
  };

  return (
    <>
      <TopNav onOpenBooking={() => onOpenBooking()} />

      <main>
        <Hero onOpenBooking={() => onOpenBooking()} />
        <SearchSection onSearch={onSearch} />
        <Marquee />
        <Intro />
        <Services onBookService={(serviceId: string) => {
          const serviceMap: Record<string, string> = {
            "airport-transfers": "Airport Transfer",
            "round-tours": "Round Island Tour",
            "day-trips": "Day Excursion",
            "self-drive": "Vehicle Rental",
          };
          onSearch({ service: serviceMap[serviceId] || "", vehicle: "", date: "", pickup: "" });
        }} />
        <Fleet onOpenVehicle={setVehicleOpen} />
        <SriLankaMap onOpenBooking={() => onOpenBooking()} />
        <TourGallery />
        <WhyAitken />
        <Testimonials onOpenBooking={() => onOpenBooking()} />
        <Offers onApplyOffer={(offerIndex: number) => {
          // Offer 0 = 15% off multi-day (Round Tour), Offer 1 = Free meet & greet (Airport Transfer)
          const serviceMap = ["Round Island Tour", "Airport Transfer"];
          onSearch({
            service: serviceMap[offerIndex] || "",
            vehicle: "",
            date: "",
            pickup: offerIndex === 1 ? "Airport (CMB)" : "",
          });
        }} />
        <Stories />
        <FAQ />
        <ClosingCTA onOpenBooking={() => onOpenBooking()} />
      </main>

      <Footer />

      <WhatsAppButton />

      <BookingFlow
        open={bookingOpen}
        onClose={() => {
          setBookingOpen(false);
          setPrefillVehicle(null);
          setSearchData(null);
        }}
        prefillVehicle={prefillVehicle}
        prefillSearch={searchData}
      />
      <VehicleDetail
        vehicle={vehicleOpen}
        open={!!vehicleOpen}
        onClose={() => setVehicleOpen(null)}
        onBook={() => {
          const v = vehicleOpen;
          setVehicleOpen(null);
          if (v) {
            // Detect service based on vehicle category
            const selfDrive = ["Scooter", "Royal Enfield", "Tuk-Tuk"];
            const serviceName = selfDrive.includes(v.category) ? "Vehicle Rental" : "Round Island Tour";
            onSearch({
              service: serviceName,
              vehicle: v.name,
              date: "",
              pickup: "",
            });
          }
        }}
      />
    </>
  );
}
