import Joi from 'joi';

const id = Joi.number().integer();
const brandId = Joi.number().integer();
const categoryId = Joi.number().integer();
const name = Joi.string().min(2).max(50);
const description = Joi.string();
const imageUrl = Joi.string().uri();
const isActive = Joi.boolean();

const schemaCreateProduct = Joi.object({
  brandId: brandId.required(),
  categoryId: categoryId,
  name: name.required(),
  description: description.required(),
  imageUrl: imageUrl.required(),
  isActive: isActive,
});

const schemaUpdateProduct = Joi.object({
  brandId: brandId,
  categoryId: categoryId,
  name: name,
  description: description,
  imageUrl: imageUrl,
  isActive: isActive,
});

const schemaGetProduct = Joi.object({
  id: id.required(),
});

export { schemaCreateProduct, schemaGetProduct, schemaUpdateProduct };
