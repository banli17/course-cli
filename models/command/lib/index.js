"use strict";
const semver = require("semver");
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

  // 检查当前 Node 版本
  checkNodeVersion() {
    const currentVersion = process.version;
    const allowVersion = pkg.engines.node;

    log.verbose(currentVersion, allowVersion);

    if (!semver.gte(currentVersion, allowVersion)) {
      log.error(`@v-cli 需要安装 v${allowVersion} 版本的 Node.js`);
      process.exit(1);
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
