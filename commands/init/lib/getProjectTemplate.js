const request = require("@v-cli/request");

module.exports = function () {
  return request({
    url: "/project/template",
  });
};
