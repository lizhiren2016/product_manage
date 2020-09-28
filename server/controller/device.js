const deviceModel = require('../db/mysql/models/device')
const Joi = require('@hapi/joi')
const { CustomError } = require('../utils/customError')
const constants = require('../utils/constants')
const logger = require('../utils/logger')

const v = {}
exports.v = v

// -----------------Rule--------

v.getDevices = {
  query: {
    limit: Joi.number().default(20),
    offset: Joi.number().default(0),
    query: Joi.string().default('').empty(''),
    product: Joi.number().default(0)
  }
}

v.countDeviceByScope = {
  query: {
    scope: Joi.number().required(),
    product: Joi.number().required()
  }
}

v.deleteDevice = {
  params: {
    sn: Joi.string().required()
  }
}

// ------------------Context----------

exports.getDevices = async ctx => {
  await deviceModel.getDevices(ctx.query)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS, { products: res[0], total: res[1][0]['FOUND_ROWS()'] })
    }).catch((err) => {
      logger.error(`getDevices error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.countDeviceByScope = async ctx => {
  await deviceModel.countDeviceByScope(ctx.query)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS, res)
    }).catch((err) => {
      logger.error(`countDeviceByScope error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.deleteDevice = async ctx => {
  const { sn } = ctx.params
  await deviceModel.deleteDevice(sn)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS)
    }).catch((err) => {
      logger.error(`deleteDevice error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
    })
}
