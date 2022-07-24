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
      name: "vue2.0模版",
      npmName: "vue",
    },
    {
      name: "react模版",
      npmName: "react", // 这里模版是发布成了 npm 包
    },
  ];
};

module.exports = request;
