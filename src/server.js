require('dotenv').config();
const Hapi = require('@hapi/hapi');
const transactions = require('./api/transactions');
const TransactionsService = require('./services/postgres/TransactionsService');
const TransactionsValidator = require('./validator/transactions');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const transactionsService = new TransactionsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: transactions,
    options: {
      service: transactionsService,
      validator: TransactionsValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log('server running on %s', server.info.uri);
};

init();
