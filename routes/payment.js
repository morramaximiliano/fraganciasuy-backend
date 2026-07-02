import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config } from '../env-config/config.js';
import { validateToken } from '../middlewares/validateAuth.js';

const router = express.Router();
router.use(validateToken);

router.post('/create-preference', async (req, res, next) => {
  try {
    const { orderId, totalAmount } = req.body;

    if (!config.mercadoPagoAccessToken) {
      return res.status(500).json({
        message:
          'Falta configurar la variable de entorno MERCADO_PAGO_ACCESS_TOKEN',
      });
    }

    if (!orderId || !totalAmount) {
      return res.status(400).json({ message: 'Datos de orden incompletos' });
    }

    const client = new MercadoPagoConfig({
      accessToken: config.mercadoPagoAccessToken,
    });

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: `Orden #${orderId}`,
            unit_price: Number(totalAmount),
            quantity: 1,
            currency_id: 'UYU',
          },
        ],
        back_urls: {
          success: 'https://unsliced-sandbag-unequal.ngrok-free.dev/success',
          failure: 'https://unsliced-sandbag-unequal.ngrok-free.dev/failure',
          pending: 'https://unsliced-sandbag-unequal.ngrok-free.dev/pending',
        },
        auto_return: 'approved',
        binary_mode: true,
      },
    });

    res.status(200).json({ preferenceId: result.id });
  } catch (error) {
    console.error('Error detallado de Mercado Pago:', error);
    next(error);
  }
});

export default router;
