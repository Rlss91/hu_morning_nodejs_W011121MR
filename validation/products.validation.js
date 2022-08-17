const Joi = require("joi");

const nameRole = {
  name: Joi.string().min(2).max(255).trim().required(),
};
const priceRole = {
  price: Joi.number().min(Number.MIN_VALUE).required(),
};
const descriptionRole = {
  description: Joi.string().trim().min(1).max(16000).required(),
};
const stockRole = {
  stock: Joi.number().min(0),
};
const sellerId = {
  sellerId: Joi.string().hex().length(24).trim().required(),
};

const newProductSchema = Joi.object({
  ...nameRole,
  ...priceRole,
  ...descriptionRole,
  ...stockRole,
  //   ...sellerId,
});

const validateNewProductSchema = (data) => {
  return newProductSchema.validateAsync(data, { abortEarly: false });
};

module.exports = {
  validateNewProductSchema,
};
