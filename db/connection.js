const DbConfig = require('../config/config')
const ServerConfig = require('../config/server')
const { Client } = require('pg')
const client = new Client(DbConfig[ServerConfig.env])

await client.connect()

console.log('====================================')
console.log('Connected to Database')
console.log('====================================')

module.exports = client