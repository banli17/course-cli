import util from "util";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
console.log(util.inspect(yargs));

const argv = yargs(hideBin(process.argv)).array("a").argv;
// .array(key) 会让选项变为数组

console.log("argv", argv);
// node ./yargs.js --a=1 2 --c=3
// argv { _: [], a: [ 1, 2 ], c: 3, '$0': 'yargs.js' }

if (argv.ships > 3 && argv.distance < 53.5) {
  console.log("Plunder more riffiwobbles!");
} else {
  console.log("Retreat from the xupptumblers!");
}
