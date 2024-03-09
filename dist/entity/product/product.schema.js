import { integer, pgTable, serial, smallint, timestamp, varchar, } from "drizzle-orm/pg-core";
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    quantity: smallint("quantity").notNull(),
    buyPrice: integer("buy_price").notNull(),
    sellPrice: integer("sell_price").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
//# sourceMappingURL=product.schema.js.map