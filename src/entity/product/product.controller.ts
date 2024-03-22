import { Request, Response } from "express";
import z from "zod";
import { productModel } from "./product.model.js";
import { ProductsWithPageConfig } from "./product.migration.js";
import { HttpStatusCode, handleError } from "../../util/index.js";

const getProductsWithConfig = async (
  req: Request,
): Promise<ProductsWithPageConfig> => {
  const productQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(25).default(15),
  });

  let { page, limit } = productQuerySchema.parse(req.query);
  let offset = (page - 1) * limit;

  let [products, totalProduct] = await Promise.all([
    productModel.getAll().execute({ limit, offset }),
    productModel.getTotal().execute(),
  ]);

  const total = totalProduct.length === 1 ? Number(totalProduct[0]?.total) : 0;

  // Cari produk dengan mengurangi page selama total produk tidak sama dengan 0 dan produk tidak ditemukan
  if (total > 0 && products.length === 0) {
    while (offset >= total && offset !== 0) {
      page -= 1;
      offset = (page - 1) * limit;
    }

    products = await productModel.getAll().execute({ limit, offset });
  }

  return {
    products,
    currentPage: page,
    totalPage: Math.ceil(total / limit),
    from: offset + 1,
    to: Math.min(offset + limit, total),
    limit,
    total,
  };
};

const productBodySchema = z.object({
  name: z.string(),
  quantity: z.number(),
  buyPrice: z.number(),
  sellPrice: z.number(),
});

const productParamsSchema = z.object({
  id: z.coerce.number(),
});

export const productController = {
  get: async (req: Request, res: Response) => {
    try {
      const productsWithConfig = await getProductsWithConfig(req);

      return res.status(HttpStatusCode.OK).json({
        data: productsWithConfig,
      });
    } catch (error) {
      handleError(error, "productController.getAll");

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid Data.",
      });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const productData = productBodySchema.parse(req.body);

      await productModel.add(productData);

      const productsWithConfig = await getProductsWithConfig(req);

      return res.status(HttpStatusCode.CREATED).json({
        data: productsWithConfig,
        message: "Berhasil menambahkan produk.",
      });
    } catch (error) {
      handleError(error, "productController.create");

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid Data.",
      });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const { id } = productParamsSchema.parse(req.params);

      const product = await productModel.getById(id);

      if (product.length === 0 || !product[0]) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Invalid Data.",
        });
      }

      const productData = productBodySchema.parse(req.body);

      // Cek apakah data yang diubah sama dengan data yang ingin diubah
      if (
        product[0].name === productData.name &&
        product[0].quantity === productData.quantity &&
        product[0].buyPrice === productData.buyPrice &&
        product[0].sellPrice === productData.sellPrice
      ) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Tidak ada data pada produk yang dapat diperbaharui.",
        });
      }

      const isPriceChange =
        product[0].buyPrice !== productData.buyPrice ||
        product[0].sellPrice !== productData.sellPrice;

      await productModel.update(id, productData, isPriceChange);

      const productsWithConfig = await getProductsWithConfig(req);

      return res.status(HttpStatusCode.OK).json({
        data: productsWithConfig,
        message: "Berhasil memperbaharui produk.",
      });
    } catch (error) {
      handleError(error, "productController.update");

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid Data.",
      });
    }
  },
  deleteBulk: async (req: Request, res: Response) => {
    try {
      const bodySchema = z.object({
        ids: z.array(z.number()),
      });

      const { ids } = bodySchema.parse(req.body);

      const products = await productModel.getByIds(ids);

      if (products.length === 0 || products.length !== ids.length) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Invalid Data.",
        });
      }

      await productModel.deleteBulk(ids);

      const productsWithConfig = await getProductsWithConfig(req);

      return res.status(HttpStatusCode.OK).json({
        data: productsWithConfig,
        message: "Berhasil menghapus produk.",
      });
    } catch (error) {
      handleError(error, "Fungsi productController.create");

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid Data.",
      });
    }
  },
};
