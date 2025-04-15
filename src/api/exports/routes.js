const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/transactions',
    handler: handler.postExportTransactionsHandler,
    options: {
      auth: 'financeapp_jwt',
    },
  },
];

module.exports = routes;
