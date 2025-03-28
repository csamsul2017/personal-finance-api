class TransactionsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postTransactionHandler = this.postTransactionHandler.bind(this);
    this.getTransactionsHandler = this.getTransactionsHandler.bind(this);
    this.getTransactionByIdHandler = this.getTransactionByIdHandler.bind(this);
    this.putTransactionByIdHandler = this.putTransactionByIdHandler.bind(this);
    this.deleteTransactionByIdHandler = this.deleteTransactionByIdHandler.bind(this);
  }

  async postTransactionHandler(request, h) {
    this._validator.validateTransactionPayload(request.payload);
    const { type, amount, category, description } = request.payload;
    const transactionId = await this._service.addTransaction({ type, amount, category, description });

    return h
      .response({
        status: 'success',
        message: 'data successfully added',
        data: { transactionId },
      })
      .code(201);
  }

  async getTransactionsHandler() {
    const transactions = await this._service.getTransactions();

    return {
      status: 'success',
      data: { transactions },
    };
  }

  async getTransactionByIdHandler(request, h) {
    const { id } = request.params;
    const transaction = await this._service.getTransactionById(id);

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
      .code(201);
  }

  async putTransactionByIdHandler(request, h) {
    this._validator.validateTransactionPayload(request.payload);
    const { id } = request.params;
    const { type, amount, category, description } = request.payload;
    await this._service.editTransactionById({ id, type, amount, category, description });

    return h
      .response({
        status: 'success',
        message: 'transaction successfully updated',
      })
      .code(200);
  }

  async deleteTransactionByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteTransactionById(id);

    return h
      .response({
        status: 'success',
        message: 'transaction successfully deleted',
      })
      .code(200);
  }
}

module.exports = TransactionsHandler;
