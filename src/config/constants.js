const TOKEN_NAME = 'Product_Manage_Token' // token
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL

// --------------正则表达式-----------------

const MOBILE_REGEX = /^1[345678]\d{9}$/ // 手机号验证规则

// --------------状态码-----------------

const SUCCESS_CODE = 0 // 成功

export {
  API_BASE_URL,
  TOKEN_NAME,
  MOBILE_REGEX,
  SUCCESS_CODE
}
