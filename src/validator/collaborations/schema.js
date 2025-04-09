const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  transactionId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };
