const ENV = 'production'
// const ENV = 'development';

const config = {
  // 启动端口
  port: 3000,
  secret: 'secret_EF_912ijUI*3@23G92HYipYU*&%!#$$2452', // jwt secret
  // 数据库配置
  database: ENV === 'production' ? {
    DATABASE: 'ecoflow_production',
    USERNAME: 'eco_view',
    PASSWORD: 'e9af3f7a4c6d48a8944afaf72a109c30',
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
