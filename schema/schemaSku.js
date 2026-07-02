import Joi from 'joi';

const id = Joi.number().integer();
const productId = Joi.number().integer();
const sizeMl = Joi.number().integer();
const price = Joi.number().positive().precision(2);
const stock = Joi.number().integer().positive().min(0);
const skuCode = Joi.string().uppercase().alphanum();

const schemaCreateSku = Joi.object({
  productId: productId.required(),
  sizeMl: sizeMl.required(),
  price: price.required(),
  stock: stock.required(),
  skuCode: skuCode.required(),
});

const schemaUpdateSku = Joi.object({
  productId: productId,
  sizeMl: sizeMl,
  price: price,
  stock: stock,
  skuCode: skuCode,
});

const schemaGetSku = Joi.object({
  id: id.required(),
});

export { schemaCreateSku, schemaGetSku, schemaUpdateSku };
