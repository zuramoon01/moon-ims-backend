import { Request, Response } from "express";
import z from "zod";
import { productModel } from ".";
import { HttpStatusCode, handleError } from "../../../utils";

export const productController = {
  get: async (req: Request, res: Response) => {
    try {
      const querySchema = z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(15),
      });

      const { page, limit } = querySchema.parse(req.query);
      const offset = (page - 1) * limit;

      const [products, totalProduct] = await Promise.all([
        productModel.getAll().execute({ limit, offset }),
        productModel.getTotal().execute(),
      ]);

      if (!products || !totalProduct) {
        return res.sendStatus(HttpStatusCode.BAD_REQUEST);
      }

      const total =
        totalProduct.length === 1 ? Number(totalProduct[0].total) : 0;

      return res.status(HttpStatusCode.OK).json({
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
    } catch (error) {
      handleError(error, "Fungsi productController.get");

      return res.sendStatus(HttpStatusCode.BAD_REQUEST);
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const paramsSchema = z.object({
        id: z.coerce.number(),
      });

      const { id } = paramsSchema.parse(req.params);

      const product = await productModel.getById(id);

      if (!product) {
        return res.sendStatus(HttpStatusCode.BAD_REQUEST);
      }

      return res.status(HttpStatusCode.OK).json({ data: product[0] });
    } catch (error) {
      handleError(error, "Fungsi productController.getById");

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid Data.",
      });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const bodySchema = z.object({
        name: z.string(),
        quantity: z.number(),
        buyPrice: z.number(),
        sellPrice: z.number(),
      });

      const dataProduct = bodySchema.parse(req.body);

      const createdProduct = await productModel.add(dataProduct);

      return res.status(HttpStatusCode.CREATED).json({
        data: createdProduct,
        message: "Berhasil menambahkan produk.",
      });
    } catch (error) {
      handleError(error, "Fungsi productController.create");

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid Data.",
      });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const paramsSchema = z.object({
        id: z.coerce.number(),
      });

      const { id } = paramsSchema.parse(req.params);

      const bodySchema = z.object({
        name: z.string().optional(),
        quantity: z.number().optional(),
        buyPrice: z.number().optional(),
        sellPrice: z.number().optional(),
      });

      const dataProduct = bodySchema.parse(req.body);
      const { name, quantity, buyPrice, sellPrice } = dataProduct;

      const isNoUpdatedData = !name && !quantity && !buyPrice && !sellPrice;
      if (isNoUpdatedData) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Tidak data pada produk yang dapat diperbaharui.",
        });
      }

      const updatedProduct = await productModel.update({ id, ...dataProduct });

      return res.status(HttpStatusCode.OK).json({
        data: updatedProduct,
        message: "Berhasil memperbaharui produk.",
      });
    } catch (error) {
      handleError(error, "Fungsi productController.create");

      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid Data.",
      });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const paramsSchema = z.object({
        id: z.coerce.number(),
      });

      const { id } = paramsSchema.parse(req.params);

      await productModel.delete(id);

      return res.status(HttpStatusCode.OK).json({
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
