var sql = require('../mysql')

let execQuery = sql.execQuery

// 获取商品列表
exports.getDevices = (param) => {
  const { offset, limit, query, product } = param
  let _sql = `SELECT SQL_CALC_FOUND_ROWS * FROM devices WHERE sn LIKE "%${query}%"`
  if (product) _sql += ` AND product = ${product}`
  _sql += ` ORDER BY timestamp DESC LIMIT ${offset * limit},${limit};`
  _sql += `SELECT FOUND_ROWS();`
  return execQuery(_sql)
}

exports.countDeviceByScope = (param) => {
  const { scope, product } = param
  let _sql = ''
  if (scope === 1) _sql += `select DATE_FORMAT(timestamp,'%Y') years,count(*) count from devices WHERE product = ${product} group by years;`
  if (scope === 2) _sql += `select DATE_FORMAT(timestamp,'%Y%m') months,count(*) count from devices WHERE product = ${product} group by months;`
  if (scope === 3) _sql += `select DATE_FORMAT(timestamp,'%Y%u') weeks,count(*) count from devices WHERE product = ${product} group by weeks;`
  if (scope === 4) _sql += `select DATE_FORMAT(timestamp,'%Y%m%d') days,count(*) count from devices WHERE product = ${product} group by days; `
  return execQuery(_sql)
}

// 新增商品
exports.createDevice = (value) => {
  let _sql = `INSERT INTO devices set sn=?,cpuid=?,app_version=?;`
  return execQuery(_sql, value)
}

// 删除商品
exports.deleteDevice = (value) => {
  let _sql = `DELETE FROM devices WHERE sn="${value}";`
  return execQuery(_sql)
}
