const InvariantError = require('../../exceptions/InvariantError');
const { TransactionPayloadSchema } = require('./schema');

const TransactionsValidator = {
  validateTransactionPayload: (payload) => {
    const validationResult = TransactionPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = TransactionsValidator;
