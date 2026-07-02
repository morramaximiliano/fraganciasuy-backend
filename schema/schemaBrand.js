import Joi from 'joi';

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const description = Joi.string();

const schemaCreateBrand = Joi.object({
  name: name.required(),
  description: description.required(),
});

const schemaUpdateBrand = Joi.object({
  name: name,
  description: description,
});

const schemaGetBrand = Joi.object({
  id: id.required(),
});

export { schemaCreateBrand, schemaGetBrand, schemaUpdateBrand };
