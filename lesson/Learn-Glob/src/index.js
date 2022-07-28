import path from "path";
import { fileURLToPath } from "url";
import glob from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

glob(
  "*",
  {
    cwd: __dirname,
    ignore: ["node_modules/**"], // 排除，需要加 **
    absolute: true, // 返回绝对路径
    dot: true, // 匹配隐藏文件, * 默认不包含.，设置后相当于.*, 默认为 false,
    mark: true, // 设置后目录最后会加 /, 默认 false
    debug: true, // 打印调试日志
    nocase: true, // 不区分大小写
    matchBase: true, // 仅匹配 basename, 如 *.js 等同于 **/*.js
    realpath: true, // 调用 realpath 后的结果，主要针对符号链接
    // noglobstar: true, // 不支持 **
    nomount: false, // 默认情况下，/开头的模式会当作根目录，开启选项时禁用该模式
    nosort: false, // 不要对结果进行排序
    strict: false, // 读取目录遇到异常时，会继续搜索其它匹配下，设为 true 将会报错
    silent: true, // 读取报错时，就向 stderr 打印警告，开启选项时，将不输出警告
  },
  (err, matches) => {
    console.log(matches);
  }
);
