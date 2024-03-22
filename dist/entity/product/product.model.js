import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../../database/index.js";
import { products, prices, } from "./product.migration.js";
export const productModel = {
    getAll: () => {
        return db
            .select({
            id: products.id,
            name: products.name,
            quantity: products.quantity,
            buyPrice: prices.buyPrice,
            totalBuyPrice: sql `${products.quantity} * ${prices.buyPrice}`,
            sellPrice: prices.sellPrice,
            totalSellPrice: sql `${products.quantity} * ${prices.sellPrice}`,
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
            total: sql `count(*)`,
        })
            .from(products)
            .innerJoin(prices, eq(prices.productId, products.id))
            .where(and(isNull(products.deletedAt), isNull(prices.validTo)))
            .prepare("get_total_product");
    },
    getById: (productId) => {
        return db
            .select({
            id: products.id,
            name: products.name,
            quantity: products.quantity,
            buyPrice: prices.buyPrice,
            totalBuyPrice: sql `${products.quantity} * ${prices.buyPrice}`,
            sellPrice: prices.sellPrice,
            totalSellPrice: sql `${products.quantity} * ${prices.sellPrice}`,
        })
            .from(products)
            .innerJoin(prices, eq(prices.productId, products.id))
            .where(and(isNull(products.deletedAt), eq(products.id, productId), isNull(prices.validTo)));
    },
    getByIds: (ids) => {
        return db
            .select({
            id: products.id,
            name: products.name,
            quantity: products.quantity,
            buyPrice: prices.buyPrice,
            totalBuyPrice: sql `${products.quantity} * ${prices.buyPrice}`,
            sellPrice: prices.sellPrice,
            totalSellPrice: sql `${products.quantity} * ${prices.sellPrice}`,
        })
            .from(products)
            .innerJoin(prices, eq(prices.productId, products.id))
            .where(and(isNull(products.deletedAt), inArray(products.id, ids), isNull(prices.validTo)));
    },
    add: ({ name, quantity, buyPrice, sellPrice }) => {
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
    update: (productId, { name, quantity, buyPrice, sellPrice }, isPriceChange) => {
        return db.transaction(async (tx) => {
            await tx
                .update(products)
                .set({ name, quantity, updatedAt: sql `current_timestamp` })
                .where(eq(products.id, productId));
            if (isPriceChange) {
                await Promise.all([
                    tx
                        .update(prices)
                        .set({
                        buyPrice,
                        sellPrice,
                        validTo: sql `now()`,
                    })
                        .where(and(eq(prices.productId, productId), isNull(prices.validTo))),
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
    deleteBulk: (ids) => {
        return db.transaction(async (tx) => {
            await tx
                .update(products)
                .set({ deletedAt: sql `now()` })
                .where(inArray(products.id, ids));
        });
    },
};
//# sourceMappingURL=product.model.js.map