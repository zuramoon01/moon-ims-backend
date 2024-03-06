import { eq, sql } from "drizzle-orm";
import { db } from "../../../database";
import { NewProduct, Product, products } from ".";

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
      .limit(sql.placeholder("limit"))
      .offset(sql.placeholder("offset"))
      .prepare("get_all_product");
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
  getTotal: () => {
    return db
      .select({
        total: sql<string>`count(*)`,
      })
      .from(products)
      .prepare("get_total_product");
  },
  add: (product: Omit<NewProduct, "id" | "createdAt" | "updatedAt">) => {
    return db
      .insert(products)
      .values(product)
      .onConflictDoNothing()
      .returning({
        id: products.id,
        name: products.name,
        quantity: products.quantity,
        buyPrice: products.buyPrice,
        totalBuyPrice: sql<number>`${products.quantity} * ${products.buyPrice}`,
        sellPrice: products.sellPrice,
        totalSellPrice: sql<number>`${products.quantity} * ${products.sellPrice}`,
      });
  },
  update: (
    product: Pick<Product, "id"> &
      Partial<Omit<Product, "id" | "totalBuyPrice" | "totalSellPrice">>,
  ) => {
    return db.transaction(async (tx) => {
      return await tx
        .update(products)
        .set({ ...product, updatedAt: sql`current_timestamp` })
        .where(eq(products.id, product.id))
        .returning({
          id: products.id,
          name: products.name,
          quantity: products.quantity,
          buyPrice: products.buyPrice,
          totalBuyPrice: sql<number>`${products.quantity} * ${products.buyPrice}`,
          sellPrice: products.sellPrice,
          totalSellPrice: sql<number>`${products.quantity} * ${products.sellPrice}`,
        });
    });
  },
  delete: (id: Product["id"]) => {
    return db.transaction(async (tx) => {
      await tx.delete(products).where(eq(products.id, id));
    });
  },
};
