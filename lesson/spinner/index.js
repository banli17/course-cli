const ora = require("ora");
const cliSpinner = require("cli-spinner");

const spinner = ora("加载中...").start();
spinner.spinner = "simpleDotsScrolling"; // line
// ora 内部的 spinner 是使用的库 cli-spinners，cli-spinners 提供了一个 json 文件，供选择样式
console.log(spinner);

setTimeout(() => {
  spinner.stop();
}, 1000);
