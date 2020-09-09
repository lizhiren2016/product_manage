const util = require('util')
const ERROR_MSG = require('./errorMsg')
const constants = require('./constants')

const HTTP_CODE = constants.HTTP_CODE

function CustomError (code, data, errMsg) {
  Error.call(this, '')
  this.code = code
  this.message = ERROR_MSG[code] || 'unknown error'
  if (code === constants.CUSTOM_CODE.SERVER_EXCEPTION) {
    this.message = errMsg || 'unknown error'
  }
  this.data = data
  this.getCodeMsg = function () {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    }
  }
}
util.inherits(CustomError, Error)

function HttpError (code, msg) {
  if (Object.values(HTTP_CODE).indexOf(code) < 0) {
    throw Error('not an invalid http code')
  }
  CustomError.call(this, code, msg)
}
util.inherits(HttpError, CustomError)

module.exports = {
  HttpError,
  CustomError
}
