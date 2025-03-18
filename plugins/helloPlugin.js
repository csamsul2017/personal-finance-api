const helloPlugin = {
  name: 'helloPlugin',
  version: '1.0.0',
  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/hello',
      handler: (request, h) => {
        return { message: 'Hello from Hapi plugin!' };
      },
    });
  },
};

module.exports = helloPlugin;
