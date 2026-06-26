import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Aitken Travels",
  description: "Learn how Aitken Travels collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: `When you use our services or visit our website, we may collect the following types of personal information:

- **Contact details**: Full name, email address, phone number, and country of residence.
- **Booking information**: Travel dates, destinations, vehicle preferences, number of passengers, flight details, and accommodation preferences.
- **Communication data**: Messages sent via our website contact form, WhatsApp, or email.
- **Technical data**: IP address, browser type, device information, and pages visited on our website (collected automatically through cookies and analytics tools).
- **Payment information**: Payment method details when processing bookings (handled securely through third-party payment providers — we do not store your card details).`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your personal information for the following purposes:

- **Processing bookings**: To arrange vehicle rentals, airport transfers, tours, and accommodation as requested.
- **Communication**: To respond to inquiries, confirm bookings, send itinerary details, and provide customer support via email and WhatsApp.
- **Service improvement**: To analyse website usage and improve our services, user experience, and marketing efforts.
- **Legal compliance**: To comply with applicable laws, regulations, and legal obligations in Sri Lanka.
- **Marketing**: To send you promotional offers, travel tips, and newsletters — only if you have opted in. You can unsubscribe at any time.`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your data only in the following circumstances:

- **Service providers**: With trusted partners such as drivers, accommodation providers, and payment processors who assist in fulfilling your booking.
- **Legal requirements**: When required by law, court order, or government regulation.
- **Business transfers**: In the event of a merger, acquisition, or sale of business assets.

All third-party partners are required to maintain the confidentiality and security of your information.`,
  },
  {
    title: "4. Data Security",
    content: `We take reasonable measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. These measures include:

- Secure HTTPS encryption on our website.
- Restricted access to personal data within our team.
- Regular review of our data collection and storage practices.

However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "5. Cookies",
    content: `Our website uses cookies and similar technologies to enhance your browsing experience, analyse site traffic, and personalise content. You can control cookie preferences through your browser settings.

Types of cookies we use:
- **Essential cookies**: Required for the website to function properly.
- **Analytics cookies**: Help us understand how visitors interact with our website (e.g., Google Analytics).
- **Marketing cookies**: Used to deliver relevant advertisements and track campaign performance.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to:

- **Access**: Request a copy of the personal data we hold about you.
- **Correction**: Ask us to correct any inaccurate or incomplete information.
- **Deletion**: Request that we delete your personal data, subject to legal obligations.
- **Opt-out**: Unsubscribe from marketing communications at any time.

To exercise any of these rights, please contact us at **travelsaitken@gmail.com**.`,
  },
  {
    title: "7. Third-Party Links",
    content: `Our website may contain links to third-party websites (e.g., WhatsApp, Google Maps, Unsplash). We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.`,
  },
  {
    title: "8. Children\u2019s Privacy",
    content: `Our services are not directed at individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child without parental consent, we will take steps to delete it promptly.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated version will be posted on this page with a revised \u201cLast updated\u201d date. We encourage you to review this policy periodically.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us:

- **Email**: travelsaitken@gmail.com
- **WhatsApp**: +94 77 081 3690
- **Location**: Galle, Sri Lanka`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <nav className="bg-slate-900 py-4 px-6 md:px-10">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center min-h-[44px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Aitken Travels" className="h-32 md:h-44 w-auto object-contain" />
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
            <h1 className="font-display text-[36px] md:text-[48px] font-bold text-slate-900 leading-tight">Privacy Policy</h1>
            <p className="text-[15px] text-slate-500 mt-3">Last updated: June 2025</p>
            <p className="text-[15px] text-slate-600 mt-6 leading-relaxed">
              At Aitken Travels (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services.
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
