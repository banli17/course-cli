"use strict";
const path = require("path");
const utils = require("@v-cli/utils");
const log = require("@v-cli/log");
const { getDefaultRegistry } = require("@v-cli/get-npm-info");
const formatPath = require("@v-cli/format-path");
const pkgDir = require("pkg-dir").sync;
const npminstall = require("npminstall");
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
    // 缓存路径
    this.storeDir = options.storeDir;
    // package 的存储路径
    // this.storePath = options.storePath;
    // package 的 name 和 version
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
  }

  // 判断 package 是否存在
  exists() {}

  // 安装 package
  install() {
    npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion,
        },
      ],
    });
  }

  // 更新 package
  update() {}

  // 获取入口文件的路径
  getRootFilePath() {
    // 1. 获取 package.json 所在目录 pkg-dir
    const dir = pkgDir(this.targetPath);
    log.verbose("dir", dir);
    if (dir) {
      // 2. 读取 package.json
      const pkgFile = require(path.resolve(dir, "package.json"));
      // 3. main/lib - path
      if (pkgFile && pkgFile.main) {
        // 4. 路径的兼容(macOS/windows)
        log.verbose("formatPath", formatPath(path.resolve(dir, pkgFile.main)));
        return formatPath(path.resolve(dir, pkgFile.main));
      }
    }
    return null;
  }
}

module.exports = Package;
