const crypto = require('crypto')

function generateSalt (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

function hashPassword (password, salt) {
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  const value = hash.digest('hex')

  return value
}

function saltAndHashPassword (userpassword) {
  const salt = generateSalt(512)
  return {
    hashPassword: hashPassword(userpassword, salt),
    salt,
  }
}

function invalidPassword (password, dbPassword, salt) {
  return hashPassword(password, salt) !== dbPassword
}

module.exports = {
  invalidPassword,
  saltAndHashPassword,
  hashPassword,
}
