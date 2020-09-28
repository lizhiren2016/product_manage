const router = require('koa-router')()
const validate = require('koa2-validation')
const controller = require('../controller/product')

router.get('/api/v1/products', validate(controller.v.getProducts), controller.getProducts)

router.post('/api/v1/products', controller.createProduct)

router.put('/api/v1/products', validate(controller.v.updateProduct), controller.updateProduct)

router.delete('/api/v1/products/:id', validate(controller.v.deleteProduct), controller.deleteProduct)

module.exports = router
