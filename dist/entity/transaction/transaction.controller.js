import { z } from "zod";
import { desc, eq, like, sql } from "drizzle-orm";
import { db } from "../../database/index.js";
import { transactionDetails, transactions } from "./transaction.migration.js";
import { prices, products } from "../product/index.js";
import { HttpStatusCode, getCurrentDateInIndonesianFormat, handleError, } from "../../util/index.js";
export const transactionController = {
    get: async (req, res) => {
        try {
            const querySchema = z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).max(25).default(15),
            });
            let { page, limit } = querySchema.parse(req.query);
            let offset = (page - 1) * limit;
            let [transactionsResult, totalTransaction] = await Promise.all([
                db
                    .select()
                    .from(transactions)
                    .orderBy(desc(transactions.id))
                    .limit(limit)
                    .offset(offset),
                db
                    .select({
                    total: sql `count(*)`,
                })
                    .from(transactions),
            ]);
            const total = totalTransaction.length === 1 ? Number(totalTransaction[0]?.total) : 0;
            // Cari produk dengan mengurangi page selama total produk tidak sama dengan 0 dan produk tidak ditemukan
            if (total > 0 && transactionsResult.length === 0) {
                while (offset >= total && offset !== 0) {
                    page -= 1;
                    offset = (page - 1) * limit;
                }
                transactionsResult = await db
                    .select()
                    .from(transactions)
                    .orderBy(desc(transactions.id))
                    .limit(limit)
                    .offset(offset);
            }
            return res.status(HttpStatusCode.OK).json({
                data: {
                    transactions: transactionsResult,
                    currentPage: page,
                    totalPage: Math.ceil(total / limit),
                    from: offset + 1,
                    to: Math.min(offset + limit, total),
                    limit,
                    total,
                },
            });
        }
        catch (error) {
            handleError(error, "transactionController.get");
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: "Invalid Data.",
            });
        }
    },
    purchase: async (req, res) => {
        try {
            const bodySchema = z.object({
                data: z.array(z.object({
                    id: z.number(),
                    quantity: z.number(),
                })),
            });
            const { data } = bodySchema.parse(req.body);
            const totalQuantity = data.reduce((acc, product) => acc + product.quantity, 0);
            const result = await db.transaction(async (tx) => {
                let totalBuyPriceProduct = 0;
                for (const product of data) {
                    const price = await tx
                        .select()
                        .from(prices)
                        .where(eq(prices.productId, product.id));
                    if (price.length === 0 || !price[0]) {
                        tx.rollback();
                        return;
                    }
                    totalBuyPriceProduct += price[0].buyPrice * product.quantity;
                }
                const [day, month, year] = getCurrentDateInIndonesianFormat().split("/");
                const currentPurchaseCode = `PO${day}${month}${year}`;
                let currentPurchaseCodeOrder = `${currentPurchaseCode}1`;
                const results = await tx
                    .select({ code: transactions.code })
                    .from(transactions)
                    .where(like(transactions.code, `${currentPurchaseCode}%`))
                    .orderBy(desc(transactions.id));
                if (results.length > 0 && results[0]) {
                    console.log(results[0].code.slice(10));
                    currentPurchaseCodeOrder = `${currentPurchaseCode}${Number(results[0].code.slice(10)) + 1}`;
                }
                const transactionResult = await tx
                    .insert(transactions)
                    .values({
                    code: currentPurchaseCodeOrder,
                    totalStock: totalQuantity,
                    totalPrice: -totalBuyPriceProduct,
                })
                    .onConflictDoNothing()
                    .returning({ id: transactions.id });
                if (transactionResult.length === 0 || !transactionResult[0]) {
                    tx.rollback();
                    return;
                }
                for (const product of data) {
                    const price = await tx
                        .select()
                        .from(prices)
                        .where(eq(prices.productId, product.id));
                    if (price.length === 0 || !price[0]) {
                        tx.rollback();
                        return;
                    }
                    await tx.insert(transactionDetails).values({
                        transactionId: transactionResult[0].id,
                        productId: product.id,
                        priceId: price[0].id,
                        stock: product.quantity,
                    });
                    await tx.execute(sql `
            UPDATE products
            SET quantity = quantity + ${product.quantity}
            WHERE id = ${product.id}
          `);
                }
                const querySchema = z.object({
                    page: z.coerce.number().min(1).default(1),
                    limit: z.coerce.number().min(1).max(25).default(15),
                });
                let { page, limit } = querySchema.parse(req.query);
                let offset = (page - 1) * limit;
                let [transactionsResult, totalTransaction] = await Promise.all([
                    tx
                        .select()
                        .from(transactions)
                        .orderBy(desc(transactions.id))
                        .limit(limit)
                        .offset(offset),
                    tx
                        .select({
                        total: sql `count(*)`,
                    })
                        .from(transactions),
                ]);
                const total = totalTransaction.length === 1
                    ? Number(totalTransaction[0]?.total)
                    : 0;
                // Cari produk dengan mengurangi page selama total produk tidak sama dengan 0 dan produk tidak ditemukan
                if (total > 0 && transactionsResult.length === 0) {
                    while (offset >= total && offset !== 0) {
                        page -= 1;
                        offset = (page - 1) * limit;
                    }
                    transactionsResult = await tx
                        .select()
                        .from(transactions)
                        .orderBy(desc(transactions.id))
                        .limit(limit)
                        .offset(offset);
                }
                return {
                    transactions: transactionsResult,
                    currentPage: page,
                    totalPage: Math.ceil(total / limit),
                    from: offset + 1,
                    to: Math.min(offset + limit, total),
                    limit,
                    total,
                };
            });
            return res.status(HttpStatusCode.CREATED).json({
                data: result,
                message: "Berhasil melakukan transaksi pembelian.",
            });
        }
        catch (error) {
            handleError(error, "transactionController.purchase");
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: "Invalid Data.",
            });
        }
    },
    sale: async (req, res) => {
        try {
            const bodySchema = z.object({
                data: z.array(z.object({
                    id: z.number(),
                    quantity: z.number(),
                })),
            });
            const { data } = bodySchema.parse(req.body);
            const totalQuantity = data.reduce((acc, product) => acc + product.quantity, 0);
            db.transaction(async (tx) => {
                let totalSellPriceProduct = 0;
                for (const product of data) {
                    const productData = await tx
                        .select()
                        .from(products)
                        .where(eq(products.id, product.id));
                    if (productData.length === 0 ||
                        !productData[0] ||
                        productData[0].quantity < product.quantity) {
                        tx.rollback();
                        return;
                    }
                    const price = await tx
                        .select()
                        .from(prices)
                        .where(eq(prices.productId, product.id));
                    if (price.length === 0 || !price[0]) {
                        tx.rollback();
                        return;
                    }
                    totalSellPriceProduct += price[0].sellPrice * product.quantity;
                }
                const [day, month, year] = getCurrentDateInIndonesianFormat().split("/");
                const currentSaleCode = `SO${day}${month}${year}`;
                let currentSaleCodeOrder = `${currentSaleCode}1`;
                const results = await tx
                    .select({ code: transactions.code })
                    .from(transactions)
                    .where(like(transactions.code, `${currentSaleCode}%`))
                    .orderBy(desc(transactions.code));
                if (results.length > 0 && results[0]) {
                    currentSaleCodeOrder = `${currentSaleCode}${Number(results[0].code.slice(10)) + 1}`;
                }
                const transaction = await tx
                    .insert(transactions)
                    .values({
                    code: currentSaleCodeOrder,
                    totalStock: -totalQuantity,
                    totalPrice: totalSellPriceProduct,
                })
                    .onConflictDoNothing()
                    .returning({ id: transactions.id });
                if (transaction.length === 0 || !transaction[0]) {
                    tx.rollback();
                    return;
                }
                for (const product of data) {
                    const price = await tx
                        .select()
                        .from(prices)
                        .where(eq(prices.productId, product.id));
                    if (price.length === 0 || !price[0]) {
                        tx.rollback();
                        return;
                    }
                    await tx.insert(transactionDetails).values({
                        transactionId: transaction[0].id,
                        productId: product.id,
                        priceId: price[0].id,
                        stock: product.quantity,
                    });
                    await tx.execute(sql `
            UPDATE products
            SET quantity = quantity - ${product.quantity}
            WHERE id = ${product.id}
          `);
                }
            });
            return res.status(HttpStatusCode.CREATED).json({
                message: "Berhasil melakukan transaksi penjualan.",
            });
        }
        catch (error) {
            handleError(error, "transactionController.get");
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                message: "Invalid Data.",
            });
        }
    },
};
//# sourceMappingURL=transaction.controller.js.map