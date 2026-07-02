import express from 'express';
import {
  getAllSkus,
  getOneSku,
  createSku,
  updateSku,
  deleteSku,
} from '../service/serviceSku.js';
import {
  schemaCreateSku,
  schemaGetSku,
  schemaUpdateSku,
} from '../schema/schemaSku.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import { validateToken } from '../middlewares/validateAuth.js';
import { authorizeRole } from '../middlewares/checkRole.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const skus = await getAllSkus();
    return res.status(200).json({ skus });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(schemaGetSku, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const sku = await getOneSku(id);
      res.status(200).json({
        message: 'sku found',
        sku: sku,
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
  validatorHandler(schemaCreateSku, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newSku = await createSku(body);
      res.status(201).json({
        message: 'sku created',
        sku: newSku,
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
  validatorHandler(schemaGetSku, 'params'),
  validatorHandler(schemaUpdateSku, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedSku = await updateSku(id, body);
      res.status(200).json({
        message: 'sku updated',
        sku: updatedSku,
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
  validatorHandler(schemaGetSku, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await deleteSku(id);
      res.status(200).json({
        message: `sku with id ${id} deleted`,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
