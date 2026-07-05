import express from 'express';
import { Transaction } from 'sequelize';
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

  await sequelize.transaction(async (transaction) => {
    const lockedOrder = await sequelize.models.Order.findByPk(orderId, {
      transaction,
      lock: Transaction.LOCK.UPDATE,
    });

    if (!lockedOrder) {
      console.warn(
        `No se encontró la orden ${orderId} para payment ${paymentId}`,
      );
      return;
    }

    if (lockedOrder.status === 'paid') {
      return;
    }

    const orderDetails = await sequelize.models.OrderDetails.findAll({
      where: { orderId },
      transaction,
    });

    for (const detail of orderDetails) {
      const sku = await sequelize.models.ProductSku.findByPk(detail.skuId, {
        transaction,
        lock: Transaction.LOCK.UPDATE,
        attributes: ['id', 'stock'],
      });

      if (!sku) {
        throw new Error(
          `No se encontró el SKU ${detail.skuId} de la orden ${orderId}`,
        );
      }

      const currentStock = Number(sku.stock);
      const quantity = Number(detail.quantity);

      await sku.update(
        {
          stock: currentStock - quantity,
        },
        { transaction },
      );
    }

    await lockedOrder.update(
      {
        status: 'paid',
      },
      { transaction },
    );

    console.log(
      `Orden ${lockedOrder.id} marcada como paid y stock descontado desde payment ${paymentId}`,
    );
  });
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
