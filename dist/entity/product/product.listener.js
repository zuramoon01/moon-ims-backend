import { z } from "zod";
import { productModel } from "./product.model.js";
import { handleError } from "../../util/index.js";
export const productListenerHandler = (io, socket) => {
    socket.on("product:getAll", async (arg, callback) => {
        try {
            const querySchema = z.object({
                page: z.coerce.number().min(1).default(1),
                limit: z.coerce.number().min(1).max(25).default(15),
            });
            let { page, limit } = querySchema.parse({
                page: arg.page,
                limit: arg.limit,
            });
            let offset = (page - 1) * limit;
            let [products, totalProduct] = await Promise.all([
                productModel.getAll().execute({ limit, offset }),
                productModel.getTotal().execute(),
            ]);
            const total = totalProduct.length === 1 ? Number(totalProduct[0]?.total) : 0;
            if (products.length === 0) {
                while (offset >= total) {
                    page -= 1;
                    offset = (page - 1) * limit;
                }
            }
            products = await productModel.getAll().execute({ limit, offset });
            callback({
                data: {
                    products,
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
            handleError(error, "Fungsi getProductsWithConfig, product.listener");
            callback({ message: "Bad Request." });
        }
    });
    socket.on("product:add", async (arg, callback) => {
        try {
            const productDataSchema = z.object({
                name: z.string(),
                quantity: z.number(),
                buyPrice: z.number(),
                sellPrice: z.number(),
            });
            const productData = productDataSchema.parse(arg);
            await productModel.add(productData);
            callback({
                success: true,
                message: "Produk berhasil ditambah.",
            });
            socket.emit("product:getAll");
            socket.broadcast.emit("product:getAll");
        }
        catch (error) {
            handleError(error, "Fungsi productSocketHandler, product:add");
            callback({
                success: false,
                message: "Bad Request.",
            });
        }
    });
    socket.on("product:update", async (arg1, arg2, callback) => {
        try {
            const id = z.coerce.number().parse(arg1);
            const product = await productModel.getById(arg1);
            if (product.length === 0) {
                callback({
                    success: false,
                    message: "Produk yang ingin diperbaharui tidak ditemukan.",
                });
                return;
            }
            const productDataSchema = z.object({
                name: z.string(),
                quantity: z.number(),
                buyPrice: z.number(),
                sellPrice: z.number(),
            });
            const productData = productDataSchema.parse(arg2);
            await productModel.update(id, productData);
            callback({
                success: true,
                message: "Produk berhasil diperbaharui.",
            });
            socket.emit("product:getAll");
            socket.broadcast.emit("product:getAll");
        }
        catch (error) {
            handleError(error, "Fungsi productSocketHandler, product:add");
            callback({
                success: false,
                message: "Bad Request.",
            });
        }
    });
    socket.on("product:delete", async (arg, callback) => {
        try {
            const id = z.coerce.number().parse(arg);
            const product = await productModel.getById(arg);
            if (product.length === 0) {
                callback({
                    success: false,
                    message: "Produk yang ingin dihapus tidak ditemukan.",
                });
                return;
            }
            await productModel.delete(id);
            callback({
                success: true,
                message: "Produk berhasil dihapus.",
            });
            socket.emit("product:getAll");
            socket.broadcast.emit("product:getAll");
        }
        catch (error) {
            handleError(error, "Fungsi productSocketHandler, product:delete");
            callback({
                success: false,
                message: "Bad Request.",
            });
        }
    });
};
//# sourceMappingURL=product.listener.js.map