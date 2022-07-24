# 脚手架核心流程开发(一): 整体介绍

脚手架的核心流程包括三步:

- 准备阶段
- 命令注册
- 命令执行

## 准备阶段

**涉及技术点**

核心库

- import-local
- Commander

工具库

- npmlog 打印日志
- fs-extra 文件操作
- semver 版本检查
- colors 打印彩色文字
- user-home 获取用户主目录
- dotenv 获取环境变量
- root-check root 检查和降级

**node 能识别的文件**

- .js
- .json -> JSON.parse
- .node -> dlopen
- 其他文件后缀 -> 只会当作 .js 进行解析, 如果解析失败会报错，比如 readme 里写 js 代码, 是可以的。不会尝试当 json 解析

```js
const a = require("../a.txt");
console.log(a); // object {} 是 module.exports 对象
```

## 准备阶段

在命令的准备阶段需要做的事情如下:

- import-local
- [命令包版本号检查](#命令包版本号检查)
- [Node 版本号检查](#Node版本号检查)
- [Root 账户检查和自动降级](#Root账户检查和自动降级)
- [用户主目录检查](#用户主目录检查)
- [入参检查](#入参检查)
- [环境变量检查](#环境变量检查)

### 命令包版本号检查

### Node 版本号检查

```js
function checkNodeVersion() {
  const currentVersion = process.version;
  const lowestVersion = pkg.engines.node;

  log.verbose(currentVersion, lowestVersion);

  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`@v-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`)
    );
  }
}
```

### Root 账户检查和自动降级

可以通过 process.getuid()来获取当前是否是 root 账户。

如果是 0，则表示是 root 账户，如果是 501，则表示非 root 账户。

通过 setuid(501) 降级为普通用户。

![](./imgs/2022-06-11-12-55-29.png)

**root-check 源码**

```js
"use strict";
var downgradeRoot = require("downgrade-root");
var sudoBlock = require("sudo-block");

module.exports = function () {
  try {
    downgradeRoot();
  } catch (err) {}

  sudoBlock.apply(null, arguments);
};

// downgrade-root
("use strict");
var isRoot = require("is-root");
var defaultUid = require("default-uid");

module.exports = function () {
  if (isRoot()) {
    // setgid needs to happen before setuid to avoid EPERM
    if (process.setgid) {
      var gid = parseInt(process.env.SUDO_GID, 10);
      if (gid && gid > 0) {
        process.setgid(gid);
      }
    }
    if (process.setuid) {
      var uid = parseInt(process.env.SUDO_UID, 10) || defaultUid();
      if (uid && uid > 0) {
        process.setuid(uid);
      }
    }
  }
};

// isRoot：重点
export default function isRoot() {
  return process.getuid && process.getuid() === 0;
}

// defaultUid，mac是501
var DEFAULT_UIDS = {
  darwin: 501,
  freebsd: 1000,
  linux: 1000,
  sunos: 100,
};
module.exports = function (platform) {
  return DEFAULT_UIDS[platform || process.platform];
};
```

### 用户主目录检查

如果没有主目录就直接报错。因为后续缓存等都依赖主目录。

```js
const userHome = require("user-home");
function checkUserHome() {
  // 原理 os.homedir ? os.homedir : homedir -> platform
  // log.info 判断如果是函数会执行
  // log.info(require('os').homedir())
  if (!userHome && !pathExists(userHome)) {
    throw new Error(colors.red(`当前登录用户主目录不存在`));
  }
}
```

**user-home 源码**

```js
"use strict";
var os = require("os");

function homedir() {
  var env = process.env;
  var home = env.HOME;
  var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;

  if (process.platform === "win32") {
    return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null;
  }

  if (process.platform === "darwin") {
    return home || (user ? "/Users/" + user : null);
  }

  if (process.platform === "linux") {
    return (
      home || (process.getuid() === 0 ? "/root" : user ? "/home/" + user : null)
    );
  }

  return home || null;
}

module.exports = typeof os.homedir === "function" ? os.homedir : homedir;
```

### 入参检查

主要目的是检查 --debug，用于随后的 log.verbose。

**minimist**

```
require('minimest')(process.argv.slice(2))
```

可以用 commander 进行代替。

### 环境变量检查

dotenv 库可以将 .env 文件中的配置项加载到 process.env 对象上。

```js
function checkEnv() {
  const dotenv = require("dotenv");
  // config 不传递参数时, 默认会找 process.cwd() + '.env' 文件，不是在主目录找, 如果没有这个文件, 就会报错
  const dotenvPath = path.resolve(userHome, ".env");
  // 在 .env 写入 CLI_HOME=course-cli 后面不加;
  log.verbose("环境变量地址", dotenvPath);
  if (pathExists(dotenvPath)) {
    // 将文件配置 设置到 process.env 环境变量上
    // 如 .env 里的 CLI_HOME=course-cli  会挂在 process.env.CLI_HOME 上
    dotenv.config({
      path: dotenvPath,
    });
  }

  // 方案1 不好
  // config = createDefaultConfig()
  // log.verbose('环境变量', config) // { parsed: { CLI_HOME: 'course-cli;' } }

  // 方案2
  createDefaultConfig();
  log.verbose("环境变量", process.env.CLI_HOME_PATH); // 缓存路径 /Users/banli/.my-v-cli
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig.cliHome = path.join(userHome.constant.DEFAULT_CLI_HOME);
  }
  // 对应上面方案2 直接赋值
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
  return cliConfig;
}
```
