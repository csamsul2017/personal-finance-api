const routes = (handler) => [
  {
    method: 'POST',
    path: '/auths',
    handler: handler.postAuthHandler,
  },
  {
    method: 'PUT',
    path: '/auths',
    handler: handler.putAuthHandler,
  },
  {
    method: 'DELETE',
    path: '/auths',
    handler: handler.deleteAuthHandler,
  },
];

module.exports = routes;
