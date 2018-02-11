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
      { plugin: routes }
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
    plugin: require('inert')
  },
  {
    plugin: require('vision')
  })
}

module.exports = plugins;
