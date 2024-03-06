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
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../../../database");
const _1 = require(".");
exports.productModel = {
    getAll: () => {
        return database_1.db
            .select({
            id: _1.products.id,
            name: _1.products.name,
            quantity: _1.products.quantity,
            buyPrice: _1.products.buyPrice,
            totalBuyPrice: (0, drizzle_orm_1.sql) `${_1.products.quantity} * ${_1.products.buyPrice}`,
            sellPrice: _1.products.sellPrice,
            totalSellPrice: (0, drizzle_orm_1.sql) `${_1.products.quantity} * ${_1.products.sellPrice}`,
        })
            .from(_1.products)
            .limit(drizzle_orm_1.sql.placeholder("limit"))
            .offset(drizzle_orm_1.sql.placeholder("offset"))
            .prepare("get_all_product");
    },
    getById: (id) => {
        return database_1.db
            .select({
            id: _1.products.id,
            name: _1.products.name,
            quantity: _1.products.quantity,
            buyPrice: _1.products.buyPrice,
            totalBuyPrice: (0, drizzle_orm_1.sql) `${_1.products.quantity} * ${_1.products.buyPrice}`,
            sellPrice: _1.products.sellPrice,
            totalSellPrice: (0, drizzle_orm_1.sql) `${_1.products.quantity} * ${_1.products.sellPrice}`,
        })
            .from(_1.products)
            .where((0, drizzle_orm_1.eq)(_1.products.id, id));
    },
    getTotal: () => {
        return database_1.db
            .select({
            total: (0, drizzle_orm_1.sql) `count(*)`,
        })
            .from(_1.products)
            .prepare("get_total_product");
    },
    add: (product) => {
        return database_1.db
            .insert(_1.products)
            .values(product)
            .onConflictDoNothing()
            .returning({
            id: _1.products.id,
            name: _1.products.name,
            quantity: _1.products.quantity,
            buyPrice: _1.products.buyPrice,
            totalBuyPrice: (0, drizzle_orm_1.sql) `${_1.products.quantity} * ${_1.products.buyPrice}`,
            sellPrice: _1.products.sellPrice,
            totalSellPrice: (0, drizzle_orm_1.sql) `${_1.products.quantity} * ${_1.products.sellPrice}`,
        });
    },
    update: (product) => {
        return database_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            return yield tx
                .update(_1.products)
                .set(Object.assign(Object.assign({}, product), { updatedAt: (0, drizzle_orm_1.sql) `current_timestamp` }))
                .where((0, drizzle_orm_1.eq)(_1.products.id, product.id))
                .returning({
                id: _1.products.id,
                name: _1.products.name,
                quantity: _1.products.quantity,
                buyPrice: _1.products.buyPrice,
                totalBuyPrice: (0, drizzle_orm_1.sql) `${_1.products.quantity} * ${_1.products.buyPrice}`,
                sellPrice: _1.products.sellPrice,
                totalSellPrice: (0, drizzle_orm_1.sql) `${_1.products.quantity} * ${_1.products.sellPrice}`,
            });
        }));
    },
    delete: (id) => {
        return database_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.delete(_1.products).where((0, drizzle_orm_1.eq)(_1.products.id, id));
        }));
    },
};
