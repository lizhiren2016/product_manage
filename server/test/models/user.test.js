/* eslint-disable no-undef */
var userModel = require('../../db/models/user')

let accont = 'admin@ef.cn'

describe('add User', function () {
  // 创建
  before((done) => {
    userModel.createUser([accont, '2c864e614ad7b93904714ba276669e62caf08299', '中国', '深圳', '西丽', '管理员', '123']).then(() => {
      done()
    })
  })
  // 删除
  after((done) => {
    userModel.deleteUser(accont).then(() => {
      done()
    })
  })
  it('get Users', function (done) {
    userModel.getUsers({ offset: 0, limit: 20 }).then((res) => {
      done()
    })
  })
})
