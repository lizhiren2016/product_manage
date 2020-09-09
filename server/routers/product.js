const router = require('koa-router')()
const validate = require('koa2-validation')
const controller = require('../controller/product')

router.get('/api/v1/products', validate(controller.v.getProducts), controller.getProducts)

router.get('/api/v1/products/count', validate(controller.v.countProductByScope), controller.countProductByScope)

router.delete('/api/v1/products', validate(controller.v.deleteProduct), controller.deleteProduct)

module.exports = router
