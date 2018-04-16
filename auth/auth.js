require('dotenv').config()

const bcrypt = require('bcrypt')

const usernameHash = process.env.USERNAME || 'username'
const passwordHash = process.env.PASSWORD || '$2b$10$m8pg3ys8v.7VKq4XyMLhceduBx7ShoazOHzoSoiQaTktKAsNO4g0O'

const compareUsernamePassword = async (request, username, password) => {
  if (username !== usernameHash) return {credentials: null, isValid: false}
  const isValid = await bcrypt.compare(password, passwordHash)
  const credentials = {username}
  return {credentials, isValid}
}

module.exports = {
  compareUsernamePassword
}
