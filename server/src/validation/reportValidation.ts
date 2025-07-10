import Joi from 'joi';

export const reportSchema = Joi.object({
  title: Joi.string().max(200).allow('').optional(),
  tags: Joi.array().items(Joi.string()).default([]),
  message: Joi.string().min(1).max(1000).required().messages({
    'string.empty': 'Message is required',
    'string.min': 'Message must not be empty',
    'any.required': 'Message is required',
  }),
}); 