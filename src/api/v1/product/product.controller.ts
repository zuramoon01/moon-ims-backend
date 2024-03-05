import { Request, Response } from "express";
import z from "zod";
import { productModel } from ".";
import { HttpStatusCode } from "../../../utils";

export const productController = {
	get: async (req: Request, res: Response) => {
		try {
			const { limit = 15, offset = 0 } = z
				.object({ limit: z.number().optional(), offset: z.number().optional() })
				.parse(req.body);

			const products = await productModel.getAll().execute({ limit, offset });

			if (!products) {
				return res.sendStatus(HttpStatusCode.BAD_REQUEST);
			}

			return res.status(HttpStatusCode.OK).json(products);
		} catch (e) {
			console.error(e);

			return res.sendStatus(HttpStatusCode.BAD_REQUEST);
		}
	},
	getById: async (req: Request, res: Response) => {
		try {
			const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

			const product = await productModel.getById(id);

			if (!product) {
				return res.sendStatus(HttpStatusCode.BAD_REQUEST);
			}

			return res.status(HttpStatusCode.OK).json(product);
		} catch (e) {
			console.error(e);

			return res.status(HttpStatusCode.BAD_REQUEST).json({
				message: "Invalid Data.",
			});
		}
	},
	create: async (req: Request, res: Response) => {
		try {
			const dataProduct = z
				.object({
					name: z.string(),
					quantity: z.number(),
					buyPrice: z.number(),
					sellPrice: z.number(),
				})
				.parse(req.body);

			const createdProduct = await productModel.add(dataProduct);

			return res.status(HttpStatusCode.CREATED).json({
				message: "Berhasil menambahkan produk.",
				data: createdProduct,
			});
		} catch (e) {
			console.error(e);

			return res.status(HttpStatusCode.BAD_REQUEST).json({
				message: "Invalid Data.",
			});
		}
	},
	update: async (req: Request, res: Response) => {
		try {
			const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

			const dataProduct = z
				.object({
					name: z.string().optional(),
					quantity: z.number().optional(),
					buyPrice: z.number().optional(),
					sellPrice: z.number().optional(),
				})
				.parse(req.body);

			const { name, quantity, buyPrice, sellPrice } = dataProduct;

			const isNoUpdatedData = !name && !quantity && !buyPrice && !sellPrice;

			if (isNoUpdatedData) {
				res.status(HttpStatusCode.BAD_REQUEST).json({
					message: "Tidak data pada produk yang dapat diperbaharui.",
				});
			}

			const updatedProduct = await productModel.update({ id, ...dataProduct });

			return res.status(HttpStatusCode.OK).json({
				message: "Berhasil memperbaharui produk.",
				data: updatedProduct,
			});
		} catch (e) {
			console.error(e);

			return res.status(HttpStatusCode.BAD_REQUEST).json({
				message: "Invalid Data.",
			});
		}
	},
	delete: async (req: Request, res: Response) => {
		try {
			const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

			await productModel.delete(id);

			return res.status(HttpStatusCode.OK).json({
				message: "Berhasil menghapus produk.",
			});
		} catch (e) {
			console.error(e);

			return res.status(HttpStatusCode.BAD_REQUEST).json({
				message: "Invalid Data.",
			});
		}
	},
};
