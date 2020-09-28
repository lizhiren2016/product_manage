const router = require('koa-router')()
const validate = require('koa2-validation')
const controller = require('../controller/station')

router.get('/api/v1/stations', validate(controller.v.getStations), controller.getStations)

router.post('/api/v1/stations', validate(controller.v.createStation), controller.createStation)

router.put('/api/v1/stations', validate(controller.v.updateStation), controller.updateStation)

router.delete('/api/v1/stations/:stationId', validate(controller.v.deleteStation), controller.deleteStation)

module.exports = router
