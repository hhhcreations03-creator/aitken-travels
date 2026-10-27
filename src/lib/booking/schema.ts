import "server-only";
import { db } from "./db";
import { ROOMS } from "@/lib/rooms";

/**
 * Database schema. Applied automatically and idempotently on first use, so a
 * fresh Neon database needs no manual migration step. Bump SCHEMA_VERSION and
 * append to MIGRATIONS for future changes; never edit an applied migration.
 */
const MIGRATIONS: string[] = [
  `
  CREATE TABLE IF NOT EXISTS room_types (
    slug        text PRIMARY KEY,
    units       integer NOT NULL DEFAULT 1 CHECK (units >= 0 AND units <= 50),
    max_guests  integer NOT NULL DEFAULT 2 CHECK (max_guests >= 1 AND max_guests <= 20),
    nightly_rate numeric(10,2) CHECK (nightly_rate IS NULL OR nightly_rate >= 0),
    active      boolean NOT NULL DEFAULT true,
    sort_order  integer NOT NULL DEFAULT 0,
    updated_at  timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ref           text NOT NULL UNIQUE,
    room_slug     text NOT NULL REFERENCES room_types(slug),
    check_in      date NOT NULL,
    check_out     date NOT NULL,
    rooms         integer NOT NULL DEFAULT 1 CHECK (rooms BETWEEN 1 AND 20),
    adults        integer NOT NULL CHECK (adults BETWEEN 1 AND 60),
    children      integer NOT NULL DEFAULT 0 CHECK (children BETWEEN 0 AND 60),
    guest_name    text NOT NULL,
    email         text NOT NULL,
    phone         text NOT NULL,
    country       text,
    arrival_time  text,
    requests      text,
    status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','checked_in','completed','cancelled','declined')),
    source        text NOT NULL DEFAULT 'website',
    quoted_total  numeric(12,2),
    currency      text NOT NULL DEFAULT 'USD',
    internal_notes text,
    guest_token_hash text,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    CHECK (check_out > check_in)
  );
  CREATE INDEX IF NOT EXISTS bookings_room_dates ON bookings (room_slug, check_in, check_out);
  CREATE INDEX IF NOT EXISTS bookings_status ON bookings (status);
  CREATE INDEX IF NOT EXISTS bookings_created ON bookings (created_at DESC);

  CREATE TABLE IF NOT EXISTS booking_events (
    id          bigserial PRIMARY KEY,
    booking_id  uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    at          timestamptz NOT NULL DEFAULT now(),
    actor       text NOT NULL,
    action      text NOT NULL,
    detail      text
  );
  CREATE INDEX IF NOT EXISTS booking_events_booking ON booking_events (booking_id, at);

  CREATE TABLE IF NOT EXISTS ical_feeds (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_slug   text NOT NULL REFERENCES room_types(slug) ON DELETE CASCADE,
    name        text NOT NULL,
    url         text NOT NULL,
    last_synced_at timestamptz,
    last_error  text,
    event_count integer NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS blocks (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_slug   text NOT NULL REFERENCES room_types(slug) ON DELETE CASCADE,
    start_date  date NOT NULL,
    end_date    date NOT NULL,
    units       integer NOT NULL DEFAULT 1 CHECK (units >= 1),
    reason      text,
    source      text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','ical')),
    feed_id     uuid REFERENCES ical_feeds(id) ON DELETE CASCADE,
    external_uid text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    CHECK (end_date > start_date)
  );
  CREATE INDEX IF NOT EXISTS blocks_room_dates ON blocks (room_slug, start_date, end_date);

  CREATE TABLE IF NOT EXISTS settings (
    key   text PRIMARY KEY,
    value text NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rate_limits (
    bucket text NOT NULL,
    at     timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS rate_limits_bucket ON rate_limits (bucket, at);
  `,
];

export const SCHEMA_VERSION = MIGRATIONS.length;

/** Guests a room sleeps, derived from its published bed configuration. Editable in admin. */
export function defaultMaxGuests(beds: string): number {
  let n = 0;
  const re = /(\d+)\s+(king|queen|double|full|single|twin|sofa)/gi;
  for (let m = re.exec(beds); m; m = re.exec(beds)) {
    const count = Number(m[1]);
    const kind = m[2].toLowerCase();
    n += count * (kind === "single" || kind === "twin" || kind === "sofa" ? 1 : 2);
  }
  return Math.max(1, n || 2);
}

let ready: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const d = await db();
      await d.query(`CREATE TABLE IF NOT EXISTS schema_version (version integer NOT NULL)`);
      const rows = await d.query<{ version: number }>(`SELECT version FROM schema_version LIMIT 1`);
      const current = rows[0]?.version ?? 0;
      for (let v = current; v < MIGRATIONS.length; v++) {
        for (const statement of MIGRATIONS[v].split(/;\s*\n/).map((x) => x.trim()).filter(Boolean)) await d.query(statement);
        if (v === 0 && current === 0) await d.query(`INSERT INTO schema_version (version) VALUES (1)`);
        else await d.query(`UPDATE schema_version SET version = $1`, [v + 1]);
      }
      // Make sure every room type in src/lib/rooms.ts has a row.
      for (let i = 0; i < ROOMS.length; i++) {
        const room = ROOMS[i];
        await d.query(
          `INSERT INTO room_types (slug, max_guests, sort_order) VALUES ($1, $2, $3)
           ON CONFLICT (slug) DO UPDATE SET sort_order = EXCLUDED.sort_order`,
          [room.slug, defaultMaxGuests(room.beds), i]
        );
      }
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}
