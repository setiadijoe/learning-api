const ConfigServer = require('./server')
const routes = require('./../routes')

const Environment = ConfigServer['env']
const AppVersion = ConfigServer['version']

const plugins = {
  server: {
    port: ConfigServer.port,
    host: ConfigServer.host,
    routes: {
      cors: true
    }
  },
  register: {
    plugins: [
      { plugin: routes },
      { plugin: 'hapi-auth-basic' },
      { plugin: './plugin/basic-auth.js' }
    ]
  }
}

if (Environment.toLowerCase() === 'development') {
  plugins['register']['plugins'].push({
    plugin: require('blipp')
  },
  {
    plugin: require('hapi-swagger'),
    options: {
      info: {
        title: 'API Documentation',
        version: AppVersion,
        contact: {
          name: 'Rizky',
          email: 'rizky.saputro@taralite.com'
        }
      }
    }
  },
  {
    plugin: require('good'),
    options: {
      ops: { interval: 1000 },
      reporters: {
        console: [
          { module: 'good-squeeze', name: 'Squeeze', args: [{ log: '*', response: '*', error: '*' }] },
          { module: 'good-console' },
          'stdout'
        ]
      }
    }
  },
  {
    plugin: require('inert')
  },
  {
    plugin: require('vision')
  })
}

module.exports = plugins
