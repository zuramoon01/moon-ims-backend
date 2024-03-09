import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE, PGPORT, PGSSL } =
  process.env as {
    PGUSER: string;
    PGPASSWORD: string;
    PGHOST: string;
    PGDATABASE: string;
    PGPORT: string;
    PGSSL: "true" | "false";
  };

export const pool = new pg.Pool({
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  database: PGDATABASE,
  port: parseInt(PGPORT),
  ssl: PGSSL === "true" ? true : undefined,
});

export const db = drizzle(pool);
