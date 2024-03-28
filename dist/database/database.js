import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";
const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE, PGPORT, PGSSL } = process.env;
export const pool = new pg.Pool({
    connectionString: `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=${PGSSL}`,
});
export const db = drizzle(pool);
//# sourceMappingURL=database.js.map