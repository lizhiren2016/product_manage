const router = require('koa-router')()
const validate = require('koa2-validation')
const controller = require('../controller/user')

// 登陆
router.post('/api/v1/login', validate(controller.v.login), controller.login)

router.post('/api/v1/register', validate(controller.v.createUser), controller.createUser)

module.exports = router
