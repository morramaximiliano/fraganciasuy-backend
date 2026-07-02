import express from 'express';
import {
  getAllCategories,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../service/serviceCategory.js';
import {
  schemaCreateCategory,
  schemaGetCategory,
  schemaUpdateCategory,
} from '../schema/schemaCategory.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import { validateToken } from '../middlewares/validateAuth.js';
import { authorizeRole } from '../middlewares/checkRole.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(schemaGetCategory, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await getOneCategory(id);
      res.status(200).json({
        message: 'category found',
        category: category,
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
  validatorHandler(schemaCreateCategory, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await createCategory(body);
      res.status(201).json({
        message: 'category created',
        category: newCategory,
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
  validatorHandler(schemaGetCategory, 'params'),
  validatorHandler(schemaUpdateCategory, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedCategory = await updateCategory(id, body);
      res.status(200).json({
        message: 'category updated',
        category: updatedCategory,
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
  validatorHandler(schemaGetCategory, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await deleteCategory(id);
      res.status(200).json({
        message: `category with id ${id} deleted`,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
