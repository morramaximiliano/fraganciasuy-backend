import Joi from 'joi';

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const slug = Joi.string().min(3).max(50);

const schemaCreateCategory = Joi.object({
  name: name.required(),
  slug: slug.required(),
});

const schemaGetCategory = Joi.object({
  id: id.required(),
});

const schemaUpdateCategory = Joi.object({
  name: name,
  slug: slug,
});

export { schemaCreateCategory, schemaGetCategory, schemaUpdateCategory };
