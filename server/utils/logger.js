var log4js = require('log4js')

log4js.configure({
  pm2: true,
  pm2InstanceVar: 'INSTANCE_ID',
  appenders: {
    testserv: {
      type: 'dateFile',
      filename: 'logs/testserv',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      maxLogSize: 209715200,
      daysToKeep: 30,
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] - %m'
      }
    },
    console: {
      type: 'console',
      category: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] -%] %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['testserv', 'console'],
      level: 'debug'
    }
  }
})

var logger = log4js.getLogger('testserv')
logger.level = 'debug'

module.exports = logger
