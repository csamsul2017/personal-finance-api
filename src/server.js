const Hapi = require('@hapi/hapi');
// const routes = require('./routes');
// const helloPlugin = require('../plugins/helloPlugin');
const transactions = require('./api/transactions');
const TransactionsService = require('./services/inMemory/TransactionsService');
const TransactionsValidator = require('./validator/transactions');

const init = async () => {
  const transactionsService = new TransactionsService();
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
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

  await server.start();
  console.log('server running on %s', server.info.uri);
};

init();
