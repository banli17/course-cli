// const path = require('path')
import path from 'path'
const pkg = require('../package.json')
const log = require('@v-cli/log')
const semver = require('semver')
const colors = require('colors')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const fs = require('fs-extra');
const {
	getNpmSemverVersion
} = require('@v-cli/get-npm-info');

async function core() {
	try {
		checkPkgVersion()
		checkNodeVersion()
		checkRoot()
		checkUserHome()
		checkInputArgs()
		checkEnv()
		await checkGlobalUpdate()
	} catch (e) {
		log.info(e.message)
	}
}

// 检查版本号
function checkPkgVersion() {
	log.info('cli', pkg.version)
}

function checkNodeVersion() {
	// 获取当前 Node 版本
	const currentVersion = process.version
	const lowestVersion = pkg.engines.node

	log.verbose(currentVersion, lowestVersion)

	if (!semver.gte(currentVersion, lowestVersion)) {
		throw new Error(colors.red(`@v-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
	}
}

function checkRoot() {
	const rootCheck = require('root-check')
	rootCheck() // 会对 root 进行降级
}

function checkUserHome() {
	// 原理 os.homedir ? os.homedir : homedir -> platform
	// log.info 判断如果是函数会执行
	// log.info(require('os').homedir())
	if (!userHome && !pathExists(userHome)) {
		throw new Error(colors.red(`当前登录用户主目录不存在`))
	}
}

let args

function checkInputArgs() {
	log.info(process.argv) // [node路径, 命令名, 命令参数]
	const minimist = require('minimist')
	args = minimist(process.argv.slice(2))
	checkArgs()
}

function checkArgs() {
	if (args.debug) {
		process.env.LOG_LEVEL = 'verbose'
	} else {
		process.env.LOG_LEVEL = 'info'
	}
	log.level = process.env.LOG_LEVEL // 这里要设置一下，因为 utils/log 设置 level 在拿到 LOG_LEVEL 之前执行了
	log.verbose('debug', 'hello')
}

function checkEnv() {
	const dotenv = require('dotenv')
	// config 不传递参数时, 默认会找 process.cwd() + '.env' 文件，不是在主目录找, 如果没有这个文件, 就会报错
	const dotenvPath = path.resolve(userHome, '.env')
	// 在 .env 写入 CLI_HOME=course-cli 后面不加;
	log.verbose('环境变量地址', dotenvPath)
	if (pathExists(dotenvPath)) {
		// 将文件配置 设置到 process.env 环境变量上
		// 如 .env 里的 CLI_HOME=course-cli  会挂在 process.env.CLI_HOME 上
		dotenv.config({
			path: dotenvPath
		})
	}

	// 方案1 不好
	// config = createDefaultConfig()
	// log.verbose('环境变量', config) // { parsed: { CLI_HOME: 'course-cli;' } }

	// 方案2
	createDefaultConfig()
	log.verbose('环境变量', process.env.CLI_HOME_PATH) // 缓存路径 /Users/banli/.my-v-cli
}

function createDefaultConfig() {
	const cliConfig = {
		home: userHome
	}
	if (process.env.CLI_HOME) {
		cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME)
	} else {
		cliConfig.cliHome = path.join(userHome.constant.DEFAULT_CLI_HOME)
	}
	// 对应上面方案2 直接赋值
	process.env.CLI_HOME_PATH = cliConfig.cliHome
	return cliConfig
}

async function checkGlobalUpdate() {
	// 1. 获取当前版本号和模块名
	const currentVersion = pkg.version
	const npmName = pkg.name
	// 2. 调用 npm API, 获取所有版本号
	try {
		const lastVersion = await getNpmSemverVersion(currentVersion, npmName)
		log.warn(colors.yellow(`请手动更新 ${npmName}, 当前版本: ${currentVersion}, 最新版本: ${lastVersion} 更新命令 npm i ${npmName}`))
	} catch (e) {
		log.error('ggg', e)
	}
	// 3. 提取所有版本号，比对哪些版本号大于当前版本号
	// 4. 获取最新的版本号, 提示用于更新到该版本
}

// module.exports = core;

// exports.core = core

export default core
