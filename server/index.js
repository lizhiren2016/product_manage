const Koa = require('koa')
const koaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session-minimal')
const serve = require('koa-static-server')
const MysqlStore = require('koa-mysql-session')
const cors = require('koa2-cors')
const config = require('./config/default.js')
const { CustomError, HttpError } = require('./utils/customError')
const { format } = require('./utils/response')
const logger = require('./utils/logger')
const app = new Koa()
require('./db/mongodb/mongodb')
const mysql = require('./db/mysql/mysql')

// 建表
mysql.createTable()

// session存储配置
const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
  port: config.database.PORT
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))

// 解决跨域请求
app.use(cors({
  exposeHeaders: ['Authorization']
}))

app.use(bodyParser({
  formLimit: '1mb'
}))

app.use(serve({ rootDir: 'public/apidoc', rootPath: '/apidoc', index: 'index.html' }))
app.use(serve({ rootDir: config.uploadDir + '/files', rootPath: '/files' }))

// 路由权限控制 除了path里的路径不需要验证token 其他都要
app.use(
  koaJwt({
    secret: config.secret
  }).unless({
    path: ['/', '/api/v1/login', '/api/v1/register', '/api/v1/testRecords/history', '/api/v1/testRecords/info', '/api/v1/testRecords', '/api/v1/products/downloadList']
  })
)

app.use((ctx, next) => {
  //  Token拦截
  if (ctx.header && ctx.header.authorization) {
    const parts = ctx.header.authorization.split(' ')
    if (parts.length === 2) {
      // 取出token
      const scheme = parts[0]
      const token = parts[1]

      if (/^Bearer$/i.test(scheme)) {
        try {
          // jwt.verify方法验证token是否有效
          jwt.verify(token, config.secret, {
            complete: true
          })
        } catch (error) {
          ctx.throw(401, error.message)
        }
      }
    }
  }

  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body =
        'Protected resource, use Authorization header to get access\n'
    } else {
      throw err
    }
  })
})

// 请求响应格式化
app.use(async (ctx, next) => {
  await next().catch((err) => {
    let code = 500
    let msg = 'Internel server error'
    if (err instanceof CustomError || err instanceof HttpError) {
      const res = err.getCodeMsg()
      ctx.status = err instanceof HttpError ? res.code : 200
      code = res.code
      msg = res.message
    } else {
      ctx.status = code
      msg = err.message
    }
    ctx.body = format(code, msg)
    let params = ctx.request.method === 'GET' ? ctx.query : ctx.request.body
    logger.error(`clientIp：[${ctx.request.ip}] url：[${ctx.request.method}][${ctx.request.url}] error：[${msg}] params：${JSON.stringify(params)}`)
  })
})

//  路由
app.use(require('./routers/index').routes())
app.use(require('./routers/user').routes())
app.use(require('./routers/product').routes())
app.use(require('./routers/device').routes())
app.use(require('./routers/testRecord').routes())
app.use(require('./routers/station').routes())
app.use(require('./routers/factory').routes())

app.listen(config.port)

console.log(`listening on port ${config.port}`)
