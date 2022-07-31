class Template {
  // 返回一个编译的函数
  compile(html, data, option) {
    // 1. 将 tpl 拆成数组
    const reg = /(<%=|%>)/;
    const html0 = html;
    let arr = [];
    let str;
    let ret = "";
    let index = 0;
    // return;
    while ((ret = reg.exec(html))) {
      str = ret[0];
      console.log(ret);
      arr.push(html.slice(0, ret.index));
      index += ret.index + ret[0].length;
      html = html.slice(index);
    }
    arr.push(html0.slice(index));
    console.log(arr);

    // 1. 拆分成数组
    // 2. 遍历数组，进行 scanLine 的同时，设置 mode，比如遇到 <%= 就设置 mode 为 escape
    // 3. 拼接 this.source
    //   user.name ->  += '    ; __append(escapeFn(' + stripSemi(line) + '))' + '\n';
    //   div ->  += '__append("'+line+'")'
    // '  var __output = "";\n  function __append(s) { if (s !== undefined && s !== null) __output += s }\n  var echo = __append;\n  with (locals || {}) {\n    ; __append("<div>")\n    ; __append(escapeFn( user.name ))\n    ; __append("</div>")\n  }\n  return __output;\n'


    const code = `
      var __output = "";
      function __append(s){
        if(s!== undefined && s!== null){
          __output += s
        }
      }

      with(data) {
        __append('<div>');
        __append(user.name);
        __append('</div>')
      }
      return __output;

    `;
    return new Function("data", code);
  }

  render() {}

  renderFile() {}
}

const ejs = new Ejs();
export default ejs;
