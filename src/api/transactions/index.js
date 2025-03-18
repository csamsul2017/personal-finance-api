const routes = require('./routes');
const TransactionsHandler = require('./handler');

module.exports = {
  name: 'transactions',
  version: '1.0.0',
  register: async (server, { service }) => {
    const transactionsHandler = new TransactionsHandler(service);
    server.route(routes(transactionsHandler));
  },
};
