const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TestRecordSchema = new Schema({
  sn: { type: String, require: true, index: true }, // 产品/单板的序列号
  operator: { type: Number, require: true }, // 操作员，含邮箱、工号、姓名等信息
  factory: { type: Number, require: true, index: true }, // 工厂位置
  station: { type: Number, require: true, index: true }, // 工位（枚举值）
  start: { type: Date, require: true }, // 开始测试时间
  finish: { type: Date, require: true }, // 结束测试时间
  hw_version: String, // 硬件版本
  sw_version: String, // 软件版本
  teststatus: { type: String, require: true }, // 测试通过与否（Pass/NG）
  content: Object, // 测试过程数据（JSON格式），如电流、电压等
  logs: Object, // 测试过程日志
  env: Object // 测试环境信息，如温度、湿度等（字典转字符串形式存储）
},
{
  versionKey: false,
  timestamps: true
})

let TestRecord = mongoose.model('TestRecord', TestRecordSchema)
module.exports = { TestRecord }
