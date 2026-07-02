import express from 'express';
import {
  getAllBrands,
  getOneBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../service/serviceBrand.js';
import {
  schemaCreateBrand,
  schemaGetBrand,
  schemaUpdateBrand,
} from '../schema/schemaBrand.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import { validateToken } from '../middlewares/validateAuth.js';
import { authorizeRole } from '../middlewares/checkRole.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const brands = await getAllBrands();
    return res.status(200).json({ brands });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(schemaGetBrand, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const brand = await getOneBrand(id);
      res.status(200).json({
        message: 'brand found',
        brand: brand,
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
  validatorHandler(schemaCreateBrand, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newBrand = await createBrand(body);
      res.status(201).json({
        message: 'brand created',
        brand: newBrand,
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
  validatorHandler(schemaGetBrand, 'params'),
  validatorHandler(schemaUpdateBrand, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedBrand = await updateBrand(id, body);
      res.status(200).json({
        message: 'brand updated',
        brand: updatedBrand,
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
  validatorHandler(schemaGetBrand, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await deleteBrand(id);
      res.status(200).json({
        message: `brand with id ${id} deleted`,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
