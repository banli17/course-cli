import ejs from "./ejs.js";

const data = {
  user: {
    name: "张三",
  },
};

const compileFn = ejs.compile(`<div><%= user.name %></div>`);
// console.log(compileFn.toString())

const res = compileFn(data)

console.log(res)
