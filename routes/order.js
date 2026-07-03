import express from 'express';
import { validateToken } from '../middlewares/validateAuth.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import { authorizeRole } from '../middlewares/checkRole.js';
import { schemaCreateOrder, schemaGetOrder } from '../schema/schemaOrder.js';
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  getAllOrders,
} from '../service/serviceOrder.js';

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

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUser(userId);

    return res.status(200).json({ orders });
  } catch (error) {
    next(error);
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

router.get(
  '/:id',
  validatorHandler(schemaGetOrder, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const orderId = req.params.id;

      const order = await getOrderById(userId, orderId);

      return res.status(200).json({ order });
    } catch (error) {
      if (error.message === 'ORDER_NOT_FOUND') {
        return res.status(404).json({
          message:
            'La orden solicitada no existe o no tienes permisos para verla',
        });
      }
      next(error);
    }
  },
);

router.patch(
  '/:id/confirm-payment',
  validatorHandler(schemaGetOrder, 'params'),
  async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const userId = req.user.id;

      const order =
        (await req.app.get('sequelize')?.[1]) ||
        (await import('../libs/sequelize.js')).default.models.Order.findOne({
          where: { id: orderId, userId },
        });

      if (!order) {
        return res.status(404).json({
          message: 'La orden no existe o no pertenece a este usuario.',
        });
      }

      order.status = 'paid';
      await order.save();

      return res.status(200).json({
        message: 'Pago confirmado y orden actualizada con éxito.',
        order,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
