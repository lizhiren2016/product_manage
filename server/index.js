const Koa = require('koa')
// const koaJwt = require('koa-jwt')
const fs = require('fs')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session-minimal')
const serve = require('koa-static-server')
const MysqlStore = require('koa-mysql-session')
const cors = require('koa2-cors')
const config = require('./config/default.js')
const { getUserInfo } = require('./utils/tools.js')
const { CustomError, HttpError } = require('./utils/customError')
const { format } = require('./utils/response')
const logger = require('./utils/logger')
const app = new Koa()
require('./db/mongodb/mongodb')
const mysql = require('./db/mysql/mysql')

const ENV = process.env.NODE_ENV
console.log('---->>>> ', process.env.NODE_ENV)

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
app.use(serve({ rootDir: config.uploadDir + '/apk', rootPath: '/apk' }))
app.use(serve({ rootDir: config.uploadDir + '/debug', rootPath: '/debug' }))
app.use(serve({ rootDir: config.uploadDir + '/pro', rootPath: '/pro' }))
app.use(serve({ rootDir: config.uploadDir + '/test', rootPath: '/test' }))

// 路由权限控制 除了path里的路径不需要验证token 其他都要

app.use(async (ctx, next) => {
  let whitelist = ['/', '/api/v1/login', '/api/v1/register', '/api/v1/testRecords/history', '/api/v1/testRecords/info', '/api/v1/testRecords', '/api/v1/products/downloadList']
  let needAuth = whitelist.indexOf(ctx.path) === -1 && ctx.path.startsWith('/api/')
  if (!needAuth) {
    await next()
  } else {
    let usrObj = getUserInfo(ctx)
    if (usrObj) {
      ctx.userObj = usrObj
      await next()
    } else {
      ctx.body = { code: 401, message: 'Unauthorized access' }
      ctx.status = 401
    }
  }
})

// app.use(async (ctx, next) => {
//   let whitelist = ['/', '/api/v1/login', '/api/v1/register', '/api/v1/testRecords/history', '/api/v1/testRecords/info', '/api/v1/testRecords', '/api/v1/products/downloadList']
//   let needAuth = whitelist.indexOf(ctx.path) === -1 && ctx.path.startsWith('/api/')
//   if (!needAuth) {
//     console.log(123)
//     await next()
//   } else {
//     //  Token拦截
//     if (ctx.header && ctx.header.authorization) {
//       const parts = ctx.header.authorization.split(' ')
//       if (parts.length === 2) {
//         // 取出token
//         const scheme = parts[0]
//         const token = parts[1]

//         if (/^Bearer$/i.test(scheme)) {
//           try {
//             // jwt.verify方法验证token是否有效
//             jwt.verify(token, config.secret, {
//               complete: true
//             })
//             await next()
//           } catch (error) {
//             ctx.throw(401, error.message)
//           }
//         }
//       }
//     }
//   }

//   return next().catch(err => {
//     if (err.status === 401) {
//       ctx.status = 401
//       ctx.body =
//         'Protected resource, use Authorization header to get access\n'
//     } else {
//       throw err
//     }
//   })
// })

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

if (ENV === 'production') {
  app.use(async (ctx, next) => {
    const start = new Date()
    try {
      await next()
    } catch (e) {
      // logger.debug(e);
    }
    if (ctx.status === 404 || ctx.status === 401) {
      let data = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
      ctx.body = data
    }

    const ms = new Date() - start
    let str = ctx.url
    if (str.indexOf('.') === -1 && ctx.url !== '/') {
      logger.info(`${ctx.req.socket.remoteAddress} - ${ctx.method} ${ctx.url} - ${ms}ms`)
    }
  })

  app.use(serve({ rootDir: path.join(__dirname, '../dist') }))

  app.listen(config.port)

  console.log(`listening on port ${config.port}`)
} else {
  app.listen(config.port)
  console.log(`listening on port ${config.port}`)
}
