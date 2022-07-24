# 脚手架命令注册和执行过程开发

## 当前脚手架架构痛点

init 是动态的，每个团队的 init 是自己开发的。需要去动态加载各个团队的 init 包进行执行。如

- A 团队是 @a/init
- B 团队是 @b/init

![](imgs/2022-06-14-22-49-59.png)

![](imgs/2022-06-14-22-56-44.png)

## 增加 targetPath

1. 增加 option 参数

```js
.option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '')
```

2. 监听 targetPath

```js
program.on("option:targetPath", () => {
  const tp = program.getOptionValue("targetPath");
  if (tp) {
    progress.env.CLI_TARGET_PATH = tp;
  }
});
```

3. 在 `@v-cli/init` 中打印 process.env.CLI_TARGET_PATH, 可以得到值。

## 创建 @v-cli/exec 包

```
lerna create exec core
```

## 创建 @v-cli/package 包

```
lerna create package models
```

## 4-3 创建 npm 模块通用类 Package

Package 类的作用是根据参数，生成一个 npm 模块的信息。可以调用方法对模块进行安装，升级等操作。

在 models 下新建 Package 类。然后在 exec 中进行调用。

## 4-4 Package 类的属性、方法定义及构造函数逻辑开发

初始化 Package 类的属性和方法

- targetPath
- storePath
- packageName
- packageVersion
- exists()
- install()
- update()
- getRootFilePath()

在 exec 中实例化 Package。

## 4-5 Package 类获取入口文件路径功能开发

安装包时，需要获取到当前项目的根目录，也就是查找 package.json 的过程，可以通过 `pkg-dir` 包来实现。

```js
const pkgDir = require('pkg-dir').sync
class Package {
  ...
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
```

**@v-cli/format-path**

```js
function formatPath(p) {
  if (p && typeof p === "string") {
    const sep = path.sep;
    if (sep === "/") {
      return p;
    } else {
      return p.replace(/\\/g, "/"); // c:\\a -> c:/a
    }
  }
  return p;
}
```

**为什么需要转换路径?**

- `path.resolve()` 在拼接路径时，windows上会使用 `\`进行拼接，linux 上会使用 `/` 拼接。
  - 所以在 `path.resolve(dir, pkgFile.main)` 时, pkgFile.main 可能是 `lib/index.js`，这在 windows 上拼接会有问题。

- 如果将路径全部替换为 `/`，那么 windows 上还能 require 吗?

## 4-6 利用 npminstall 安装 npm 模块

```js
const npminstall = require('npminstall')
npminstall({
  root,
  storeDir,
  registry,
  pkgs: [
    {
      name,
      version
    }
  ]
})
```

- npminstall 返回的是 promise
- npminstall 的 storeDir 设置在 cliHome 目录上没弄懂什么意思?
