import fs from "fs";

class Template {
  static modes = {
    EVAL: "eval",
    ESCAPED: "escaped",
  };
  constructor(html, options) {
    this.source = "";
    this.html = html;
    this.options = options;
    this.mode = "";
    this.reg = /(<%=|%>)/;
  }

  compile() {
    // 拼出 this.source
    this.generateSource();

    console.log(this.source);
    let code = `
      let __output = '';
      function __append(v){
        __output += v
      }
      with(data) {
        ${this.source}
      }
      return __output;
    `;
    console.log("code", code);
    let fn = new Function("data", code);
    return fn;
  }

  // 生成 source
  generateSource() {
    let matches = this.parseTemplateText();
    console.log(matches);

    matches.forEach((line) => {
      this.scanLine(line);
    });
  }

  scanLine(line) {
    let o = "<"; // options.openDelimiter
    let d = "%"; // options.delimiter
    let c = ">"; // options.closeDelimiter
    switch (line) {
      case o + d:
        this.mode = Template.modes.EVAL; // 'eval'
        break;
      case o + d + "=":
        this.mode = Template.modes.ESCAPED;
        break;
      case d + c:
        this.mode = null;
        break;
      default:
        if (this.mode) {
          if (this.mode === Template.modes.ESCAPED) {
            this.source += `__append(${line});`;
          }
        } else {
          this._addOutput(line);
        }
    }
  }

  _addOutput(line) {
    this.source += `__append("${line}");`;
  }

  parseTemplateText() {
    let src = this.html;
    let ret = this.reg.exec(src);
    let matches = [];
    let index = 0;
    let end = 0;

    while (ret) {
      matches.push(src.slice(index, ret.index));

      end = ret.index + ret[0].length;
      matches.push(src.slice(ret.index, end));

      src = src.slice(end);
      ret = this.reg.exec(src);
      console.log(src, ret);
    }

    if (end !== this.html.length - 1) {
      matches.push(src);
    }
    return matches;
  }
}

const compile = (html, option) => {
  const tpl = new Template(html, option);

  return tpl.compile();
};

const render = (html, data, option) => {
  const fn = compile(html, option);
  return fn(data);
};

const renderFile = (filePath, data, option, callback) => {
  const html = fs.readFileSync(filePath);
  const fn = compile(html, option);
  fn(data);
  callback && callback();
};

export default {
  compile,
  render,
  renderFile,
};
