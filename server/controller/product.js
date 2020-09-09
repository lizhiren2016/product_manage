const productModel = require('../db/models/product')
const Joi = require('@hapi/joi')
const { CustomError } = require('../utils/customError')
const constants = require('../utils/constants')
const logger = require('../utils/logger')

const v = {}
exports.v = v

// -----------------Rule--------

v.getProducts = {
  query: {
    limit: Joi.number().default(20),
    offset: Joi.number().default(0),
    query: Joi.string().default('').empty(''),
    product: Joi.number().default(0)
  }
}

v.countProductByScope = {
  query: {
    scope: Joi.number().required(),
    product: Joi.number().required()
  }
}

v.deleteProduct = {
  body: {
    sn: Joi.string().required()
  }
}

// ------------------Context----------

exports.getProducts = async ctx => {
  await productModel.getProducts(ctx.query)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS, { products: res[0], total: res[1][0]['FOUND_ROWS()'] })
    }).catch((err) => {
      logger.error(`getProducts error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.countProductByScope = async ctx => {
  await productModel.countProductByScope(ctx.query)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS, res)
    }).catch((err) => {
      logger.error(`getProducts error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.deleteProduct = async ctx => {
  const { sn } = ctx.request.body
  await productModel.deleteProduct(sn)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS)
    }).catch((err) => {
      logger.error(`deleteProduct error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
    })
}
