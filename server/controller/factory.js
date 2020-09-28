const { Factory } = require('../db/mongodb/models')
const Joi = require('@hapi/joi')
const { CustomError } = require('../utils/customError')
const constants = require('../utils/constants')
const logger = require('../utils/logger')

const v = {}
exports.v = v

// -----------------Rule--------

v.getFactorys = {
  query: {
    limit: Joi.number().default(20),
    offset: Joi.number().default(0),
    query: Joi.string().default('').empty('')
  }
}

v.createFactory = {
  body: {
    factoryId: Joi.number().required(),
    name: Joi.string().required(),
    location: Joi.string().default('').empty('')
  }
}

v.updateFactory = {
  body: {
    factoryId: Joi.number().required(),
    name: Joi.string().required(),
    location: Joi.string().default('').empty('')
  }
}

v.deleteStation = {
  params: {
    factoryId: Joi.number().required()
  }
}

// ------------------Context----------

exports.getFactorys = async ctx => {
  const { query, limit, offset } = ctx.query
  let match = [
    { $addFields: { factoryIdStr: { $toString: '$factoryId' } } },
    {
      $match: {
        $or: [{ factoryIdStr: { '$regex': query, $options: '$i' } }, { name: { '$regex': query, $options: '$i' } }]
      }
    },
    {
      $facet: {
        factorys: [
          { $sort: { createdAt: -1 } },
          { $skip: offset * limit },
          { $limit: limit }
        ],
        pageInfo: [
          { $group: { _id: null, count: { $sum: 1 } } },
          {
            $project: {
              _id: 0,
              count: 1
            }
          }
        ]
      }
    }
  ]
  ctx.body = await Factory.aggregate(match).then(res => {
    let { factorys, pageInfo } = res[0]
    let data = {
      factorys,
      total: pageInfo.length > 0 ? pageInfo[0].count : 0
    }
    return new CustomError(constants.CUSTOM_CODE.SUCCESS, data)
  }).catch(err => {
    logger.error(`getFactorys error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.createFactory = async ctx => {
  const { body } = ctx.request
  ctx.body = await Factory.create(body).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS)
  }).catch(err => {
    logger.error(`createFactory error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.updateFactory = async ctx => {
  const { factoryId, ...update } = ctx.request.body
  ctx.body = await Factory.updateOne({ factoryId }, update).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS)
  }).catch(err => {
    logger.error(`updateFactory error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.deleteStation = async ctx => {
  const { stationId } = ctx.params
  ctx.body = await Factory.deleteOne({ stationId }).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS)
  }).catch(err => {
    logger.error(`deleteStation error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}
