import express from 'express';
import {
  getAllUser,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
} from '../service/serviceUser.js';
import {
  schemaCreateUser,
  schemaGetUser,
  schemaUpdateUser,
} from '../schema/schemaUser.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import { validateToken } from '../middlewares/validateAuth.js';
import { authorizeRole } from '../middlewares/checkRole.js';
const router = express.Router();

router.get(
  '/',
  validateToken,
  authorizeRole('admin'),
  async (req, res, next) => {
    try {
      const users = await getAllUser();
      return res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/:id',
  validateToken,
  authorizeRole('admin'),
  validatorHandler(schemaGetUser, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await getOneUser(id);
      res.status(200).json({
        message: 'user found',
        user: user,
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
  validatorHandler(schemaCreateUser, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await createUser(body);
      res.status(201).json({
        message: 'user created',
        user: newUser,
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
  validatorHandler(schemaGetUser, 'params'),
  validatorHandler(schemaUpdateUser, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedUser = await updateUser(id, body);
      res.status(200).json({
        message: 'user updated',
        user: updatedUser,
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
  validatorHandler(schemaGetUser, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await deleteUser(id);
      res.status(200).json({
        message: `user with id ${id} deleted`,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
