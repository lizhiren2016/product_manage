const router = require('koa-router')()
const validate = require('koa2-validation')
const controller = require('../controller/user')

router.get('/api/v1/users', validate(controller.v.getUsers), controller.getUsers)

router.post('/api/v1/users', validate(controller.v.createUser), controller.createUser)

router.put('/api/v1/users', validate(controller.v.updateUser), controller.updateUser)

router.patch('/api/v1/users', validate(controller.v.activateUser), controller.activateUser)

router.delete('/api/v1/users', validate(controller.v.deleteUser), controller.deleteUser)

module.exports = router
