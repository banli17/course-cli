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

module.exports = utils;
