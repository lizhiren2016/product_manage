var sql = require('../mysql')

let execQuery = sql.execQuery

// 获取商品列表
exports.getProducts = (param) => {
  const { offset, limit, query, type, release } = param
  let _sql = `SELECT SQL_CALC_FOUND_ROWS id,name,note,type,timestamp,release_version,version,path,status FROM products p WHERE CONCAT(p.version, p.name) LIKE "%${query}%"`
  if (release) _sql += ` AND release_version = ${release}`
  if (type) _sql += ` AND type = ${type}`
  _sql += ` ORDER BY timestamp DESC LIMIT ${offset * limit},${limit};`
  _sql += `SELECT FOUND_ROWS();`
  return execQuery(_sql)
}

// 获取下载列表
exports.getDownloadList = (param) => {
  const { offset, limit, query, type, release } = param
  let _sql = `SELECT SQL_CALC_FOUND_ROWS id,name,note,type,timestamp,release_version,version,path,status FROM products p WHERE CONCAT(p.version, p.name) LIKE "%${query}%" AND status`
  if (release) _sql += ` AND release_version = ${release}`
  if (type) _sql += ` AND type = ${type}`
  _sql += ` ORDER BY timestamp DESC LIMIT ${offset * limit},${limit};`
  _sql += `SELECT FOUND_ROWS();`
  return execQuery(_sql)
}

exports.checktProductFileHash = (type, release, hash) => {
  let _sql = `SELECT hash FROM products WHERE type=${type} AND release_version=${release} AND hash="${hash}" ;`
  return execQuery(_sql)
}

// 新增商品
exports.createProduct = (value) => {
  let _sql = `INSERT INTO products set type=?,release_version=?,name=?,version=?,path=?,hash=?,note=?;`
  return execQuery(_sql, value)
}

// 更新用户
exports.updateProduct = (param) => {
  const { id, type, release, name, version, note } = param
  let _sql = `UPDATE products SET type=${type},release_version=${release},name="${name}",version="${version}",note="${note}" WHERE id="${id}";`
  return execQuery(_sql)
}

// 删除商品
exports.deleteProduct = (value) => {
  let _sql = `DELETE FROM products WHERE id="${value}";`
  return execQuery(_sql)
}

// 启用/禁用
exports.enableProduct = (param) => {
  let _sql = `UPDATE products SET status=${param.status} WHERE id="${param.id}";`
  return execQuery(_sql)
}
