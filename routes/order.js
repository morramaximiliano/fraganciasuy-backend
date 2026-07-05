import express from 'express';
import { validateToken } from '../middlewares/validateAuth.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import { authorizeRole } from '../middlewares/checkRole.js';
import { schemaCreateOrder, schemaGetOrder } from '../schema/schemaOrder.js';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
} from '../service/serviceOrder.js';
import { Preference, MercadoPagoConfig } from 'mercadopago';
import { config } from '../env-config/config.js';

const router = express.Router();

router.use(validateToken);

router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createOrder(userId, req.body);
    res.status(201).json({
      success: true,
      newOrder: result.newOrder,
      items: result.itemsMercadoPago,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', authorizeRole('admin'), async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    return res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authorizeRole('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await deleteOrder(id);
    if (deletedOrder.success) {
      return res.status(200).json({
        id,
      });
    }
    res.status(404).json({
      message: 'orden no encontrada',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
