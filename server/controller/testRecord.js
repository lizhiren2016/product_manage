const { TestRecord } = require('../db/mongodb/models')
const Joi = require('@hapi/joi')
const { CustomError } = require('../utils/customError')
const constants = require('../utils/constants')
const logger = require('../utils/logger')

const v = {}
exports.v = v

// -----------------Rule--------

v.getTestRecords = {
  query: {
    limit: Joi.number().default(20),
    offset: Joi.number().default(0),
    query: Joi.string().default('').empty(''),
    product: Joi.number().default(0)
  }
}

v.getHistoryBySN = {
  query: {
    sn: Joi.string().required()
  }
}

v.getInfoById = {
  query: {
    id: Joi.string().required()
  }
}

v.addTestRecords = {
  body: {
    sn: Joi.string().required(),
    operator: Joi.number().required(),
    factory: Joi.number().required(),
    station: Joi.number().required(),
    start: Joi.date().required(),
    finish: Joi.date().required(),
    hw_version: Joi.string().default('').empty(''),
    sw_version: Joi.string().default('').empty(''),
    teststatus: Joi.number().required(),
    content: Joi.object(),
    logs: Joi.object(),
    env: Joi.object()
  }
}

v.deleteTestRecords = {
  params: {
    id: Joi.string().required()
  }
}

// ------------------Context----------

exports.getTestRecords = async ctx => {
  const { query, limit, offset, product } = ctx.query
  let match = [
    {
      $match: {
        sn: { '$regex': query, $options: '$i' }
      }
    },
    {
      $facet: {
        records: [
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
  if (product) {
    match[0]['$match'].product = product
  }
  ctx.body = await TestRecord.aggregate(match).then(res => {
    let { records, pageInfo } = res[0]
    let data = {
      records,
      total: pageInfo.length > 0 ? pageInfo[0].count : 0
    }
    return new CustomError(constants.CUSTOM_CODE.SUCCESS, data)
  }).catch(err => {
    logger.error(`getTestRecords error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.getHistoryBySN = async ctx => {
  const { sn } = ctx.query
  ctx.body = await TestRecord.find({ sn }).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS, { sn, records: res })
  }).catch(err => {
    logger.error(`getHistoryBySN error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.getInfoById = async ctx => {
  const { id } = ctx.query
  ctx.body = await TestRecord.findOne({ _id: id }).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS, res)
  }).catch(err => {
    logger.error(`getHistoryBySN error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.addTestRecords = async ctx => {
  const { body } = ctx.request
  ctx.body = await TestRecord.create(body).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS)
  }).catch(err => {
    logger.error(`addTestRecords error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}

exports.deleteTestRecords = async ctx => {
  const { id } = ctx.params
  ctx.body = await TestRecord.deleteOne({ _id: id }).then(res => {
    return new CustomError(constants.CUSTOM_CODE.SUCCESS)
  }).catch(err => {
    logger.error(`deleteTestRecords error ${err.message}`)
    return new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
  })
}
