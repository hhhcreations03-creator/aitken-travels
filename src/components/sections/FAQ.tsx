"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "How do I book a vehicle with Aitken Travels?",
    a: "You can book through our website by clicking the \"Book a vehicle\" button, or reach us directly via WhatsApp at +94 77 081 3690. Simply share your travel dates, destinations, and group size — we\u2019ll respond within 1 hour with a tailored recommendation.",
  },
  {
    q: "Do I need to pay upfront when booking?",
    a: "No upfront payment is required to make a booking inquiry. We\u2019ll confirm your vehicle and driver first, then discuss payment details. We offer flexible payment options including bank transfer and cash on arrival.",
  },
  {
    q: "Can I cancel or change my booking?",
    a: "Yes, we offer free cancellation up to 48 hours before your scheduled pickup. Changes to dates, destinations, or vehicle type can be made at any time — just contact us via WhatsApp or email and we\u2019ll adjust your booking.",
  },
  {
    q: "What types of vehicles do you offer?",
    a: "We have a fleet of 50+ vehicles including sedan cars, luxury sedans, flat roof vans, high roof vans, Rosa buses, luxury coaches, scooters, Royal Enfield motorbikes, and tuk-tuks (including cabrio/convertible models). All vehicles are well-maintained, insured, and air-conditioned where applicable.",
  },
  {
    q: "Are your drivers experienced and English-speaking?",
    a: "All our drivers are vetted, licensed professionals with years of experience navigating Sri Lanka\u2019s roads. Most speak English and many are multilingual. They double as local guides — they know the best routes, rest stops, and hidden gems across the island.",
  },
  {
    q: "Do you provide airport pickup and drop-off?",
    a: "Yes, we offer 24/7 airport transfer services at Bandaranaike International Airport (CMB). Our drivers track your flight in real time and will be waiting at the arrivals hall — even if your flight is delayed. Meet-and-greet service with a name board is included.",
  },
  {
    q: "Do I need a special license to rent a vehicle in Sri Lanka?",
    a: "Foreign nationals need a Temporary Driving Licence to drive in Sri Lanka. We handle the entire application process for you through the AAC (Automobile Association of Ceylon). The AAC charges a $42 fee which is added during booking.",
  },
  {
    q: "Can you help arrange accommodation?",
    a: "Absolutely! During the booking process, you can indicate that you need accommodation and we\u2019ll help find the best options — from budget guesthouses to luxury resorts — based on your preferences, budget, and destinations.",
  },
  {
    q: "Which areas of Sri Lanka do you cover?",
    a: "We provide island-wide coverage across all nine provinces. From Jaffna in the north to Mirissa in the south, Colombo to Trincomalee — we operate everywhere. Popular routes include Colombo, Sigiriya, Kandy, Ella, Galle, Yala, Nuwara Eliya, and Bentota.",
  },
  {
    q: "What\u2019s included in the vehicle rental price?",
    a: "For chauffeur-driven vehicles: professional driver, vehicle insurance, GPS navigation, bottled water, and 24/7 phone support. For self-drive rentals (bikes, tuk-tuks): vehicle insurance, safety gear, 24/7 roadside assistance, GPS, and flexible pickup/drop-off. Fuel costs are not included.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-[80px] md:py-[120px] px-6 md:px-10 lg:px-16 2xl:px-24 bg-gradient-to-b from-white to-primary-50/30">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-700">
              FAQ
            </span>
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-600 to-primary-400" />
          </div>
          <h2 className="font-display font-bold text-[clamp(32px,4.5vw,48px)] leading-[1.08] text-slate-900">
            Frequently asked{" "}
            <span className="gradient-text-accent">questions</span>
          </h2>
          <p className="text-[15px] text-slate-500 mt-3 max-w-[460px] mx-auto leading-relaxed">
            Everything you need to know about travelling with Aitken Travels.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white border-primary-200 shadow-elevation-1"
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer min-h-[56px]"
                >
                  <span className={`font-display text-[16px] md:text-[17px] font-semibold leading-snug transition-colors ${
                    isOpen ? "text-primary-800" : "text-slate-800"
                  }`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isOpen ? "bg-primary-600 text-white rotate-45" : "bg-slate-100 text-slate-500"
                  }`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                        <p className="text-[14px] md:text-[15px] text-slate-600 leading-[1.7]">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="text-[15px] text-slate-500 mb-4">Still have questions?</p>
          <a
            href="https://wa.me/94770813690?text=Hi%20Aitken%20Travels!%20I%20have%20a%20question%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer min-h-[48px]"
          >
            Chat with us on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
