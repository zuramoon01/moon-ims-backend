import { integer, pgTable, serial, smallint, timestamp, varchar, } from "drizzle-orm/pg-core";
import { prices, products } from "../product/index.js";
export const transactions = pgTable("transactions", {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 16 }).notNull(),
    totalStock: smallint("total_stock").notNull(),
    totalPrice: integer("total_price").notNull(),
    transactionDate: timestamp("transaction_date", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
export const transactionDetails = pgTable("transaction_details", {
    id: serial("id").primaryKey(),
    transactionId: integer("transaction_id").references(() => transactions.id),
    productId: integer("product_id").references(() => products.id),
    priceId: integer("price_id").references(() => prices.id),
    stock: smallint("stock").notNull(),
});
//# sourceMappingURL=transaction.migration.js.map