"use strict";

var Package = require("@v-cli/package");

var SETTINGS = {
  init: "@v-cli/init"
};

function exec() {
  // console.log("exec", new Package());
  // console.log(process.env.CLI_HOME_PATH);
  // console.log(process.env.CLI_TARGET_PATH);
  var targetPath = process.env.CLI_HOME_PATH;
  var homePath = process.env.CLI_HOME_PATH;
  var cmdObj = arguments[arguments.length - 1];
  console.log("arguments", arguments);
  var cmdName = cmdObj.name();
  var packageName = SETTINGS[cmdName];
  var packageVersion = "latest";
  var pkg = new Package({
    targetPath: targetPath,
    packageName: packageName,
    packageVersion: packageVersion
  });
  console.log(pkg);
}

module.exports = exec;