import { sql } from "drizzle-orm";
import { integer, pgTable, serial, smallint, timestamp, varchar, } from "drizzle-orm/pg-core";
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    quantity: smallint("quantity").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }).default(sql `NULL`),
});
export const prices = pgTable("prices", {
    id: serial("id").primaryKey(),
    productId: integer("product_id").references(() => products.id),
    buyPrice: integer("buy_price").notNull(),
    sellPrice: integer("sell_price").notNull(),
    validFrom: timestamp("valid_from", { withTimezone: true })
        .notNull()
        .defaultNow(),
    validTo: timestamp("valid_to", { withTimezone: true }).default(sql `NULL`),
});
//# sourceMappingURL=product.migration.js.map