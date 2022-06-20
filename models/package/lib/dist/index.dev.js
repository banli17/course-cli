"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var utils = require("@v-cli/utils");

var Package =
/*#__PURE__*/
function () {
  function Package(options) {
    _classCallCheck(this, Package);

    if (!options) {
      throw new Error("Package: options \u4E0D\u80FD\u4E3A\u7A7A");
    }

    if (!utils.isObject(options)) {
      throw new Error("Package: options \u5FC5\u987B\u4E3A\u5BF9\u8C61");
    } // package 的路径


    this.targetPath = options.targetPath; // package 的存储路径

    this.storePath = options.storePath; // package 的 name 和 version

    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
  } // 判断 package 是否存在


  _createClass(Package, [{
    key: "exists",
    value: function exists() {} // 安装 package

  }, {
    key: "install",
    value: function install() {} // 更新 package

  }, {
    key: "update",
    value: function update() {} // 获取入口文件的路径

  }, {
    key: "getRootFilePath",
    value: function getRootFilePath() {}
  }]);

  return Package;
}();

module.exports = Package;