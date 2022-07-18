const path = require("path");
const glob = require("glob");
const lernaJson = require("./lerna.json");

// 遍历所有的包
const configs = [];

lernaJson.packages.forEach((item) => {
  const dirs = glob.sync(item);
  console.log(dirs);
  dirs.forEach((dir) => {
    const dirPath = path.resolve(__dirname, dir, "lib/index.js"); // 完整的包目录
    configs.push({
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
    });
  });
});

module.exports = configs;
