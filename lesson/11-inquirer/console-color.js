console.log("\x1b[106m \x1b[36m%s \x1b[0m", "I am cyan");
console.log("\x1b[5m \x1b[36m%s \x1b[0m", "I am cyan");
console.log("i am banli");

import util from "util";

function Person() {
  this.name = "byvoid";
  this.toString = function () {
    return this.name;
  };
}
var obj = new Person();
console.log(util.inspect(obj));
console.log(util.inspect(obj, true));
