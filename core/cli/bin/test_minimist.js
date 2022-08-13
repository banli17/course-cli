var argv = require("minimist")(process.argv.slice(2), {
  // default: "x",
  string: true,
  // unknown(a) {
  //   console.log("unknown", a);
  //   return true
  // },
});

console.log(argv);
