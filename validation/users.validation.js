const Joi = require("joi");

//_@_.__
const emailRole = {
  email: Joi.string().email().min(6).max(255).trim().required(),
};
const passwordRole = {
  password: Joi.string()
    .regex(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*() ]).{6,12}$"
      )
    )
    .required(),
};
const firstnameRole = {
  firstname: Joi.string().min(2).max(255).alphanum().trim().required(),
};
const lastnameRole = {
  lastname: Joi.string().min(2).max(255).alphanum().trim().required(),
};
const phoneRole = {
  phone: Joi.string().min(3).max(255).trim(),
};

const signupSchema = Joi.object({
  ...emailRole,
  ...passwordRole,
  ...firstnameRole,
  ...lastnameRole,
  ...phoneRole,
});

const validateSignupSchema = (data) => {
  return signupSchema.validateAsync(data, { abortEarly: false });
};

module.exports = {
  validateSignupSchema,
};
