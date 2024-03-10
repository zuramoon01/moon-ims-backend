import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../database/index.js";
import {
  products,
  type Product,
  type NewOrUpdateProduct,
} from "./product.schema.js";

export const productModel = {
  getAll: () => {
    return db
      .select({
        id: products.id,
        name: products.name,
        quantity: products.quantity,
        buyPrice: products.buyPrice,
        totalBuyPrice: sql<number>`${products.quantity} * ${products.buyPrice}`,
        sellPrice: products.sellPrice,
        totalSellPrice: sql<number>`${products.quantity} * ${products.sellPrice}`,
      })
      .from(products)
      .orderBy(desc(products.id))
      .limit(sql.placeholder("limit"))
      .offset(sql.placeholder("offset"))
      .prepare("get_all_product");
  },
  getTotal: () => {
    return db
      .select({
        total: sql<string>`count(*)`,
      })
      .from(products)
      .prepare("get_total_product");
  },
  getById: (id: Product["id"]) => {
    return db
      .select({
        id: products.id,
        name: products.name,
        quantity: products.quantity,
        buyPrice: products.buyPrice,
        totalBuyPrice: sql<number>`${products.quantity} * ${products.buyPrice}`,
        sellPrice: products.sellPrice,
        totalSellPrice: sql<number>`${products.quantity} * ${products.sellPrice}`,
      })
      .from(products)
      .where(eq(products.id, id));
  },
  add: (product: NewOrUpdateProduct) => {
    return db.insert(products).values(product).onConflictDoNothing();
  },
  update: (productId: Product["id"], product: NewOrUpdateProduct) => {
    return db.transaction(async (tx) => {
      return await tx
        .update(products)
        .set({ ...product, updatedAt: sql`current_timestamp` })
        .where(eq(products.id, productId));
    });
  },
  delete: (id: Product["id"]) => {
    return db.transaction(async (tx) => {
      await tx.delete(products).where(eq(products.id, id));
    });
  },
};
