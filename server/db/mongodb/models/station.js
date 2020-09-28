const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StationSchema = new Schema({
  stationId: { type: Number, unique: true, require: true, index: true },
  name: { type: String, require: true }, // 工位名称
  remark: { type: String, require: true } // 工作概要说明
},
{
  versionKey: false,
  timestamps: true
})

let Station = mongoose.model('Station', StationSchema)
module.exports = { Station }
