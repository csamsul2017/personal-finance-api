const transactions = require('.');

class TransactionsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postTransactionHandler = this.postTransactionHandler.bind(this);
    this.getAllTransactionsHandler = this.getAllTransactionsHandler.bind(this);
    this.getTransactionByIdHandler = this.getTransactionByIdHandler.bind(this);
    this.putTransactionByIdHandler = this.putTransactionByIdHandler.bind(this);
    this.deleteTransactionByIdHandler = this.deleteTransactionByIdHandler.bind(this);
  }

  postTransactionHandler(request, h) {
    try {
      this._validator.validateTransactionPayload(request.payload);
      const { type, amount, category, description } = request.payload;
      const transaction = this._service.addTransaction({ type, amount, category, description });

      return h
        .response({
          status: 'success',
          message: 'data successfully added',
          data: transaction,
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

  getTransactionByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const transaction = this._service.getTransactionById(id);

      if (!id) {
        throw new Error('Transaction ID is missing!');
      }

      return h
        .response({
          status: 'success',
          data: {
            transaction,
          },
        })
        .code(200);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      });
    }
  }

  putTransactionByIdHandler(request, h) {
    try {
      this._validator.validateTransactionPayload(request.payload);
      const { id } = request.params;
      const { type, amount, category, description } = request.payload;
      this._service.editTransactionById({ id, type, amount, category, description });

      return h
        .response({
          status: 'success',
          message: 'transaction successfully updated',
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

  deleteTransactionByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteTransactionById(id);

      return h
        .response({
          status: 'success',
          message: 'transaction successfully deleted',
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
}

module.exports = TransactionsHandler;
