"use strict";

var path = require("path");

var pkg = require("../package.json");

var log = require("@v-cli/log");

var semver = require("semver");

var colors = require("colors");

var userHome = require("user-home");

var pathExists = require("path-exists").sync;

var fs = require("fs-extra");

var _require = require("@v-cli/get-npm-info"),
    getNpmSemverVersion = _require.getNpmSemverVersion;

var commander = require("commander");

var init = require("@v-cli/init");

var exec = require("@v-cli/exec");

function core() {
  return regeneratorRuntime.async(function core$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(prepare());

        case 3:
          registerCommand();
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          log.info(_context.t0.message);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
}

function prepare() {
  return regeneratorRuntime.async(function prepare$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          checkPkgVersion();
          checkNodeVersion();
          checkRoot();
          checkUserHome(); // checkInputArgs()

          checkEnv();
          _context2.next = 7;
          return regeneratorRuntime.awrap(checkGlobalUpdate());

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}

var program = new commander.Command();

function registerCommand() {
  program.name(Object.keys(pkg.bin)[0]).usage("<command> [options]").version(pkg.version).option("-d, --debug", "是否开启调试模式", false).option("-tp, --targetPath <targetPath>", "是否指定本地调试文件路径", "");
  program.command("init [projectName]").option("-f, --force", "是否强制初始化").action(exec);
  program.on("option:debug", function () {
    if (program.getOptionValue("debug")) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }

    log.level = process.env.LOG_LEVEL;
    log.verbose("debug", "debug开启了");
  }); // 这里 option 的解析, 在 action 之前执行

  program.on("option:targetPath", function () {
    var targetPath = program.getOptionValue("targetPath");

    if (targetPath) {
      process.env.CLI_TARGET_PATH = targetPath;
    }
  });
  program.on("command:*", function (obj) {
    var availableCommands = program.commands.map(function (cmd) {
      return cmd.name();
    });
    console.log(colors.red("\u672A\u77E5\u7684\u547D\u4EE4".concat(obj[0])));

    if (availableCommands.length > 0) {
      console.log(colors.red("\u53EF\u7528\u547D\u4EE4".concat(availableCommands.join(","))));
    }
  });
  program.parse(process.argv); // console.log(program)
  // 这个要放到 parse 之后, 否则 args 还没有解析
  // if (process.argv.length < 3) {

  if (program.args && program.args.length < 1) {
    program.outputHelp();
    console.log(); // 打印空行
  }
} // 检查版本号


function checkPkgVersion() {
  log.info("cli", pkg.version);
}

function checkNodeVersion() {
  // 获取当前 Node 版本
  var currentVersion = process.version;
  var lowestVersion = pkg.engines.node;
  log.verbose(currentVersion, lowestVersion);

  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red("@v-cli \u9700\u8981\u5B89\u88C5 v".concat(lowestVersion, " \u4EE5\u4E0A\u7248\u672C\u7684 Node.js")));
  }
}

function checkRoot() {
  var rootCheck = require("root-check");

  rootCheck(); // 会对 root 进行降级
}

function checkUserHome() {
  // 原理 os.homedir ? os.homedir : homedir -> platform
  // log.info 判断如果是函数会执行
  // log.info(require('os').homedir())
  if (!userHome && !pathExists(userHome)) {
    throw new Error(colors.red("\u5F53\u524D\u767B\u5F55\u7528\u6237\u4E3B\u76EE\u5F55\u4E0D\u5B58\u5728"));
  }
}

var args;

function checkInputArgs() {
  // log.info(process.argv) // [node路径, 命令名, 命令参数]
  var minimist = require("minimist");

  args = minimist(process.argv.slice(2));
  checkArgs();
}

function checkArgs() {// if (args.debug) {
  // 	process.env.LOG_LEVEL = 'verbose'
  // } else {
  // 	process.env.LOG_LEVEL = 'info'
  // }
  // log.level = process.env.LOG_LEVEL // 这里要设置一下，因为 utils/log 设置 level 在拿到 LOG_LEVEL 之前执行了
  // log.verbose('debug', '开启了 debug')
}

function checkEnv() {
  var dotenv = require("dotenv"); // config 不传递参数时, 默认会找 process.cwd() + '.env' 文件，不是在主目录找, 如果没有这个文件, 就会报错


  var dotenvPath = path.resolve(userHome, ".env"); // 在 .env 写入 CLI_HOME=course-cli 后面不加;

  log.verbose("环境变量地址", dotenvPath);

  if (pathExists(dotenvPath)) {
    // 将文件配置 设置到 process.env 环境变量上
    // 如 .env 里的 CLI_HOME=course-cli  会挂在 process.env.CLI_HOME 上
    dotenv.config({
      path: dotenvPath
    });
  } // 方案1 不好
  // config = createDefaultConfig()
  // log.verbose('环境变量', config) // { parsed: { CLI_HOME: 'course-cli;' } }
  // 方案2


  createDefaultConfig();
  log.verbose("环境变量", process.env.CLI_HOME_PATH); // 缓存路径 /Users/banli/.my-v-cli
}

function createDefaultConfig() {
  var cliConfig = {
    home: userHome
  };

  if (process.env.CLI_HOME) {
    cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig.cliHome = path.join(userHome.constant.DEFAULT_CLI_HOME);
  } // 对应上面方案2 直接赋值


  process.env.CLI_HOME_PATH = cliConfig.cliHome;
  return cliConfig;
}

function checkGlobalUpdate() {
  var currentVersion, npmName, lastVersion;
  return regeneratorRuntime.async(function checkGlobalUpdate$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // 1. 获取当前版本号和模块名
          currentVersion = pkg.version;
          npmName = pkg.name; // 2. 调用 npm API, 获取所有版本号

          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(getNpmSemverVersion(currentVersion, npmName));

        case 5:
          lastVersion = _context3.sent;

          if (lastVersion) {
            log.warn(colors.yellow("\u8BF7\u624B\u52A8\u66F4\u65B0 ".concat(npmName, ", \u5F53\u524D\u7248\u672C: ").concat(currentVersion, ", \u6700\u65B0\u7248\u672C: ").concat(lastVersion, " \u66F4\u65B0\u547D\u4EE4 npm i ").concat(npmName)));
          }

          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](2);
          log.error("错误了", _context3.t0);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 9]]);
}

module.exports = core;