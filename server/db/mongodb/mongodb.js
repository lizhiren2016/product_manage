const mongoose = require('mongoose')
mongoose.Promise = global.Promise

// eslint-disable-next-line no-new
new Promise((resolve, reject) => {
  // 连接mongodb
  // eslint-disable-next-line standard/object-curly-even-spacing
  mongoose.connect('mongodb://localhost:27017/product_manage', { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (error) {
      console.log(error)
      // eslint-disable-next-line prefer-promise-reject-errors
      reject()
    } else {
      resolve()
    }
  })
})
