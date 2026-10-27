import "server-only";

/**
 * Minimal Postgres access layer.
 *
 * Production: Neon serverless Postgres over HTTPS (DATABASE_URL or POSTGRES_URL,
 * as set by the Vercel Neon integration).
 * Local development and tests: set DATABASE_URL=pglite:./.data/pglite to run an
 * embedded Postgres with no server.
 */

export interface Query {
  text: string;
  params?: unknown[];
}

type Row = Record<string, unknown>;

interface Driver {
  query<T extends Row = Row>(text: string, params?: unknown[]): Promise<T[]>;
  /** Runs queries in one transaction and returns each query's rows. */
  transaction(queries: Query[]): Promise<Row[][]>;
}

export function databaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

let driverPromise: Promise<Driver> | null = null;

async function createDriver(): Promise<Driver> {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is not set");

  if (url.startsWith("pglite:")) {
    const { PGlite } = await import("@electric-sql/pglite");
    const dir = url.slice("pglite:".length) || undefined;
    const pg = new PGlite(dir === "memory" ? undefined : dir);
    await pg.waitReady;
    return {
      async query(text, params = []) {
        const res = await pg.query(text, params);
        return res.rows as never;
      },
      async transaction(queries) {
        return pg.transaction(async (tx) => {
          const out: Row[][] = [];
          for (const q of queries) out.push((await tx.query(q.text, q.params ?? [])).rows as Row[]);
          return out;
        });
      },
    };
  }

  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(url);
  return {
    async query(text, params = []) {
      return (await sql.query(text, params)) as never;
    },
    async transaction(queries) {
      return (await sql.transaction(queries.map((q) => sql.query(q.text, q.params ?? [])))) as Row[][];
    },
  };
}

export function db(): Promise<Driver> {
  if (!driverPromise) driverPromise = createDriver().catch((e) => {
    driverPromise = null;
    throw e;
  });
  return driverPromise;
}
