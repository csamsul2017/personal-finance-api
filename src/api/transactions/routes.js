const routes = (handler) => [
  {
    method: 'POST',
    path: '/transactions',
    handler: handler.postTransactionHandler,
    options: { auth: 'financeapp_jwt' },
  },
  {
    method: 'GET',
    path: '/transactions',
    handler: handler.getTransactionsHandler,
    options: { auth: 'financeapp_jwt' },
  },
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: handler.getTransactionByIdHandler,
    options: { auth: 'financeapp_jwt' },
  },
  {
    method: 'PUT',
    path: '/transactions/{id}',
    handler: handler.putTransactionByIdHandler,
    options: { auth: 'financeapp_jwt' },
  },

  {
    method: 'DELETE',
    path: '/transactions/{id}',
    handler: handler.deleteTransactionByIdHandler,
    options: { auth: 'financeapp_jwt' },
  },
];

module.exports = routes;
