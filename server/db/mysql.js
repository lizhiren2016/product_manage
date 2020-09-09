var mysql = require('mysql')
var config = require('../config/default.js')
var table = require('./table')

var pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT,
  multipleStatements: true
})

let execQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

let createTable = () => {
  table.map(sql => {
    execQuery(sql, [])
  })
}

exports.execQuery = execQuery
exports.createTable = createTable
