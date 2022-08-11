import Joi from 'joi';

export const createWeekDto = Joi.object({
  weekRange: Joi.string().required(),
  weekInterval: Joi.string().required(),
  publishedAt: Joi.string().required(),
});