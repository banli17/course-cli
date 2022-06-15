#!/usr/bin/env node

const importLocal = require('import-local')
if (importLocal(__dirname)) {
	require('npmlog').info('cli', '正在使用 v-cli 本地版本')
} else {
	require('..')(process.argv.slice(2)) // 这里要 default ?
}