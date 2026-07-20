import { productService } from "./service.js";

export const productController = {
  async list(req, res, next) {
    try {
      res.json({ data: await productService.listProducts() });
    } catch (error) {
      next(error);
    }
  },

  async detail(req, res, next) {
    try {
      res.json({ data: await productService.getProduct(req.params.id) });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      res.status(201).json({ data: await productService.createProduct(req.body) });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      res.json({ data: await productService.updateProduct(req.params.id, req.body) });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      res.json({ data: await productService.deleteProduct(req.params.id) });
    } catch (error) {
      next(error);
    }
  },
};
