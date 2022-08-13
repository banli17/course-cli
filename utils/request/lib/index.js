"use strict";

const axios = require("axios");

const BASE_URL = process.env.V_CLI_BASE_URL || "";

let request = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request = () => {
  return [
    {
      name: "template-a 模版",
      npmName: "@v-cli/template-a",
      version: "1.0.0",
      installCommand: "npm i",
      startCommand: "npm run start",
    },
    {
      name: "template-b 模版",
      npmName: "@v-cli/template-b", // 这里模版是发布成了 npm 包
      version: "1.0.0",
    },
  ];
};

module.exports = request;
