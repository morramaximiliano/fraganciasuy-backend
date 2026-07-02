import Joi from 'joi';

const id = Joi.number().integer();
const firstName = Joi.string().min(3).max(15);
const lastName = Joi.string().min(3).max(15);
const email = Joi.string().email();
const password = Joi.string().min(8);

const schemaCreateUser = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  email: email.required(),
  password: password.required(),
});

const schemaUpdateUser = Joi.object({
  firstName: firstName,
  lastName: lastName,
  email: email,
  password: password,
});

const schemaGetUser = Joi.object({
  id: id.required(),
});

export { schemaCreateUser, schemaUpdateUser, schemaGetUser };
