const ENV = 'production'
// const ENV = 'development';

const config = {
  // 启动端口
  port: 3000,
  secret: 'secret_EF_912ijUI*3@23G92HYipYU*&%!#$$2452', // jwt secret
  // 数据库配置
  database: ENV === 'production' ? {
    DATABASE: 'product_manage',
    USERNAME: 'root',
    PASSWORD: 'miGgvEFce4+_',
    PORT: 3333,
    HOST: 'localhost'
  } : {
    DATABASE: 'product_manage',
    USERNAME: 'root',
    PASSWORD: '123456',
    PORT: 3306,
    HOST: 'localhost'
  }
}

module.exports = config
