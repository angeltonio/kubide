import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DB: Joi.required(),
  PORT: Joi.number().default(3005),
});
