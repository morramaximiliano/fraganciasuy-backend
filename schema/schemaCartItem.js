import Joi from 'joi';

const id = Joi.number().integer();
const skuId = Joi.number().integer();
const quantity = Joi.number().integer().positive();

const schemaCreateCartItem = Joi.object({
  skuId: skuId.required(),
  quantity: quantity.required(),
});

const schemaUpdateCartItem = Joi.object({
  quantity: quantity.required(),
});

const schemaGetCartItem = Joi.object({
  id: id.required(),
});

export { schemaCreateCartItem, schemaUpdateCartItem, schemaGetCartItem };
