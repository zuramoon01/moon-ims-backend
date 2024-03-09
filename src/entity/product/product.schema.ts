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

export type Product = Omit<
  typeof products.$inferSelect,
  "createdAt" | "updatedAt"
> & {
  totalBuyPrice: number;
  totalSellPrice: number;
};
export type ConfigProduct = {
  currentPage: number;
  totalPage: number;
  from: number;
  to: number;
  limit: number;
  total: number;
};
export type ProductsWithConfig = {
  products: Product[];
} & ConfigProduct;
export type NewOrUpdateProduct = Omit<
  typeof products.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>;
