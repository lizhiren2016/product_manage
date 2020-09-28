const router = require('koa-router')()
const validate = require('koa2-validation')
const controller = require('../controller/factory')

router.get('/api/v1/factorys', validate(controller.v.getFactorys), controller.getFactorys)

router.post('/api/v1/factorys', validate(controller.v.createFactory), controller.createFactory)

router.put('/api/v1/factorys', validate(controller.v.updateFactory), controller.updateFactory)

router.delete('/api/v1/factorys/:factoryId', validate(controller.v.deleteStation), controller.deleteStation)

module.exports = router
