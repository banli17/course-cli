"use strict";

var utils = {};

utils.isObject = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

module.exports = utils;