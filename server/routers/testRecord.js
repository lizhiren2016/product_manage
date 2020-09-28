const router = require('koa-router')()
const validate = require('koa2-validation')
const controller = require('../controller/testRecord')

router.get('/api/v1/testRecords', validate(controller.v.getTestRecords), controller.getTestRecords)

/**
* @api {get} /api/v1/testRecords/history 查询测试记录历史接口
* @apiDescription 查询测试记录历史接口
* @apiName getHistoryBySN
* @apiGroup 测试记录
* @apiParam {String} sn  设备SN
* @apiSuccess {Number} code 状态码
* @apiSuccess {String} message 消息
* @apiSuccess {Data} data 返回的数据
* @apiSuccess {String} data.sn 名称
* @apiSuccess {Object[]} data.records 手机号码
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 OK
    {
        "code": 0,
        "message": "success",
        "data": {
            "sn": "R6AHZ2ZC51123456",
            "records": [
                {
                    "_id": "5f6ae6efafe581526c82990d",
                    "sn": "R6AHZ2ZC51123456",
                    "operator": 1,
                    "factory": 1,
                    "station": 1,
                    "start": "2020-02-10T00:00:00.000Z",
                    "finish": "2020-02-10T00:00:00.000Z",
                    "teststatus": "1",
                    "hw_version": "",
                    "sw_version": "",
                    "createdAt": "2020-09-23T06:10:55.313Z",
                    "updatedAt": "2020-09-23T06:10:55.313Z"
                }
            ]
        }
    }
* @apiVersion v1.0.0
*/
router.get('/api/v1/testRecords/history', validate(controller.v.getHistoryBySN), controller.getHistoryBySN)

/**
* @api {get} /api/v1/testRecords/info 查询测试记录详情接口
* @apiDescription 查询测试记录详情接口
* @apiName getInfoById
* @apiGroup 测试记录
* @apiParam {String} id  测试记录ID
* @apiSuccess {Number} code 状态码
* @apiSuccess {String} message 消息
* @apiSuccess {Data} data 返回的数据
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 OK
    {
        "code": 0,
        "message": "success",
        "data": {
            "_id": "5f6ae6efafe581526c82990d",
            "sn": "R6AHZ2ZC51123456",
            "operator": 1,
            "factory": 1,
            "station": 1,
            "start": "2020-02-10T00:00:00.000Z",
            "finish": "2020-02-10T00:00:00.000Z",
            "teststatus": "1",
            "hw_version": "",
            "sw_version": "",
            "createdAt": "2020-09-23T06:10:55.313Z",
            "updatedAt": "2020-09-23T06:10:55.313Z"
        }
    }
* @apiVersion v1.0.0
*/
router.get('/api/v1/testRecords/info', validate(controller.v.getInfoById), controller.getInfoById)

/**
* @api {post} /api/v1/testRecords 增加测试记录接口
* @apiDescription 增加测试记录接口
* @apiName addTestRecords
* @apiGroup 测试记录
* @apiParam {String} sn  SN
* @apiParam {Number} operator  操作员
* @apiParam {Number} factory  工厂位置
* @apiParam {Number} station  工位
* @apiParam {Date} start  开始测试时间
* @apiParam {Date} finish  结束测试时间
* @apiParam {String} [hw_version]  硬件版本
* @apiParam {String} [sw_version]  软件版本
* @apiParam {Number} teststatus  测试通过与否
* @apiParam {Object} [content]  测试过程数据
* @apiParam {Object} [logs]  测试过程日志
* @apiParam {Object} [env]  测试环境信息
* @apiSuccess {Number} code 状态码
* @apiSuccess {String} message 消息
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 OK
    {
        "code": 0,
        "message": "success"
    }
* @apiVersion v1.0.0
*/
router.post('/api/v1/testRecords', validate(controller.v.addTestRecords), controller.addTestRecords)

router.delete('/api/v1/testRecords/:id', validate(controller.v.deleteTestRecords), controller.deleteTestRecords)

module.exports = router
