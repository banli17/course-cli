'use strict';

module.exports = core;

const pkg = require('../package.json')
const log = require('@v-cli/log')
const semver = require('semver')
const colors = require('colors')

function core() {
	checkPkgVersion()
	checkNodeVersion()
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