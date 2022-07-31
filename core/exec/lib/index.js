"use strict";
const path = require("path");
const log = require("@v-cli/log");
const Package = require("@v-cli/package");
const utils = require("@v-cli/utils");

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
    try {
      // 在 node 子进程中调用
      // require(rootFile).call(null, Array.from(arguments));

      // 对参数进行简化
      const args = Array.from(arguments).slice(0, -1);
      const originCmd = arguments[arguments.length - 1];
      // console.log(cmd.name());

      const cmd = args[args.length - 1];
      cmd.cmdName = originCmd.name();

      const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`;

      const child = utils.exec("node", ["-e", code], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      child.on("error", (e) => {
        log.error(e.message);
        process.exit(1);
      });
      child.on("exit", (e) => {
        log.verbose(`命令执行成功了`);
      });

      // stdio: 'pipe' 时
      // child.stdout.on("data", (chunk) => {});
      // child.stderr.on("data", (chunk) => {});
    } catch (e) {
      log.error(e.message);
    }
  }
}

module.exports = exec;
