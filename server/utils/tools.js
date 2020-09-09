const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config/default')

const tokenExpires = { expiresIn: '30d' }

exports.encodePassword = (pass) => {
  let password = Buffer.from(pass, 'base64')
  const hmac = crypto.createHmac('sha1', 'moIHij9oU(*bik&^%&*imlYUTink$%E6fU#f278')
  const up = hmac.update(password)
  return up.digest('hex')
}

exports.signToken = (payload = {}) => {
  return jwt.sign(payload, config.secret, tokenExpires)
}
