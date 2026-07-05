import express from 'express';
import { Payment, MercadoPagoConfig } from 'mercadopago';
import { config } from '../env-config/config.js';
import sequelize from '../libs/sequelize.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  console.log('¡Webhook recibido!');
  console.log('Query params:', req.query);
  console.log('Body:', req.body);
  const paymentId = req.query['data.id'] || req.body.data?.id;
  if (!paymentId) {
    return res.status(400).send('Falta el ID de pago');
  }
  try {
    const client = new MercadoPagoConfig({
      accessToken: config.mercadoPagoAccessToken,
    });
    const paymentService = new Payment(client);
    const paymentData = await paymentService.get({ id: paymentId });
    if (paymentData.status === 'approved') {
      const order = await sequelize.models.Order.findByPk(
        paymentData.external_reference,
      );
      if (order) {
        await order.update({ status: 'paid' });
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error procesando webhok:', error);
    res.status(500).send('Error');
  }
});

export default router;
