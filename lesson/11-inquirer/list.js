import EventEmitter from "events";
import readline from "readline";
import MuteStream from "mute-stream";
import { fromEvent } from "rxjs";
import ansiEscapes from "ansi-escapes";

const option = {
  type: "list",
  name: "name",
  message: "select your name:",
  choices: [
    {
      name: "张三",
      value: "zhangsan",
    },
    {
      name: "李四",
      value: "lisi",
    },
    {
      name: "王五",
      value: "wangwu",
    },
  ],
};

class List extends EventEmitter {
  constructor(option) {
    super();

    this.name = option.name;
    this.message = option.message;
    this.choices = option.choices;
    this.input = process.stdin;

    // 创建一个中间流，对数据进行选择性输出
    const ms = new MuteStream();
    ms.pipe(process.stdout);
    this.output = ms;

    this.rl = readline.createInterface({
      input: this.input,
      output: this.output,
    });

    this.selected = 0;
    this.height = 0;
    this.keypress = fromEvent(this.rl.input, "keypress").forEach(
      this.onkeypress
    );
    // fromEvent 会将 e 组装成一个对象
    // this.rl.input.on("keypress", this.onkeypress);
    this.haveSelected = false; // 是否已经选择完毕
  }

  onkeypress = (keymap) => {
    // console.log(keymap[1]);
    const key = keymap[1];
    if (key.name === "down") {
      this.selected++;
      if (this.selected > this.choices.length - 1) {
        this.selected = 0;
      }
      this.render();
    } else if (key.name === "up") {
      this.selected--;
      if (this.selected < 0) {
        this.selected = this.choices.length - 1;
      }
      this.render();
    } else if (key.name === "return") {
      this.haveSelected = true;
      this.render();
      this.close();
      this.emit("exit", this.choices[this.selected]);
    }
  };

  close() {
    this.output.unmute(); // 解除静默
    this.rl.output.end(); // 结束
    this.rl.pause();
    this.rl.close();
  }

  render() {
    this.output.unmute(); // 解除静默
    this.clean(); // 清屏
    this.output.write(this.getContent());
    this.output.mute(); // 打印列表后，禁止控制台打印
  }

  getContent() {
    // console.log("render");
    if (!this.haveSelected) {
      let content =
        "\x1B[32m?\x1B[39m \x1B[1m" +
        this.message +
        "\x1B[22m\x1B[0m \x1B[0m\x1B[2m(Use arrow keys)\x1B[22m\n";

      const choicesLen = this.choices.length - 1;
      this.choices.forEach((choice, index) => {
        if (this.selected === index) {
          if (choicesLen === index) {
            content += "\x1B[36m》" + choice.name + "\x1B[39m ";
          } else {
            content += "\x1B[36m》" + choice.name + "\x1B[39m \n";
          }
        } else {
          if (choicesLen === index) {
            content += `  ${choice.name} `;
          } else {
            content += `  ${choice.name} \n`;
          }
        }
      });
      content += "\u001B[?25l"; // 隐藏光标，会导致后续命令行光标也消失
      this.height = this.choices.length + 1;
      return content;
    } else {
      // 输入之后的逻辑
      const name = this.choices[this.selected].name;
      let content =
        "\x1B[32m?\x1B[39m \x1B[1m" +
        this.message +
        "\x1B[22m\x1B[0m \x1B[36m" +
        name +
        "\x1B[39m\x1B[0m \n";
      content += "\u001B[?25h"; // 显示光标
      return content;
    }
  }

  clean() {
    const emptyLines = ansiEscapes.eraseLines(this.height);
    // console.log('emptyLines, ', emptyLines)
    this.output.write(emptyLines);
  }
}

function Prompt(option) {
  return new Promise((resolve, reject) => {
    try {
      const list = new List(option);
      list.render();
      list.on("exit", (answer) => {
        resolve(answer);
      });
    } catch (e) {
      reject(e);
    }
  });
}

Prompt(option);
