const ENV = 'production'
// const ENV = 'development'

const config = {
  // 启动端口
  port: 8087,
  secret: 'secret_EF_912ijUI*3@23G92HYipYU*&%!#$$2452', // jwt secret
  // 数据库配置
  database: ENV === 'production' ? {
    DATABASE: 'product_manage',
    USERNAME: 'root',
    PASSWORD: '123456',
    PORT: 3306,
    HOST: 'localhost'
  } : {
    DATABASE: 'product_manage',
    USERNAME: 'root',
    PASSWORD: '123456',
    PORT: 3306,
    HOST: 'localhost'
  },
  uploadDir: 'D:/product_manage/upload'
}

module.exports = config
