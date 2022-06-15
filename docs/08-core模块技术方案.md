# core 模块技术方案

命令执行流程

- 准备阶段
- 命令注册
- 命令执行

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

### Root 降级

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

### 检查用户主目录

如果没有主目录就直接报错。因为后续缓存等都依赖主目录。

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

### 检查入参

主要目的是检查 --debug，用于随后的 log.verbose。

**minimist**

```
require('minimest')(process.argv.slice(2))
```

### 检查环境变量

```
require('dotenv').config()
```
