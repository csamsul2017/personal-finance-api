const routes = handler => [
  {
    method: 'POST',
    path: '/transactions',
    handler: handler.postTransactionHandler,
  },
  {
    method: 'GET',
    path: '/transactions',
    handler: handler.getAllTransactionsHandler,
  },
];

module.exports = routes;
