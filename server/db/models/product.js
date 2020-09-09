var sql = require('../mysql')

let execQuery = sql.execQuery

// 获取商品列表
exports.getProducts = (param) => {
  const { offset, limit, query, product } = param
  let _sql = `SELECT  SQL_CALC_FOUND_ROWS * FROM products `
  if (query) _sql += ` WHERE sn LIKE "%${query}%"`
  if (product) _sql += ` WHERE product = ${product}`
  _sql += ` ORDER BY timestamp DESC LIMIT ${offset * limit},${limit};`
  _sql += `SELECT FOUND_ROWS();`
  return execQuery(_sql)
}

exports.countProductByScope = (param) => {
  const { scope, product } = param
  let _sql = ''
  if (scope === 1) _sql += `select DATE_FORMAT(timestamp,'%Y') years,count(*) count from products WHERE product = ${product} group by years;`
  if (scope === 2) _sql += `select DATE_FORMAT(timestamp,'%Y%m') months,count(*) count from products WHERE product = ${product} group by months;`
  if (scope === 3) _sql += `select DATE_FORMAT(timestamp,'%Y%u') weeks,count(*) count from products WHERE product = ${product} group by weeks;`
  if (scope === 4) _sql += `select DATE_FORMAT(timestamp,'%Y%m%d') days,count(*) count from products WHERE product = ${product} group by days; `
  return execQuery(_sql)
}

// 新增商品
exports.createProduct = (value) => {
  let _sql = `INSERT INTO products set sn=?,cpuid=?,app_version=?;`
  return execQuery(_sql, value)
}

// 删除商品
exports.deleteProduct = (value) => {
  let _sql = `DELETE FROM products WHERE sn="${value}";`
  return execQuery(_sql)
}
