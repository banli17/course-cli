'use strict';

function init(projectName, cmdObj) {
	console.log('init project', projectName, cmdObj, process.env.CLI_TARGET_PATH)
}

module.exports = init;