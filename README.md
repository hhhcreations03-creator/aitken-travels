# The Lavish Haven, Ahangama

Boutique hotel website for The Lavish Haven, 166/2 Welhengoda Road, Ahangama, Sri Lanka.
Built with Next.js 14 (App Router), TypeScript and Tailwind CSS. Deployed on Vercel.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Content

- `src/lib/rooms.ts` is the single source for room names, sizes, beds, views and photos.
- `src/lib/gallery.ts` lists the gallery categories and images.
- `src/lib/site.ts` holds contact details, navigation and WhatsApp helpers.
- `src/app/about/page.tsx` has an editable `STORY` block for the brand story.
- Photos live in `public/images/<category>/` as WebP (max 2048px wide).
- Logo assets live in `public/brand/` (`logo.svg`, `logo-light.svg`, `logo-mark.svg`).

## Enquiries

Forms post to `/api/enquiry`, which sends email through SMTP when `SMTP_USER` and
`SMTP_PASS` are set. Without them the API answers 503 and the form offers a prefilled
WhatsApp or email handoff instead, so visitors are never shown a false "sent" message.
See `.env.example`.

## Online booking

Guests book at `/book`: they check live availability, choose a room and send a
booking request. The room is held as "Awaiting confirmation" until the team
confirms it in the admin area at `/admin`. No payment is taken online.

How it works:

- **Inventory.** Each room type has a number of physical rooms (set in Admin, then
  Rooms & rates). Availability is checked night by night against bookings that hold
  inventory (awaiting confirmation, confirmed, checked in), closed dates and
  imported calendars. Check-out day is free for the next arrival.
- **No double booking.** The final check and the insert run in one database
  transaction behind a per-room-type lock (`src/lib/booking/bookings.ts`).
- **Channels.** Admin, then Closures & sync, imports iCal calendars from
  Booking.com or Airbnb per room type and gives private export links for them.
  Imported calendars refresh during guest searches (every 15 minutes at most) and
  daily through Vercel Cron.
- **Guests** get a reference and a private link (`/booking/<ref>?t=…`) to check
  status or cancel. Emails go out when SMTP is configured; otherwise the admin
  contacts guests by WhatsApp or email links on each booking.
- **Security.** Admin pages are protected by middleware and checked again in every
  server action. Passwords use scrypt; sessions are HMAC-signed, httpOnly cookies
  that last 12 hours. Logins, searches and booking requests are rate limited, and
  bot submissions are filtered by a honeypot and a timing check.

Without `DATABASE_URL` the `/book` page falls back to the enquiry form, so the site
works before the database is connected.

### Setup on Vercel

1. In the Vercel project, open **Storage** and create a **Neon** Postgres
   database, connected to Production. This adds `DATABASE_URL`. Tables are created
   automatically on first use.
2. Run `npm run admin:password` locally. Add its output, plus `ADMIN_EMAIL`, under
   **Settings**, then **Environment Variables**.
3. Optional: add `SMTP_USER` and `SMTP_PASS` for booking emails.
4. Redeploy, sign in at `/admin`, and set the number of rooms per type under
   **Rooms & rates**. Every type starts at one room.

### Local development

```bash
echo "DATABASE_URL=pglite:./.data/pglite" >> .env.local   # embedded Postgres, no server
npm run admin:password                                     # then add ADMIN_EMAIL and the output to .env.local
npm run dev
```
