const transactions = require('.');

class TransactionsHandler {
  constructor(service) {
    this._service = service;
    this.postTransactionHandler = this.postTransactionHandler.bind(this);
    this.getAllTransactionsHandler = this.getAllTransactionsHandler.bind(this);
  }

  postTransactionHandler(request, h) {
    try {
      const { type, amount, category, description } = request.payload;
      const transactionId = this._service.addTransaction({ type, amount, category, description });

      return h
        .response({
          status: 'success',
          message: 'data successfully added',
          data: {
            transactionId,
          },
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: 'fail',
          message: error.message,
        })
        .code(404);
    }
  }

  getAllTransactionsHandler() {
    const transactions = this._service.getAllTransactions();

    return {
      status: 'success',
      data: { transactions },
    };
  }
}

module.exports = TransactionsHandler;
