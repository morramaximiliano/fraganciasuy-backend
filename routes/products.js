import express from 'express';
import {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../service/serviceProduct.js';
import {
  schemaCreateProduct,
  schemaGetProduct,
  schemaUpdateProduct,
} from '../schema/schemaProduct.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import { validateToken } from '../middlewares/validateAuth.js';
import { authorizeRole } from '../middlewares/checkRole.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(schemaGetProduct, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await getOneProduct(id);
      res.status(200).json({
        message: 'product found',
        product: product,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validateToken,
  authorizeRole('admin'),
  validatorHandler(schemaCreateProduct, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProduct = await createProduct(body);
      res.status(201).json({
        message: 'product created',
        product: newProduct,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validateToken,
  authorizeRole('admin'),
  validatorHandler(schemaGetProduct, 'params'),
  validatorHandler(schemaUpdateProduct, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedProduct = await updateProduct(id, body);
      res.status(200).json({
        message: 'product updated',
        product: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validateToken,
  authorizeRole('admin'),
  validatorHandler(schemaGetProduct, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await deleteProduct(id);
      res.status(200).json({
        message: `product with id ${id} deleted`,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
