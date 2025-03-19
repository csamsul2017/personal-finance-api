const Joi = require('joi');

const TransactionPayloadSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
  amount: Joi.number().positive().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = { TransactionPayloadSchema };
