import Joi from 'joi';

const timeRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/;

export const createShiftDto = Joi.object({
  name: Joi.string().required(),
  date: Joi.string().required(),
  startTime: Joi.string().regex(timeRegex).required(),
  endTime:Joi.string().regex(timeRegex).required(),
  intervalWeek:Joi.string().required()
});

export const updateShiftDto = Joi.object({
  name: Joi.string(),
  date: Joi.string(),
  startTime: Joi.string().regex(timeRegex),
  endTime:Joi.string().regex(timeRegex),
  intervalWeek:Joi.string().required()
});