import Joi from 'joi';
import { schemaItemCarrito } from './schemaOrderDetails.js';

const id = Joi.number().integer();
const status = Joi.string().valid('pending', 'paid', 'shipped', 'cancelled');
const shippingAddress = Joi.string().min(5);
const paymentMethod = Joi.string();

const schemaCreateOrder = Joi.object({
  shippingAddress: shippingAddress.required(),
  paymentMethod: paymentMethod.required(),
});

const schemaGetOrder = Joi.object({
  id: id.required(),
});

const schemaUpdateOrder = Joi.object({
  shippingAddress,
  status,
  paymentMethod,
});

export { schemaCreateOrder, schemaGetOrder, schemaUpdateOrder };
