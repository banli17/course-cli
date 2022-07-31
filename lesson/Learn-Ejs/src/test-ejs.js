import ejs from "./ejs.js";

const data = {
  user: {
    name: "张三",
  },
};

const compileFn = ejs.compile(`<div><%= user.name %></div>`);

const res = compileFn(data)

console.log(res)
