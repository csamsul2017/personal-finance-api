const { postTransactionHandler, getAllTransactionsHandler, getTransactionByIdHandler, putTransactionByIdHandler, deleteTransactionByIdHandler } = require('./handlers');

const routes = [
  {
    method: 'POST',
    path: '/transactions',
    handler: postTransactionHandler,
  },
  {
    method: 'GET',
    path: '/transactions',
    handler: getAllTransactionsHandler,
  },
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: getTransactionByIdHandler,
  },
  {
    method: 'PUT',
    path: '/transactions/{id}',
    handler: putTransactionByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/transactions/{id}',
    handler: deleteTransactionByIdHandler,
  },
];

module.exports = routes;
