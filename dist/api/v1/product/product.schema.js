"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }).notNull(),
    quantity: (0, pg_core_1.smallint)("quantity").notNull().default(0),
    buyPrice: (0, pg_core_1.integer)("buy_price").notNull().default(0),
    sellPrice: (0, pg_core_1.integer)("sell_price").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: false })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: false })
        .notNull()
        .defaultNow(),
});
