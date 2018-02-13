const redirector = require('./handlers/redirector')

const routes = {
  register: (server, options) => {
    server.route([{
      method: 'GET',
      path: '/',
      config: {
        handler: (request, h) => 'It works buddy',
        description: 'Root API',
        notes: 'return server status'
      }
    },
    {
      method: 'GET',
      path: '/{VA}/{signature}',
      config: {
        handler: redirector,
        description: 'VA redirector',
        notes: 'takes the query and redirect to specific routing'
      }
    }
  ])
  },
  name: 'routes-plugin'
}

module.exports = routes;
