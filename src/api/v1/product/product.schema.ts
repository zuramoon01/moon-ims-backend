import {
	integer,
	pgTable,
	serial,
	smallint,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 256 }).notNull(),
	quantity: smallint("quantity").notNull().default(0),
	buyPrice: integer("buy_price").notNull().default(0),
	sellPrice: integer("sell_price").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: false })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: false })
		.notNull()
		.defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
