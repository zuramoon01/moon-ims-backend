"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.pool = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE, PGPORT, PGSSL } = process.env;
exports.pool = new pg_1.Pool({
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    database: PGDATABASE,
    port: parseInt(PGPORT),
    ssl: PGSSL === "true" ? true : undefined,
});
exports.db = (0, node_postgres_1.drizzle)(exports.pool);
