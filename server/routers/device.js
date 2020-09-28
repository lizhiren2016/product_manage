const router = require('koa-router')()
const validate = require('koa2-validation')
const controller = require('../controller/device')

router.get('/api/v1/devices', validate(controller.v.getDevices), controller.getDevices)

router.get('/api/v1/devices/count', validate(controller.v.countDeviceByScope), controller.countDeviceByScope)

router.delete('/api/v1/devices/:sn', validate(controller.v.deleteDevice), controller.deleteDevice)

module.exports = router
