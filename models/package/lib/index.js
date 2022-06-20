"use strict";
const utils = require("@v-cli/utils");
class Package {
  constructor(options) {
    if (!options) {
      throw new Error(`Package: options 不能为空`);
    }
    if (!utils.isObject(options)) {
      throw new Error(`Package: options 必须为对象`);
    }
    // package 的路径
    this.targetPath = options.targetPath;
    // package 的存储路径
    this.storePath = options.storePath;
    // package 的 name 和 version
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
  }

  // 判断 package 是否存在
  exists() {}

  // 安装 package
  install() {}

  // 更新 package
  update() {}

  // 获取入口文件的路径
  getRootFilePath() {}
}

module.exports = Package;
