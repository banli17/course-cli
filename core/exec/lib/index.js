"use strict";

const path = require("path");
const log = require("@v-cli/log");
const Package = require("@v-cli/package");

const SETTINGS = {
  init: "@v-cli/init",
};

const CACHE_DIR = "dependencies";

async function exec() {
  // console.log("exec", new Package());
  // console.log(process.env.CLI_HOME_PATH);
  // console.log(process.env.CLI_TARGET_PATH);
  let targetPath = process.env.CLI_TARGET_PATH;
  let storeDir = "";
  const homePath = process.env.CLI_HOME_PATH;
  const cmdObj = arguments[arguments.length - 1];
  // console.log("arguments", arguments);
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = "latest";
  let pkg;

  log.verbose("homePath", homePath);
  if (!targetPath) {
    // 没有 targetPath 就安装在全局 ？？
    targetPath = path.resolve(homePath, CACHE_DIR); // 生成缓存路径
    storeDir = path.resolve(targetPath, "node_modules");
    log.verbose("targetPath", targetPath);
    log.verbose("storeDir", storeDir);
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    });
    if (await pkg.exists()) {
      await pkg.update();
    } else {
      await pkg.install();
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    });
  }

  const rootFile = pkg.getRootFilePath();
  log.verbose("rootFile", rootFile);
  if (rootFile) {
    require(rootFile).apply(null, arguments);
  }
}

module.exports = exec;
