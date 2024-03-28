import { and, asc, desc, eq, inArray, isNull, like, sql } from "drizzle-orm";
import { db } from "../../database/index.js";
import {
  products,
  prices,
  type Product,
  type NewOrUpdateProduct,
} from "./product.migration.js";

export const productModel = {
  search: async (search: string) => {
    return await db.execute(sql`
      SELECT id, name
      FROM products
      WHERE LOWER(products.name) LIKE LOWER('%${search}%')
      ORDER BY products.name;
    `);
  },
  getAll: () => {
    return db
      .select({
        id: products.id,
        name: products.name,
        quantity: products.quantity,
        buyPrice: prices.buyPrice,
        totalBuyPrice: sql<number>`${products.quantity} * ${prices.buyPrice}`,
        sellPrice: prices.sellPrice,
        totalSellPrice: sql<number>`${products.quantity} * ${prices.sellPrice}`,
      })
      .from(products)
      .innerJoin(prices, eq(products.id, prices.productId))
      .where(and(isNull(products.deletedAt), isNull(prices.validTo)))
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
      .innerJoin(prices, eq(prices.productId, products.id))
      .where(and(isNull(products.deletedAt), isNull(prices.validTo)))
      .prepare("get_total_product");
  },
  getById: (productId: Product["id"]) => {
    return db
      .select({
        id: products.id,
        name: products.name,
        quantity: products.quantity,
        buyPrice: prices.buyPrice,
        totalBuyPrice: sql<number>`${products.quantity} * ${prices.buyPrice}`,
        sellPrice: prices.sellPrice,
        totalSellPrice: sql<number>`${products.quantity} * ${prices.sellPrice}`,
      })
      .from(products)
      .innerJoin(prices, eq(prices.productId, products.id))
      .where(
        and(
          isNull(products.deletedAt),
          eq(products.id, productId),
          isNull(prices.validTo),
        ),
      );
  },
  getByIds: (ids: Array<Product["id"]>) => {
    return db
      .select({
        id: products.id,
        name: products.name,
        quantity: products.quantity,
        buyPrice: prices.buyPrice,
        totalBuyPrice: sql<number>`${products.quantity} * ${prices.buyPrice}`,
        sellPrice: prices.sellPrice,
        totalSellPrice: sql<number>`${products.quantity} * ${prices.sellPrice}`,
      })
      .from(products)
      .innerJoin(prices, eq(prices.productId, products.id))
      .where(
        and(
          isNull(products.deletedAt),
          inArray(products.id, ids),
          isNull(prices.validTo),
        ),
      );
  },
  add: ({ name, quantity, buyPrice, sellPrice }: NewOrUpdateProduct) => {
    return db.transaction(async (tx) => {
      const createdProduct = await tx
        .insert(products)
        .values({ name, quantity })
        .onConflictDoNothing()
        .returning({ id: products.id });

      if (createdProduct.length === 0 || !createdProduct[0]) {
        tx.rollback();
        return;
      }

      await tx.insert(prices).values({
        productId: createdProduct[0].id,
        buyPrice,
        sellPrice,
      });
    });
  },
  update: (
    productId: Product["id"],
    { name, quantity, buyPrice, sellPrice }: NewOrUpdateProduct,
    isPriceChange: boolean,
  ) => {
    return db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({ name, quantity, updatedAt: sql`current_timestamp` })
        .where(eq(products.id, productId));

      if (isPriceChange) {
        await Promise.all([
          tx
            .update(prices)
            .set({
              validTo: sql`now()`,
            })
            .where(
              and(eq(prices.productId, productId), isNull(prices.validTo)),
            ),
          tx
            .insert(prices)
            .values({
              productId,
              buyPrice,
              sellPrice,
            })
            .onConflictDoNothing(),
        ]);
      }
    });
  },
  deleteBulk: (ids: Array<Product["id"]>) => {
    return db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({ deletedAt: sql`now()` })
        .where(inArray(products.id, ids));
    });
  },
};
