const userModel = require('../db/mysql/models/user')
const Joi = require('@hapi/joi')
const { encodePassword, signToken } = require('../utils/tools')
const { CustomError } = require('../utils/customError')
const constants = require('../utils/constants')
const logger = require('../utils/logger')

const v = {}
exports.v = v

const ACCOUNT_DISABLED = 2 // 禁用
const ACCOUNT_TO_BE_ACTIVATED = 1 // 未激活
const ACCOUNT_ACTIVATED = 0 // 已激活
const PHONE_REGEX = /^1[345678]\d{9}$/
// -----------------Rule--------

v.login = {
  body: {
    account: Joi.string().email().required(),
    password: Joi.string().required(),
    user_type: Joi.string().default('ecoflow_user'),
    os: Joi.string().default('web')
  }
}

v.getUsers = {
  query: {
    limit: Joi.number().default(20),
    offset: Joi.number().default(0),
    query: Joi.string().default('').empty('')
  }
}

v.createUser = {
  body: {
    account: Joi.string().email().required(),
    password: Joi.string().required(),