"use strict";
const semver = require("semver");
const colors = require("colors");
const log = require("@v-cli/log");
const pkg = require("../package.json");

class Command {
  constructor(argv) {
    this._argv = argv;
    if (!argv) {
      throw new Error(`参数不能为空`);
    }
    if (!Array.isArray(argv)) {
      throw new Error(`参数必须是数组`);
    }
    if (argv.length < 1) {
      throw new Error(`数组不能为空`);
    }
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgs());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((e) => {
        log.error(e.message);
      });
    });
  }

  initArgs() {
    this._cmd = this._argv[this._argv.length - 1];
    this._argv = this._argv.slice(0, this._argv.length - 1);
  }

  checkNodeVersion() {
    // 获取当前 Node 版本
    const currentVersion = process.version;
    const lowestVersion = pkg.engines.node;

    log.verbose(currentVersion, lowestVersion);

    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(
        colors.red(`@v-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`)
      );
    }
  }

  init() {
    throw new Error(`init 必须实现`);
  }

  exec() {
    throw new Error(`exec 必须实现`);
  }
}

module.exports = Command;
