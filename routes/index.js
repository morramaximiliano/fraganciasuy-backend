import express from 'express';
import usersRouter from '../routes/users.js';
import brandsRouter from '../routes/brands.js';
import skusRouter from '../routes/skus.js';
import productsRouter from '../routes/products.js';
import categoriesRouter from '../routes/categories.js';
import authRouter from '../routes/auth.js';
import cartItemRouter from '../routes/cartItem.js';
import orderRouter from '../routes/order.js';
import paymentRouter from '../routes/payment.js';
import webHooksRouter from '../routes/webhooks.js';

function apiRouter(app) {
  const router = express.Router();
  router.use('/auth', authRouter);
  router.use('/users', usersRouter);
  router.use('/cart', cartItemRouter);
  router.use('/payments', paymentRouter);
  router.use('/orders', orderRouter);
  router.use('/brands', brandsRouter);
  router.use('/products', productsRouter);
  router.use('/skus', skusRouter);
  router.use('/categories', categoriesRouter);
  router.use('/mp', webHooksRouter);
  app.use('/api/v1', router);
}

export default apiRouter;
