import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE, PGPORT, PGSSL } = process.env;

export const pool = new Pool({
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  database: PGDATABASE,
  port: parseInt(PGPORT as string),
  ssl: PGSSL === "true" ? true : undefined,
});
export const db = drizzle(pool);
