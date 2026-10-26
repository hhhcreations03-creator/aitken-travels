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
