var sql = require('../mysql')

let execQuery = sql.execQuery

// 登陆
exports.login = (value) => {
  let _sql = `SELECT password,state,name FROM users WHERE account="${value}"`
  return execQuery(_sql)
}

// 获取用户列表
exports.getUsers = (param) => {
  const { offset, limit, query } = param
  let _sql = `SELECT SQL_CALC_FOUND_ROWS account,name,state,country,city,address,name,phone,timestamp FROM users u WHERE CONCAT(u.account, u.name) LIKE "%${query}%"`
  _sql += ` ORDER BY timestamp DESC LIMIT ${offset * limit},${limit};`
  _sql += `SELECT FOUND_ROWS();`
  return execQuery(_sql)
}

// 新增用户
exports.createUser = (param) => {
  let _sql = `INSERT INTO users (account,password,country,city,address,name,phone) SELECT "${param.account}","${param.password}","${param.country}","${param.city}","${param.address}","${param.name}","${param.phone}" FROM dual WHERE NOT EXISTS ( SELECT * FROM users WHERE account = "${param.account}");`
  return execQuery(_sql)
}

// 更新用户
exports.updateUser = (param) => {
  const { account, country, city, address, name, phone } = param
  let _sql = `UPDATE users SET country="${country}",city="${city}",address="${address}",name="${name}",phone="${phone}" WHERE account="${account}";`
  return execQuery(_sql)
}

// 删除用户
exports.deleteUser = (value) => {
  let _sql = `DELETE FROM users WHERE account="${value}";`
  return execQuery(_sql)
}

// 激活用户
exports.activateUser = (param) => {
  let _sql = `UPDATE users SET state=${param.state} WHERE account="${param.account}";`
  console.log(_sql)
  return execQuery(_sql)
}
