/* eslint-disable no-undef */
var productModel = require('../../db/mysql/models/product')

let sn = 'D4JBZ5PC7030453'

describe('add Product', function () {
  // 创建
  before((done) => {
    productModel.createProduct([sn, '656053313146370654483744', '1.0.3.15']).then(() => {
      done()
    })
  })
  // 删除
  after((done) => {
    productModel.deleteProduct(sn).then(() => {
      done()
    })
  })
  it('get Products', function (done) {
    productModel.getProducts({ offset: 0, limit: 20 }).then((res) => {
      done()
    })
  })
})
