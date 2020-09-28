const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FactorySchema = new Schema({
  factoryId: { type: Number, unique: true, require: true, index: true },
  name: { type: String, require: true }, // 工厂名称
  location: { type: String, require: true } // 工厂位置
},
{
  versionKey: false,
  timestamps: true
})

let Factory = mongoose.model('Factory', FactorySchema)
module.exports = { Factory }
