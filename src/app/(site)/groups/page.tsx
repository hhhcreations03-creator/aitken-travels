import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { GroupForm } from "@/components/forms/GroupForm";
import { GROUP_TYPES } from "@/lib/groups";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { whatsappUrl } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Group Stays & Retreats in Ahangama | The Lavish Haven",
  socialTitle: "Group Stays at The Lavish Haven",
  description: "Bring the whole group to Ahangama. Surf trips, yoga retreats, families and friends stay together around one pool. Send a group enquiry to the hotel team.",
  path: "/groups",
});

const WHY = [
  { h: "One house, one pool", p: "Rooms and suites on two floors look onto the same courtyard, so a group stays together without anyone being far from the action." },
  { h: "A mix of room types", p: "King rooms for couples, family suites with two beds, kitchenette rooms for the self-sufficient, and a two-bedroom suite for a small household." },
  { h: "Surf and yoga on the doorstep", p: "Kabalana Beach is a short walk away and yoga classes can be arranged at the house. Spa treatments on request." },
  { h: "Meals together", p: "The restaurant serves breakfast and an international menu, and can seat a group at one table." },
];

export default function GroupsPage() {
  const groupWhatsApp = whatsappUrl("Hello The Lavish Haven, I'm organising a group stay and would like to enquire.\n\nGroup type: \nEstimated guests: \nDates: \nRooms required: ");
  return (
    <>
      <Header overlay />
      <main id="main">
        <section className="relative overflow-hidden bg-forest text-ivory">
          <Image src="/images/property/pool-evening.webp" alt="The courtyard and pool in the blue hour, lit balconies on both floors" fill priority sizes="100vw" className="object-cover animate-fade" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/90 via-forest-deep/60 to-forest-deep/20" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest-deep/55 to-transparent" aria-hidden="true" />
          <div className="wrap relative flex min-h-[88svh] flex-col justify-end pb-14 pt-40 lg:pb-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="max-w-[40rem] animate-rise lg:col-span-8">
                <p className="font-display text-[1.1rem] italic text-sand">Groups & Events</p>
                <h1 className="display-xl mt-3">Take the whole house</h1>
                <p className="lede mt-6 !text-ivory/85 max-w-[40ch]">Surf crews, yoga retreats, families and friends travelling together. The Lavish Haven is built for groups who want to stay under one roof.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#group-enquiry" className="btn-ivory">Send a group enquiry</a>
                  <a href={groupWhatsApp} target="_blank" rel="noopener noreferrer" className="btn-outline-light">WhatsApp the team</a>
                </div>
              </div>
              <ul className="hidden gap-2 text-[14px] text-sand lg:col-span-4 lg:flex lg:flex-col lg:items-end">
                {GROUP_TYPES.slice(0, 4).map((t) => <li key={t} className="rounded-full border border-ivory/30 px-4 py-1.5">{t}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">Why groups choose the Haven</h2>
              <p className="lede mt-5">The hotel&rsquo;s rooms and suites sit around a single pool on Welhengoda Road, which makes it a natural base for a party that wants to be together.</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 grid gap-8 sm:grid-cols-2">
              {WHY.map((w) => (
                <div key={w.h} className="rule pt-5">
                  <h3 className="display-sm text-forest">{w.h}</h3>
                  <p className="body mt-2">{w.p}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section tone="deep" compact>
          <div className="grid gap-4 md:grid-cols-12">
            <ImageBlock src="/images/property/pool-daytime.webp" alt="The pool and balconies by day" aspect="aspect-[16/10]" sizes="(min-width: 768px) 66vw, 100vw" className="md:col-span-8" />
            <ImageBlock src="/images/property/lobby-lounge.webp" alt="Lounge seating in the lobby" aspect="aspect-[16/10] md:aspect-auto md:h-full" sizes="(min-width: 768px) 33vw, 100vw" className="md:col-span-4" />
            <ImageBlock src="/images/rooms/family-suite-balcony/two-beds-balcony.webp" alt="Family suite with two beds and a balcony" aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" className="md:col-span-4" />
            <ImageBlock src="/images/dining/restaurant-terrace.webp" alt="The open-air restaurant terrace" aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" className="md:col-span-4" />
            <ImageBlock src="/images/wellness/yoga-poolside.webp" alt="Yoga beside the pool" aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" className="md:col-span-4" />
          </div>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">Kinds of group stay</h2>
            </div>
            <dl className="lg:col-span-6 lg:col-start-7 grid gap-7">
              {[
                ["Surf retreat", "Early starts at Kabalana, rooms with patios for sandy feet, a pool to warm down in. Ask about help arranging lessons or boards locally."],
                ["Wellness retreat", "Yoga classes at the house, spa treatments on request, quiet rooms around the garden and a restaurant that caters to dietary needs."],
                ["Friends and family", "A mix of king rooms and family suites so couples, kids and grandparents each have their own space and one shared courtyard."],
                ["Organised group trip", "Tour groups, clubs and teams. Send numbers and dates and the team will propose a room plan and meal arrangements."],
              ].map(([k, v]) => (
                <div key={k} className="rule-soft pt-5">
                  <dt className="display-sm text-forest">{k}</dt>
                  <dd className="body mt-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="small mt-12 max-w-[64ch] text-charcoal-mute">Capacity, exclusive use, meal arrangements and rates are confirmed by the hotel team for each enquiry and each set of dates.</p>
        </Section>

        <Section tone="deep" id="group-enquiry">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="display-lg text-forest">Group enquiry</h2>
              <p className="lede mt-5">Tell us about the group and the team will come back with what the house can accommodate for your dates.</p>
              <p className="body mt-4">Prefer to talk it through? <a href={groupWhatsApp} target="_blank" rel="noopener noreferrer" className="textlink">WhatsApp the team</a> with your dates and numbers.</p>
              <div className="mt-8 hidden lg:block">
                <ImageBlock src="/images/property/aerial-pool-building.webp" alt="Aerial view of the hotel's green roofs and pool" aspect="aspect-[4/5]" sizes="30vw" />
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <GroupForm />
            </div>
          </div>
        </Section>

        <Section compact>
          <p className="body max-w-[60ch]">Looking for a single room instead? <Link href="/book" className="textlink">Check availability and book</Link>.</p>
        </Section>
      </main>
      <WhatsAppFloat />
    </>
  );
}
