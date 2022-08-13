# pnpm

## 严格模式

npm 和 yarn 安装模块会扁平化安装，比如 webpack 安装时，会将 webpack 的依赖 terser 也安装在 node_modules 下，这样 terser 就也可以进行访问使用。

它可能产生一些问题：

- 如果 webpack 后面将 terser 依赖去掉了，那么项目中会出现找不到 terser 的问题。
- 如果项目用了 terser@1.0 的 api，而 webpack 后面升级为 terser@2.0，api 进行了修改，这样项目中 api 也可能报错。

[dependency-check](https://www.npmjs.com/package/dependency-check) 可以用来检查依赖。


pnpm 安装模块时只会将依赖放在 node_modules 里，而依赖的依赖会放在 .pnpm 里。

另外 npm 也可以实现 pnpm 的效果，通过设置 [`npm c set global-style true`](https://docs.npmjs.com/cli/v8/using-npm/config)。
