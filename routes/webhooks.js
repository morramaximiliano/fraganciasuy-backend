import express from 'express';
import { Payment, MercadoPagoConfig, MerchantOrder } from 'mercadopago';
import { config } from '../env-config/config.js';
import sequelize from '../libs/sequelize.js';

const router = express.Router();

const getIdFromNotification = (req) => {
  const idFromQuery = req.query['data.id'] || req.query.id;
  const idFromBody = req.body?.data?.id;
  const resourceIdMatch = req.body?.resource?.match(/\/(\d+)$/);
  const idFromResource = resourceIdMatch ? resourceIdMatch[1] : null;
  return idFromQuery || idFromBody || idFromResource;
};

const markOrderAsPaid = async (paymentData, paymentId) => {
  if (paymentData.status !== 'approved') {
    return;
  }

  const orderId = paymentData.external_reference;
  if (!orderId) {
    console.warn(`Payment ${paymentId} no tiene external_reference`);
    return;
  }

  const order = await sequelize.models.Order.findByPk(orderId);

  if (!order) {
    console.warn(
      `No se encontró la orden ${orderId} para payment ${paymentId}`,
    );
    return;
  }

  if (order.status !== 'paid') {
    await order.update({ status: 'paid' });
    console.log(
      `Orden ${order.id} marcada como paid desde payment ${paymentId}`,
    );
  }
};

const webhookHandler = async (req, res) => {
  console.log('Webhook recibido de Mercado Pago');
  console.log('Query params:', req.query);
  console.log('Body:', req.body);

  const eventType = req.body?.type || req.query.type || req.query.topic;
  const action = req.body?.action || req.query.action;
  const notificationId = getIdFromNotification(req);

  try {
    const client = new MercadoPagoConfig({
      accessToken: config.mercadoPagoAccessToken,
    });

    const isPaymentEvent =
      eventType === 'payment' ||
      action?.startsWith('payment.') ||
      (!eventType && !action);

    if (isPaymentEvent) {
      if (!notificationId) {
        return res.status(200).send('Sin payment id para procesar');
      }

      const paymentService = new Payment(client);
      const paymentData = await paymentService.get({ id: notificationId });
      await markOrderAsPaid(paymentData, notificationId);
      return res.status(200).send('OK');
    }

    if (
      eventType === 'merchant_order' ||
      action?.startsWith('merchant_order.')
    ) {
      if (!notificationId) {
        return res.status(200).send('Sin merchant order id para procesar');
      }

      const merchantOrderService = new MerchantOrder(client);
      const merchantOrderData = await merchantOrderService.get({
        merchantOrderId: notificationId,
      });

      const approvedPayment = merchantOrderData.payments?.find(
        (payment) => payment.status === 'approved',
      );

      if (!approvedPayment?.id) {
        return res.status(200).send('Merchant order sin pago aprobado');
      }

      const paymentService = new Payment(client);
      const paymentData = await paymentService.get({ id: approvedPayment.id });
      await markOrderAsPaid(paymentData, approvedPayment.id);
      return res.status(200).send('OK');
    }

    return res.status(200).send('Evento ignorado');
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).send('Error');
  }
};

router.post('/', webhookHandler);
router.get('/', webhookHandler);

export default router;
