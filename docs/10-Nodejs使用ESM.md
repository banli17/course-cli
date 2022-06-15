# Nodejs 使用 ESM

## Nodejs 中使用 esModule

### 方式一：使用 webpack

```js
module.exports = {
  mode: "development",
  entry: dirPath,
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, dir, "dist"),
    library: {
      // export: 'default',
      type: "commonjs", // 用于 require, 不写的话 require 是一个空对象
    },
  },
  target: "node",

  // context: __dirname,
  // node: {
  // 	__filename: false,
  // 	__dirname: false
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 3, // 需要装 @babel/runtime-corejs3
                  regenerator: true,
                  useEsModules: true,
                  helpers: true,
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
```

不过试了下，还是有很多问题。

### 方式二：使用 mjs

1. 脚本文件需要使用 `.mjs` 后缀
2. 如果是包，需要在 package.json 中添加 `{type: 'module'}` 和 `exports` (相当于 main) 字段
3. 在 require 时，需要添加文件后缀

- Nodejs v10 以上试验性支持 es6, 启动 node 命令时添加 `--experimental-module`
- Nodejs v12.20 以上自动支持 es6, 不过 node 命令运行时需要 `.mjs` 后缀, 如果是包里加了 `type:module` 则不需要加 `.mjs`

例如：

```
# node v10
node --experimental-module 1.mjs

# node v14
node 1.mjs

# 加文件后缀
require('./2.mjs')
```
