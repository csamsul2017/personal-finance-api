const autoBind = require('auto-bind');

class TransactionsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postTransactionHandler(request, h) {
    this._validator.validateTransactionPayload(request.payload);
    const { type, amount, category, description } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const transactionId = await this._service.addTransaction({
      type,
      amount,
      category,
      description,
      owner: credentialId,
    });

    return h
      .response({
        status: 'success',
        message: 'data successfully added',
        data: { transactionId },
      })
      .code(201);
  }

  async getTransactionsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const transactions = await this._service.getTransactions(credentialId);

    return {
      status: 'success',
      data: { transactions },
    };
  }

  async getTransactionByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyTransactionAccess(id, credentialId);
    const transaction = await this._service.getTransactionById(id);

    // console.log(transaction);
    return h.response({
      status: 'success',
      data: {
        transaction,
      },
    });
  }

  async putTransactionByIdHandler(request, h) {
    this._validator.validateTransactionPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyTransactionAccess(id, credentialId);
    await this._service.editTransactionById(id, request.payload);

    return h
      .response({
        status: 'success',
        message: 'transaction successfully updated',
      })
      .code(200);
  }

  async deleteTransactionByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyTransactionOwner(id, credentialId);

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
