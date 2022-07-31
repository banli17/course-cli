import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import ejs from "ejs";
const html = `<div><%= user.name %></div>`;

const option = {
  // delimiter: '?', // 分隔符，默认是 %
  // openDelimiter: '<',  // 默认是 <
  // closeDelimiter: '>', // 默认是 >
  cache: true,
  filename: "会作为缓存的健",
  // root, 会作为 include 绝对文件(如/file.ejs)的解析路径，可以是数据，会依次尝试
  // views 会作为 include 相对文件的解析路径，可以是一个数据
  compileDebug: false, // 关闭时没有调试信息
  // client: true, 返回独立的 compile 函数，默认生成函数是可以共享提高性能
  debug: true, // 输出生成的函数体
  rmWhitespace: true, // 移除所有空格
  outputFunctionName: "echo", // 输出函数的名称，在内部函数脚本里用到
  async: false, // 异步渲染
  escape: (value) => { // 转换时所有变量都会走这个函数, 默认是 .toString()
    console.log(value);
    return value
  },
};
const data = {
  user: {
    name: "zhangsan",
  },
  copyright: "版权信息",
};

// 用法1 compile
const compileFunction = ejs.compile(html, option); // 返回一个编译函数

const tpl1 = compileFunction(data);

console.log(tpl1); // <div>zhangsan</div>

// 用法2 render
const tpl2 = ejs.render(html, data, option);
console.log(tpl2); // <div>zhangsan</div>

// 用法3 renderFile, 支持 callback 和 promise 两种方式
const __filename = fileURLToPath(import.meta.url); // esm 不会注入 __dirname, 需要自己解析
const __dirname = path.dirname(__filename);

console.log(__dirname);
// /Users/banli/Desktop/course/course-cli/lesson/Learn-Ejs/src

ejs.fileLoader = (filePath) => {
  return "哈哈" + fs.readFileSync(filePath);
};

const tpl3 = ejs.renderFile(
  path.resolve(__dirname, "template.html"),
  data,
  option,
  // (err, result) => {
  //   console.log("result", result); // <div>zhangsan</div>
  // }
);

tpl3.then((data) => {
  console.log(data);
});

console.log(ejs);
