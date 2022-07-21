"use strict";

const fs = require("fs");
const log = require("@v-cli/log");
const Command = require("@v-cli/command");

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || "";
    log.verbose("this._cmd", this._cmd);
    this.force = !!this._cmd.force;
    log.verbose(this.projectName, this.force);
  }

  exec() {
    try {
      // 1. 准备阶段
      this.prepare();
      // 2. 下载模版
      // 3. 安装模版
    } catch (e) {
      log.error(e.message);
    }
  }

  prepare() {
    // 1. 判断当前目录是否为空
    const ret = this.isCwdEmpty();
    // 2. 是否启动强制更新
    // 3. 选择创建项目或者组件
    // 4. 获取项目的基本信息
  }

  isCwdEmpty() {
    const localPath = process.cwd(); // path.resolve('.') 和 process.cwd() 是一样的
    log.verbose("localPath", localPath);
    let fileList = fs.readdirSync(localPath);
    log.verbose("fileList", fileList);
    // 文件过滤
    fileList = fileList.filter((file) => {
      return !file.startsWith(".") && ["node_modules"].indexOf(file) < 0;
    });
    return !fileList || fileList.length == 0;
  }
}

function init(argv) {
  log.verbose("init project", argv, process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
