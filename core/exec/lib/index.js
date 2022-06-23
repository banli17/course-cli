"use strict";

const Package = require("@v-cli/package");

const SETTINGS = {
  init: "@v-cli/init",
};

function exec() {
  // console.log("exec", new Package());
  // console.log(process.env.CLI_HOME_PATH);
  // console.log(process.env.CLI_TARGET_PATH);
  const targetPath = process.env.CLI_HOME_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  const cmdObj = arguments[arguments.length - 1];
  console.log("arguments", arguments);
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = "latest";

  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion,
  });

  console.log(pkg);
}

module.exports = exec;
