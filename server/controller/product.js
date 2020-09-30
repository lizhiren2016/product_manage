const productModel = require('../db/mysql/models/product')
const Joi = require('@hapi/joi')
let fs = require('fs')
let path = require('path')
const { CustomError } = require('../utils/customError')
const constants = require('../utils/constants')
const logger = require('../utils/logger')
const { makeDir } = require('../utils/tools')
const { uploadDir } = require('../config/default')
let formidable = require('formidable')

const v = {}
exports.v = v

const UPLOAD_TEMP_DIR = uploadDir + '/temp/'
const DEBUG_UPLOAD_DIR = uploadDir + '/debug/'
const TEST_UPLOAD_DIR = uploadDir + '/test/'
const PRO_UPLOAD_DIR = uploadDir + '/pro/'
const APK_UPLOAD_DIR = uploadDir + '/apk/'

const DEBUG_BASE_STATIC_URL = '/debug/'
const TEST_BASE_STATIC_URL = '/test/'
const PRO_BASE_STATIC_URL = '/pro/'
const APK_BASE_STATIC_URL = '/apk/'

const TYPE_DEBUG = 1
const TYPE_TEST = 2
const TYPE_PRO = 3
const TYPE_APK = 4

// -----------------Rule--------

v.getProducts = {
  query: {
    limit: Joi.number().default(20),
    offset: Joi.number().default(0),
    query: Joi.string().default('').empty(''),
    type: Joi.number().default(0),
    release: Joi.number().default(0)
  }
}

v.getDownloadList = {
  query: {
    limit: Joi.number().default(20),
    offset: Joi.number().default(0),
    query: Joi.string().default('').empty(''),
    type: Joi.number().default(0),
    release: Joi.number().default(0)
  }
}

v.updateProduct = {
  body: {
    id: Joi.number().required(),
    type: Joi.number().required(),
    release: Joi.number().required(),
    name: Joi.string().required(),
    version: Joi.string().required(),
    note: Joi.string().default('').empty('')
  }
}

v.deleteProduct = {
  params: {
    id: Joi.string().required()
  }
}

v.enableProduct = {
  body: {
    id: Joi.number().required(),
    status: Joi.number().required()
  }
}

// ------------------Context----------

exports.enableProduct = async ctx => {
  await productModel.enableProduct(ctx.request.body)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS)
    }).catch((err) => {
      logger.error(`enableProduct error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.getDownloadList = async ctx => {
  await productModel.getDownloadList(ctx.query)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS, { products: res[0], total: res[1][0]['FOUND_ROWS()'] })
    }).catch((err) => {
      logger.error(`getProducts error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.getProducts = async ctx => {
  await productModel.getProducts(ctx.query)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS, { products: res[0], total: res[1][0]['FOUND_ROWS()'] })
    }).catch((err) => {
      logger.error(`getProducts error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.updateProduct = async ctx => {
  await productModel.updateProduct(ctx.request.body)
    .then(res => {
      ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS, res)
    }).catch((err) => {
      logger.error(`updateProduct error ${err.message}`)
      ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION)
    })
}

exports.createProduct = async ctx => {
  let form = new formidable.IncomingForm()
  form.maxFileSize = 1024 * 1024 * 1024
  form.encoding = 'utf-8'
  form.hash = 'md5'
  form.keepExtensions = true
  form.uploadDir = UPLOAD_TEMP_DIR
  return new Promise(async (resolve, reject) => {
    makeDir(form.uploadDir)
    makeDir(DEBUG_UPLOAD_DIR)
    makeDir(TEST_UPLOAD_DIR)
    makeDir(PRO_UPLOAD_DIR)
    makeDir(APK_UPLOAD_DIR)
    form.parse(ctx.req, async (err, fields, files) => {
      if (err) {
        reject(ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message))
      } else {
        let { type, release, name, version, note } = fields
        type = Number(type)
        release = Number(release)
        if (version && name && type && release) {
          let filePath = ''
          let staticPath = ''
          let fileSize = 0
          if (files && files.file) { // 文件处理
            filePath = files.file.path
            fileSize = parseInt(files.file.size / 1024 / 1024)
            let fileExt = files.file.name.substring(files.file.name.lastIndexOf('.'))
            try {
              // 以当前账号对上传文件进行重命名
              let fileName = name + '_' + version + '_' + release + fileExt
              let targetFile = ''
              if (type === TYPE_DEBUG) {
                staticPath = DEBUG_BASE_STATIC_URL + fileName
                targetFile = path.join(DEBUG_UPLOAD_DIR, fileName)
              }
              if (type === TYPE_TEST) {
                staticPath = TEST_BASE_STATIC_URL + fileName
                targetFile = path.join(TEST_UPLOAD_DIR, fileName)
              }
              if (type === TYPE_PRO) {
                staticPath = PRO_BASE_STATIC_URL + fileName
                targetFile = path.join(PRO_UPLOAD_DIR, fileName)
              }
              if (type === TYPE_APK) {
                staticPath = APK_BASE_STATIC_URL + fileName
                targetFile = path.join(APK_UPLOAD_DIR, fileName)
              }
              // 移动并重命名文件
              fs.renameSync(filePath, targetFile)
            } catch (err) {
              return reject(ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message))
            }
          }

          // 校验hash是否存在
          const checkRes = await productModel.checktProductFileHash(type, release, files.file.hash)
          if (checkRes.length > 0) return reject(ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, '文件已存在，请不要重复上传'))

          // 创建
          await productModel.createProduct([type, release, name, version, staticPath, files.file.hash, note, fileSize])
            .then(res => {
              resolve(ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS))
            }).catch((err) => {
              logger.error(`createProduct error ${err.message}`)
              reject(ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION))
            })
        } else {
          reject(ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, '参数不正确'))
        }
      }
    })
  })
}

exports.deleteProduct = async ctx => {
  const { id } = ctx.params
  let res = await productModel.getProductById(id)
  if (res.length > 0) {
    await productModel.deleteProduct(id)
      .then(doc => {
        fs.unlinkSync(uploadDir + res[0].path)
        ctx.body = new CustomError(constants.CUSTOM_CODE.SUCCESS)
      }).catch((err) => {
        logger.error(`deleteProduct error ${err.message}`)
        ctx.body = new CustomError(constants.CUSTOM_CODE.SERVER_EXCEPTION, null, err.message)
      })
  } else {
    ctx.body = new CustomError(constants.CUSTOM_CODE.PRODUCT_NOT_EXISTS)
  }
}
