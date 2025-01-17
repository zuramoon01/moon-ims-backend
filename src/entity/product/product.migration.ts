import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { PageConfig } from "../../util/type.js";

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
  deletedAt: timestamp("deleted_at", { withTimezone: true }).default(sql`NULL`),
});

export type Product = typeof products.$inferSelect;

export const prices = pgTable("prices", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  buyPrice: integer("buy_price").notNull(),
  sellPrice: integer("sell_price").notNull(),
  validFrom: timestamp("valid_from", { withTimezone: true })
    .notNull()
    .defaultNow(),
  validTo: timestamp("valid_to", { withTimezone: true }).default(sql`NULL`),
});

export type Price = typeof prices.$inferSelect;

export type ProductsWithPageConfig = {
  products: Array<
    Pick<Product, "id" | "name" | "quantity"> &
      Pick<Price, "buyPrice" | "sellPrice"> & {
        totalBuyPrice: number;
        totalSellPrice: number;
      }
  >;
} & PageConfig;

export type NewOrUpdateProduct = Pick<Product, "name" | "quantity"> &
  Pick<Price, "buyPrice" | "sellPrice">;
