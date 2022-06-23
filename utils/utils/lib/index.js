"use strict";

const utils = {};

utils.isObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

module.exports = utils;
