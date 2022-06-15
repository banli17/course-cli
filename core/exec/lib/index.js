'use strict';

const Package = require('@v-cli/package')

function exec() {
	console.log('exec', new Package())
	console.log(process.env.CLI_HOME_PATH);
	console.log(process.env.CLI_TARGET_PATH);
}

module.exports = exec;