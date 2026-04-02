import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const fallbackDevDatabaseUrl = "postgresql://localhost:5432/postgres";
const databaseUrl = process.env.DATABASE_URL ?? fallbackDevDatabaseUrl;

if (!process.env.DATABASE_URL) {
  console.warn(
    `[db] DATABASE_URL is not set. Falling back to ${fallbackDevDatabaseUrl} for local startup.`
  );
}

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle database client", err);
});

export const db = drizzle(pool, { schema });
