"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const zod_1 = __importDefault(require("zod"));
const _1 = require(".");
const utils_1 = require("../../../utils");
exports.productController = {
    get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const querySchema = zod_1.default.object({
                page: zod_1.default.coerce.number().default(1),
                limit: zod_1.default.coerce.number().default(15),
            });
            const { page, limit } = querySchema.parse(req.query);
            const offset = (page - 1) * limit;
            const [products, totalProduct] = yield Promise.all([
                _1.productModel.getAll().execute({ limit, offset }),
                _1.productModel.getTotal().execute(),
            ]);
            if (!products || !totalProduct) {
                return res.sendStatus(utils_1.HttpStatusCode.BAD_REQUEST);
            }
            const total = totalProduct.length === 1 ? parseInt(totalProduct[0].total) : 0;
            return res.status(utils_1.HttpStatusCode.OK).json({
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
        catch (e) {
            console.error(e);
            return res.sendStatus(utils_1.HttpStatusCode.BAD_REQUEST);
        }
    }),
    getById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = zod_1.default.object({ id: zod_1.default.coerce.number() }).parse(req.params);
            const product = yield _1.productModel.getById(id);
            if (!product) {
                return res.sendStatus(utils_1.HttpStatusCode.BAD_REQUEST);
            }
            return res.status(utils_1.HttpStatusCode.OK).json({ data: product[0] });
        }
        catch (e) {
            console.error(e);
            return res.status(utils_1.HttpStatusCode.BAD_REQUEST).json({
                message: "Invalid Data.",
            });
        }
    }),
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dataProduct = zod_1.default
                .object({
                name: zod_1.default.string(),
                quantity: zod_1.default.number(),
                buyPrice: zod_1.default.number(),
                sellPrice: zod_1.default.number(),
            })
                .parse(req.body);
            const createdProduct = yield _1.productModel.add(dataProduct);
            return res.status(utils_1.HttpStatusCode.CREATED).json({
                data: createdProduct,
                message: "Berhasil menambahkan produk.",
            });
        }
        catch (e) {
            console.error(e);
            return res.status(utils_1.HttpStatusCode.BAD_REQUEST).json({
                message: "Invalid Data.",
            });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = zod_1.default.object({ id: zod_1.default.coerce.number() }).parse(req.params);
            const dataProduct = zod_1.default
                .object({
                name: zod_1.default.string().optional(),
                quantity: zod_1.default.number().optional(),
                buyPrice: zod_1.default.number().optional(),
                sellPrice: zod_1.default.number().optional(),
            })
                .parse(req.body);
            const { name, quantity, buyPrice, sellPrice } = dataProduct;
            const isNoUpdatedData = !name && !quantity && !buyPrice && !sellPrice;
            if (isNoUpdatedData) {
                res.status(utils_1.HttpStatusCode.BAD_REQUEST).json({
                    message: "Tidak data pada produk yang dapat diperbaharui.",
                });
            }
            const updatedProduct = yield _1.productModel.update(Object.assign({ id }, dataProduct));
            return res.status(utils_1.HttpStatusCode.OK).json({
                data: updatedProduct,
                message: "Berhasil memperbaharui produk.",
            });
        }
        catch (e) {
            console.error(e);
            return res.status(utils_1.HttpStatusCode.BAD_REQUEST).json({
                message: "Invalid Data.",
            });
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = zod_1.default.object({ id: zod_1.default.coerce.number() }).parse(req.params);
            yield _1.productModel.delete(id);
            return res.status(utils_1.HttpStatusCode.OK).json({
                message: "Berhasil menghapus produk.",
            });
        }
        catch (e) {
            console.error(e);
            return res.status(utils_1.HttpStatusCode.BAD_REQUEST).json({
                message: "Invalid Data.",
            });
        }
    }),
};
