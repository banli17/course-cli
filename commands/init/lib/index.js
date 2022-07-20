"use strict";

const Command = require("@v-cli/command");

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || "";
    console.log("this._cmd", this._cmd);
    this.force = !!this._cmd.force;
    console.log(this.projectName, this.force);
  }
}

function init(argv) {
  console.log("init project", argv, process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
