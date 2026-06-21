import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// MobileToolsBox connects to a standard PostgreSQL database via DATABASE_URL.
// This is designed to point at a Supabase Postgres instance (see env template),
// but works with any Postgres. The `pg` driver + SSL settings below are what
// Supabase expects.
//
// Note: we intentionally do NOT fall back to a silent mock database. A missing
// or broken connection should fail loudly at startup rather than quietly
// returning empty data and masking a misconfiguration in production.

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is not set. In production this is required — set it to your " +
      "Supabase connection string (Project Settings > Database > Connection String)."
    );
  }
  // In development, still throw, but with a friendlier hint. Persistence-backed
  // features cannot work without a real database, and a mock just hides bugs.
  throw new Error(
    "DATABASE_URL is not set. Create a .env file with your Supabase connection " +
    "string to run the app locally. See env.production.template for the format."
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase requires SSL. rejectUnauthorized:false avoids cert-chain issues
  // with Supabase's pooler while still encrypting the connection.
  ssl: { rejectUnauthorized: false },
  // Supabase connection pooler has limits; keep the client pool modest so a
  // single VPS process doesn't exhaust available connections.
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Surface connection errors instead of letting them crash silently.
pool.on("error", (err: Error) => {
  console.error("[db] Unexpected error on idle PostgreSQL client:", err.message);
});

const db = drizzle({ client: pool, schema });

export { pool, db };
