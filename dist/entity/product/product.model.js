import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../database/index.js";
import { products, } from "./product.schema.js";
export const productModel = {
    getAll: () => {
        return db
            .select({
            id: products.id,
            name: products.name,
            quantity: products.quantity,
            buyPrice: products.buyPrice,
            totalBuyPrice: sql `${products.quantity} * ${products.buyPrice}`,
            sellPrice: products.sellPrice,
            totalSellPrice: sql `${products.quantity} * ${products.sellPrice}`,
        })
            .from(products)
            .orderBy(desc(products.id))
            .limit(sql.placeholder("limit"))
            .offset(sql.placeholder("offset"))
            .prepare("get_all_product");
    },
    getById: (id) => {
        return db
            .select({
            id: products.id,
            name: products.name,
            quantity: products.quantity,
            buyPrice: products.buyPrice,
            totalBuyPrice: sql `${products.quantity} * ${products.buyPrice}`,
            sellPrice: products.sellPrice,
            totalSellPrice: sql `${products.quantity} * ${products.sellPrice}`,
        })
            .from(products)
            .where(eq(products.id, id));
    },
    getTotal: () => {
        return db
            .select({
            total: sql `count(*)`,
        })
            .from(products)
            .prepare("get_total_product");
    },
    add: (product) => {
        return db.insert(products).values(product).onConflictDoNothing();
    },
    update: (productId, product) => {
        return db.transaction(async (tx) => {
            return await tx
                .update(products)
                .set({ ...product, updatedAt: sql `current_timestamp` })
                .where(eq(products.id, productId));
        });
    },
    delete: (id) => {
        return db.transaction(async (tx) => {
            await tx.delete(products).where(eq(products.id, id));
        });
    },
};
//# sourceMappingURL=product.model.js.map