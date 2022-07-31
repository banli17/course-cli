"use strict";

const utils = {};

utils.isObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

utils.spinnerStart = (message, style) => {
  // const cliSpinners = require("cli-spinners");
  const ora = require("ora");
  const spinner = ora(message).start();
  if (style) {
    Object.assign(spinner, style);
  }
  return spinner;
};

utils.sleep = (timeout = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout * 1000);
  });
};

// 兼容 windows
utils.exec = function spawn(command, args, options = {}) {
  const cp = require('child_process')
  const win32 = process.platform === "win32";

  const cmd = win32 ? "cmd" : command;
  // /c 表示静默执行
  // windows 下执行命令 cmd /c node -e xx
  const cmdArgs = win32 ? ["/c"].concat(command, args) : args;
  // [1].concat(2, [3, 4]) -> [1, 2, 3, 4]

  return cp.spawn(cmd, cmdArgs, options);
};

module.exports = utils;
