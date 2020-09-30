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
    name: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().default('').empty(''),
    phone: Joi.string().default('').regex(PHONE_REGEX).empty(''),
    address: Joi.string().default('').empty('')
  }
}

v.updateUser = {
  body: {
    account: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().default('').empty(''),
    phone: Joi.string().default('').regex(PHONE_REGEX).empty(''),
    address: Joi.string().default('').empty('')
  }
}

v.deleteUser = {
  body: {
    account: Joi.string().email().required()
  }
}

v.activateUser = {
  body: {
    account: Joi.string().email().required(),
    state: Joi.number().required()
  }
}

// ------------------Context----------

exports.login = async ctx => {
  let { account, password } = ctx.request.body
  account = account.toLowerCase()
  await userModel.login(account)
    .then(res => {
      if (res && res.length > 0) {
        let { state, name } = res[0]
        if (state === ACCOUNT_ACTIVATED) {
          if (encodePassword(password) === res[0].password) {
            let userInfo = {
              account,
              name
            }
            let token = signToken(userInfo)
            ctx.set('Authorization', `Bearer ${token}`)
            ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS, userInfo)
          } else {
            ctx.body = new CustomError(constants.CUSTOM_CODE.INCORRECT_PASSWORD)
          }
        } else if (state === ACCOUNT_TO_BE_ACTIVATED) {
          ctx.body = new CustomError(constants.CUSTOM_CODE.ACCOUNT_TO_BE_ACTIVATED)
        } else if (state === ACCOUNT_DISABLED) {
          ctx.body = new CustomError(constants.CUSTOM_CODE.ACCOUNT_DISABLED)
        }
      } else {
        ctx.body = new CustomError(constants.CUSTOM_CODE.ACCOUNT_NOT_EXISTS)
      }
    }).catch((err) => {
      logger.error(`login error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.getUsers = async ctx => {
  await userModel.getUsers(ctx.query)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS, { users: res[0], total: res[1][0]['FOUND_ROWS()'] })
    }).catch((err) => {
      logger.error(`getUsers error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.createUser = async ctx => {
  let data = ctx.request.body
  data.account = data.account.toLowerCase()
  data.password = encodePassword(data.password)
  await userModel.createUser(data)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS)
    }).catch((err) => {
      logger.error(`createUser error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
    })
}

exports.updateUser = async ctx => {
  await userModel.updateUser(ctx.request.body)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS)
    }).catch((err) => {
      logger.error(`updateUser error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
    })
}

exports.deleteUser = async ctx => {
  const { account } = ctx.request.body
  await userModel.deleteUser(account)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS)
    }).catch((err) => {
      logger.error(`deleteUser error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
    })
}

exports.activateUser = async ctx => {
  await userModel.activateUser(ctx.request.body)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS)
    }).catch((err) => {
      logger.error(`activateUser error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
    })
}
