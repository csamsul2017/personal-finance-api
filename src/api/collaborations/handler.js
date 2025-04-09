const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, transactionsService, validator) {
    this._collaborationsService = collaborationsService;
    this._transactionsService = transactionsService;
    this._validator = validator;
    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialid } = request.auth.credentials;
    const { transactionId, userId } = request.payload;

    await this._transactionsService.verifyTransactionOwner(
      transactionId,
      credentialid,
    );
    const collaborationId = await this._collaborationsService.addCollaboration(
      transactionId,
      userId,
    );

    return h
      .response({
        status: 'success',
        message: 'Collaboration successfully added',
        data: {
          collaborationId,
        },
      })
      .code(201);
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { transactionId, userId } = request.payload;

    await this._transactionsService.verifyTransactionOwner(
      transactionId,
      credentialId,
    );
    await this._collaborationsService.deleteCollaboration(
      transactionId,
      userId,
    );

    return h.response({
      status: 'success',
      message: 'Collaboration successfully deleted',
    });
  }
}

module.exports = CollaborationsHandler;
