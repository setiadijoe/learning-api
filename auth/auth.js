require('dotenv').config()

const bcrypt = require('bcrypt')

const usernameHash = process.env.USERNAME
const passwordHash = process.env.PASSWORD

const compareUsernamePassword = async (request, username, password) => {
  if (username !== usernameHash) return {credentials: null, isValid: false}
  const isValid = await bcrypt.compare(password, passwordHash)
  const credentials = {username}
  return {credentials, isValid}
}

module.exports = {
  compareUsernamePassword
}
