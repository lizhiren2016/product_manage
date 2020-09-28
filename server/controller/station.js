const { Station } = require('../db/mongodb/models')
const Joi = require('@hapi/joi')
const { CustomError } = require('../utils/customError')
const constants = require('../utils/constants')
const logger = require('../utils/logger')

const v = {}
exports.v = v

// -----------------Rule--------

v.getStations = {
  query: {
    limit: Joi.number().default(20),
    offset: Joi.number().default(0),
    query: Joi.string().default('').empty('')
  }
}

v.createStation = {
  body: {
    stationId: Joi.number().required(),
    name: Joi.string().required(),
    remark: Joi.string().default('').empty('')
  }
}

v.updateStation = {
  body: {
    stationId: Joi.number().required(),
    name: Joi.string().required(),
    remark: Joi.string().default('').empty('')
  }
}

v.deleteStation = {
  params: {
    stationId: Joi.number().required()
  }
}

// ------------------Context----------

exports.getStations = async ctx => {
  const { query, limit, offset } = ctx.query
  let match = [
    { $addFields: { stationIdStr: { $toString: '$stationId' } } },
    {
      $match: {
        $or: [{ stationIdStr: { '$regex': query, $options: '$i' } }, { name: { '$regex': query, $options: '$i' } }]
      }
    },
    {
      $facet: {
        stations: [
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
  ctx.body = await Station.aggregate(match).then(res => {
    let { stations, pageInfo } = res[0]
    let data = {
      stations,
      total: pageInfo.length > 0 ? pageInfo[0].count : 0
    }
    return new CustomError(constants.CUSTOM_CODE.SUCCESS, data)
  }).catch(err => {
    logger.error(`getStations error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.createStation = async ctx => {
  const { body } = ctx.request
  ctx.body = await Station.create(body).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS)
  }).catch(err => {
    logger.error(`createStation error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.updateStation = async ctx => {
  const { stationId, ...update } = ctx.request.body
  ctx.body = await Station.updateOne({ stationId }, update).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS)
  }).catch(err => {
    logger.error(`updateStation error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.deleteStation = async ctx => {
  const { stationId } = ctx.params
  ctx.body = await Station.deleteOne({ stationId }).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS)
  }).catch(err => {
    logger.error(`deleteStation error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}
