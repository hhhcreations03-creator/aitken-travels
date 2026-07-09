import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | Aitken Travels",
  description:
    "Read the terms and conditions for using Aitken Travels\u2019 transport and rental services across Sri Lanka, including booking, cancellation, payment, and vehicle rental policies.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Aitken Travels",
    description:
      "Terms and conditions for Aitken Travels\u2019 transport, vehicle rental, airport transfer, and tour services across Sri Lanka.",
    type: "website",
    siteName: "Aitken Travels",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing our website or using any of our services — including vehicle rentals, airport transfers, tours, and day excursions — you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.

These terms apply to all users, including travellers, customers, and website visitors.`,
  },
  {
    title: "2. Services",
    content: `Aitken Travels provides transport and travel-related services across Sri Lanka, including but not limited to:

- Airport transfers (pickup and drop-off at Bandaranaike International Airport)
- Round island tours with professional drivers
- Day excursions to popular destinations
- Self-drive vehicle rentals (cars, vans, motorbikes, scooters, and tuk-tuks)
- Accommodation arrangement assistance

All services are subject to availability and may vary based on season, demand, and location.`,
  },
  {
    title: "3. Booking & Confirmation",
    content: `- Bookings can be made through our website, WhatsApp (+94 77 081 3690), or email (travelsaitken@gmail.com).
- A booking is confirmed only after you receive written confirmation from our team via email or WhatsApp.
- We reserve the right to decline or modify a booking based on vehicle availability, route conditions, or safety concerns.
- Booking details (dates, destinations, vehicle type) should be verified by the customer before confirmation.`,
  },
  {
    title: "4. Pricing & Payment",
    content: `- All prices quoted are in US Dollars (USD) unless stated otherwise.
- Prices are subject to change based on fuel costs, seasonal demand, and route distance.
- **Fuel costs are not included** in the vehicle rental or tour price unless explicitly stated.
- Payment methods include bank transfer and cash. Specific payment terms will be communicated at the time of booking confirmation.
- No upfront payment is required for initial booking inquiries. Payment details will be discussed after booking confirmation.`,
  },
  {
    title: "5. Cancellation & Refund Policy",
    content: `- **Free cancellation**: Bookings can be cancelled free of charge up to **48 hours** before the scheduled pickup time.
- **Late cancellation**: Cancellations made less than 48 hours before pickup may incur a cancellation fee of up to 50% of the booking value.
- **No-shows**: If you fail to appear at the scheduled pickup location without prior notice, the full booking amount may be charged.
- **Refunds**: Approved refunds will be processed within 7\u201314 business days via the original payment method.
- **Changes**: Date, destination, or vehicle changes can be requested at any time subject to availability. We will accommodate changes wherever possible at no extra charge.`,
  },
  {
    title: "6. Vehicle Rental Terms",
    content: `**For chauffeur-driven vehicles:**
- All vehicles come with a professional, licensed driver.
- The driver\u2019s accommodation and meals during multi-day tours are the responsibility of Aitken Travels.
- Customers must treat the vehicle and driver with respect.

**For self-drive rentals (cars, bikes, tuk-tuks):**
- A valid driving licence is required. Foreign nationals must obtain a Temporary Driving Licence from the AAC (Automobile Association of Ceylon) \u2014 we assist with the application. The AAC fee of $42 is added during booking.
- Renters are responsible for traffic violations, parking fines, and toll charges incurred during the rental period.
- Vehicles must be returned in the same condition as received. Any damage beyond normal wear and tear will be charged to the customer.
- Comprehensive insurance is included with all rentals, but does not cover damage caused by negligence, drunk driving, or unauthorised off-road use.
- Fuel costs are the responsibility of the renter.`,
  },
  {
    title: "7. Customer Responsibilities",
    content: `- Customers must provide accurate personal information, travel details, and contact details at the time of booking.
- Customers are responsible for ensuring they have valid travel documents (passport, visa) for entry into Sri Lanka.
- Customers must arrive at the agreed pickup location on time. Aitken Travels is not liable for delays caused by the customer.
- Customers must comply with Sri Lankan traffic laws and regulations when using self-drive rental vehicles.
- Any illegal activities conducted using our vehicles will result in immediate termination of service and may be reported to local authorities.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `- Aitken Travels will make every effort to provide safe, reliable, and comfortable transport services. However, we are not liable for:
  - Delays caused by traffic, road conditions, weather, or events beyond our control (force majeure).
  - Loss or damage to personal belongings left in the vehicle.
  - Injuries or accidents caused by the customer\u2019s own negligence while using self-drive vehicles.
  - Service disruptions caused by natural disasters, strikes, government restrictions, or pandemics.
- Our total liability for any claim shall not exceed the total amount paid by the customer for the specific booking in question.`,
  },
  {
    title: "9. Intellectual Property",
    content: `All content on this website \u2014 including text, images, logos, design elements, and code \u2014 is the property of Aitken Travels or its licensors and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or use any content from this website without prior written permission.`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.`,
  },
  {
    title: "11. Changes to These Terms",
    content: `We reserve the right to update or modify these Terms and Conditions at any time. Changes will be posted on this page with a revised date. Continued use of our services after any changes constitutes acceptance of the updated terms.`,
  },
  {
    title: "12. Contact Us",
    content: `If you have any questions about these Terms and Conditions, please contact us:

- **Email**: travelsaitken@gmail.com
- **WhatsApp**: +94 77 081 3690
- **Location**: Galle, Sri Lanka`,
  },
];

export default function TermsPage() {
  return (
    <>
      <nav className="bg-slate-900 py-4 px-6 md:px-10 lg:px-16 2xl:px-24">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center min-h-[44px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Aitken Travels - Home" className="h-40 md:h-44 w-auto object-contain" />
          </Link>
          <Link href="/" className="text-[13px] text-white/70 hover:text-white transition-colors min-h-[44px] flex items-center">
            &larr; Back to home
          </Link>
        </div>
      </nav>

      <main className="min-h-screen bg-[#FFFBF5]">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="mb-12">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary-700 font-semibold mb-3">Legal</div>
            <h1 className="font-display text-[36px] md:text-[48px] font-bold text-slate-900 leading-tight">Terms &amp; Conditions</h1>
            <p className="text-[15px] text-slate-500 mt-3">Last updated: June 2025</p>
            <p className="text-[15px] text-slate-600 mt-6 leading-relaxed">
              Please read these Terms and Conditions carefully before using any services provided by Aitken Travels (Pvt) Ltd (&ldquo;Aitken Travels&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a transport and travel company registered in Galle, Sri Lanka.
            </p>
          </div>

          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-[22px] font-semibold text-slate-900 mb-4">{s.title}</h2>
                <div className="text-[15px] text-slate-600 leading-[1.8] whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: s.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
