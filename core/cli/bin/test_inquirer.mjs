// #!/usr/bin/env node

// const inquirer = require("inquirer");
import inquirer from "inquirer";

inquirer
  .prompt(
    [
      {
        type: "input", // input number confirm list rawlist expand checkbox password editor
        name: "name",
        message: "your name",
        default: "noname",
        validate(v) {
          // console.error("\not pass validate", v);
          return v !== "hi"; // 如果输入不正确，会一直提示输入
        },
        transformer(v) {
          return "name[" + v + "]"; // 会显示在提示信息中，但不会影响结果
        },
        // filter(v) {
        // return "0-" + v; // 会修改返回的结果
        // },
        prefix: "prefix",
        suffix: "suffix",
      },
      {
        type: "number", // 会转换为数字，如 a -> NaN
        name: "age",
        message: "your age",
        askAnswered: true,
        // when(answer) {
        //   // 返回 true，则该问题会提问
        //   console.log("when", answer);
        //   return answer.name == "ok";
        // },
      },
    ],
    {
      age: 12,
    }
  )
  .then((answer) => {
    console.log(answer);
  })
  .catch((e) => {
    console.log("error", e.message);
  });
