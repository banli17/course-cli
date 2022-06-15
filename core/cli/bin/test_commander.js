#!/usr/bin/env node

const commander = require('commander')
const pkg = require('../package.json')


// const {
// 	program
// } = commander
const program = new commander.Command()

program
	// .name(Object.keys(pkg.bin)[0]) // 这里有错误，默认是正确的, 它会自动去找 bin 的对应的值
	.usage('<command> [option]')
	.version(pkg.version)
	.option('-d, --debug', '开启调试环境', false)
	.option('-e, --envName <envName>', '获取环境变量名称')
	.version(pkg.version)


// 添加子命令, 在 program 下
const clone = program
	.command('clone <source> [destination]')
	.description('clone a repository')
	.option('-f, --force', '是否强制克隆')
	.action((source, destination, cmdObj) => {
		console.log('do clone', source, destination, cmdObj)
		// v_c clone a b -f c
		// do clone a b { force: true }
	})

// console.log(program.opts()) // 参数
// console.log(program.getOptionValue('debug')) // 之前版本参数是放在 program.debug 上
// console.log(program.envName)

function addCopy() {
	const copy = new commander.Command('copy')
	copy.command('a').description('aaaa')
	return copy
}
program.addCommand(addCopy())

// 如果写了第二个参数描述，执行 v_cli ls 时实际会执行 test_commander_ls 文件, 如果不存在会报错
// program.command('ls <dir>', '列出目录详情', {
// 	// executableFile: 'ls', // 重新指定执行的命令，相当于去执行 ls 命令(系统的)
// 	isDefault: true, // 设置为 ture 时，如果没有匹配到命令会执行，相当于替换了下面的兜底命令
// 	// hidden: true, // -h 时隐藏命令
// })

// 解析 arguments 参数 v_cli rmdir dirpath(参数)
// program.arguments('<cmd> [option]')
// 	.description('fallback命令, 兜底命令')
// 	.option('-v', 'vvv')
// 	.action((cmd, option, command) => {
// 		console.log('执行兜底命令')
// 		// console.log('arguments', cmd, option, command)
// 		// v_c x -v 1
// 		// arguments x 1 { debug: false, v: true }
// 	})

// 定制 help 信息
// 方式1
// program.helpInformation = function () {
// 	return '改写了帮助信息'
// }
// 方式2
// program.on('--help', function () {
// 	console.log('改写了帮助信息111')
// })

// 实现 bug 模式
program.on('option:debug', function () {
	console.log('间听到了')
	console.log(program.opts())
	if (program.getOptionValue('debug')) {
		process.env.LOG_LEVEL = 'verbose'
	}
	console.log(process.env.LOG_LEVEL)
})

program.on('command:*', function (obj) {
	console.error('未知命令' + obj[0])
	const availableCommands = program.commands.map(cmd => cmd.name()).join(',')
	console.log('可用命令' + availableCommands);
})

// console.log(program.commands[0].options)
program.parse() // 默认有参数 process.argv

console.log('aaaa', program.opts()) // opts 要解析后才能得到