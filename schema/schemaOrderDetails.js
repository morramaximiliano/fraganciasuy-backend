import Joi from 'joi';

const id = Joi.number().integer();
const orderId = Joi.number().integer();
const skuId = Joi.number().integer();
const quantity = Joi.number().integer().positive();
const priceAtPurchase = Joi.number().positive().precision(2);

const schemaItemCarrito = Joi.object({
  skuId: skuId.required(),
  quantity: quantity.required(),
});

const schemaCreateOrderDetails = Joi.object({
  orderId: orderId.required(),
  skuId: skuId.required(),
  quantity: quantity.required(),
  priceAtPurchase: priceAtPurchase.required(),
});

const schemaUpdateOrderDetails = Joi.object({
  orderId,
  skuId,
  quantity,
  priceAtPurchase,
});

const schemaGetOrderDetails = Joi.object({
  id: id.required(),
});

export {
  schemaCreateOrderDetails,
  schemaGetOrderDetails,
  schemaUpdateOrderDetails,
  schemaItemCarrito,
};
