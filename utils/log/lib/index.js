'use strict';

const log = require('npmlog')

// 默认是 'info', 用于调整打印等级, 只有高于的才会打印, 用于 debug
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'
log.heading = '@v-cli'
log.headingStyle = {
	fg: 'blue', // 颜色只能是名字, 不能是16进制
	bg: 'green'
}
// log 增加方法
log.addLevel('strong', 3000, {
	fg: 'blue',
	bold: true,
	underline: true,
	bell: true
})

// log.info('cli', 'hello')
// log.verbose('cli', 'debug')
// log.strong('cli', 'this is a strong font!')

module.exports = log