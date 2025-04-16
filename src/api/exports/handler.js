const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postExportTransactionsHandler(request, h) {
    this._validator.validateExportTransactionsPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage(
      'export:transactions',
      JSON.stringify(message),
    );

    return h
      .response({
        status: 'success',
        message: 'Permintaan anda dalam antrean',
      })
      .code(201);
  }
}

module.exports = ExportsHandler;
