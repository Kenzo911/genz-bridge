import Joi from 'joi';

export const translateGenZSchema = Joi.object({
  term: Joi.string().min(1).max(500).required().messages({
    'string.min': 'Term must not be empty',
    'string.max': 'Term cannot exceed 500 characters',
    'any.required': 'Term is required',
  }),
}); 