import express from 'express';
import { Payment, MercadoPagoConfig } from 'mercadopago';
import { config } from '../env-config/config.js';
import sequelize from '../libs/sequelize.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  console.log('Webhook recibido de Mercado Pago');
  console.log('Query params:', req.query);
  console.log('Body:', req.body);

  const eventType = req.body?.type || req.query.type || req.query.topic;
  const idFromQuery = req.query['data.id'] || req.query.id;
  const idFromBody = req.body?.data?.id;
  const resourceIdMatch = req.body?.resource?.match(/\/(\d+)$/);
  const idFromResource = resourceIdMatch ? resourceIdMatch[1] : null;
  const paymentId = idFromQuery || idFromBody || idFromResource;

  if (eventType && eventType !== 'payment') {
    // Mercado Pago puede enviar otros eventos (merchant_order, etc.).
    return res.status(200).send('Evento ignorado');
  }

  if (!paymentId) {
    return res.status(200).send('Sin payment id para procesar');
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
        if (order.status !== 'paid') {
          await order.update({ status: 'paid' });
          console.log(
            `Orden ${order.id} marcada como paid desde payment ${paymentId}`,
          );
        }
      } else {
        console.warn(
          `No se encontró la orden ${paymentData.external_reference} para payment ${paymentId}`,
        );
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).send('Error');
  }
});

export default router;
