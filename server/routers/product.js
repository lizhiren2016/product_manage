const router = require('koa-router')()
const validate = require('koa2-validation')
const controller = require('../controller/product')

router.get('/api/v1/products', validate(controller.v.getProducts), controller.getProducts)

router.get('/api/v1/products/downloadList', validate(controller.v.getDownloadList), controller.getDownloadList)

router.post('/api/v1/products', controller.createProduct)

router.patch('/api/v1/products/enableProduct', validate(controller.v.enableProduct), controller.enableProduct)

router.put('/api/v1/products', validate(controller.v.updateProduct), controller.updateProduct)

router.delete('/api/v1/products/:id', validate(controller.v.deleteProduct), controller.deleteProduct)

module.exports = router
