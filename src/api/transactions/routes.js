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
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: handler.getTransactionByIdHandler,
  },
];

module.exports = routes;
