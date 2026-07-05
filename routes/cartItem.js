import express from 'express';
import { validateToken } from '../middlewares/validateAuth.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import {
  schemaCreateCartItem,
  schemaUpdateCartItem,
  schemaGetCartItem,
} from '../schema/schemaCartItem.js';
import {
  getCartByUser,
  syncEntireCart,
  clearCart,
} from '../service/serviceCartItem.js';

const router = express.Router();

router.use(validateToken);

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await getCartByUser(userId);
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});

router.post('/sync', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    const updatedCart = await syncEntireCart(userId, items);
    return res.status(200).json({
      success: true,
      message: 'Carrito sincronizado en la base de datos',
      cartItems: updatedCart,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/clear', async (req, res, next) => {
  try {
    const userId = req.user.id;
    await clearCart(userId);
    res.status(200).json({
      success: true,
      message: 'Carrito vaciado exitosamente',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
