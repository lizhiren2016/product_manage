const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const config = require('../config/default')

const tokenExpires = { expiresIn: '30d' }

// 验证jwt用户传过来的token
exports.getUserInfo = (ctx) => {
  try {
    if (!ctx.request.header.authorization) return null
    let token = ctx.request.header.authorization.slice(7)
    return jwt.verify(token, config.secret)
  } catch (err) {
    return null
  }
}

exports.encodePassword = (pass) => {
  let password = Buffer.from(pass, 'base64')
  const hmac = crypto.createHmac('sha1', 'moIHij9oU(*bik&^%&*imlYUTink$%E6fU#f278')
  const up = hmac.update(password)
  return up.digest('hex')
}

exports.signToken = (payload = {}) => {
  return jwt.sign(payload, config.secret, tokenExpires)
}

//  创建多层级文件夹
exports.makeDir = (dirpath) => {
  if (!fs.existsSync(dirpath)) {
    var pathtmp
    dirpath.split('/').forEach(function (dirname) {
      if (pathtmp) {
        pathtmp = path.join(pathtmp, dirname)
      } else {
        // 如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
        if (dirname) {
          pathtmp = dirname
        } else {
          pathtmp = '/'
        }
      }
      if (!fs.existsSync(pathtmp)) {
        if (!fs.mkdirSync(pathtmp)) {
          return false
        }
      }
    })
  }
  return true
}
