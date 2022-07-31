"use strict";

const fse = require("fs-extra");
const inquirer = require("inquirer");
const semver = require("semver");
const log = require("@v-cli/log");
const utils = require("@v-cli/utils");
const Command = require("@v-cli/command");
const Package = require("@v-cli/package");
const getProjectTemplate = require("./getProjectTemplate");

const TYPE_PROJECT = "project";
const TYPE_COMPONENT = "component";
const TEMPLATE_TYPE_NORMAL = "normal";
const TEMPLATE_TYPE_CUSTOM = "custom";
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || "";
    log.verbose("this._cmd", this._cmd);
    this.force = !!this._cmd.force;
    log.verbose(this.projectName, this.force);
    console.log("gggg");
  }

  async exec() {
    try {
      // 1. 准备阶段
      const projectInfo = await this.prepare();
      if (projectInfo) {
        this.projectInfo = projectInfo;
        log.verbose("projectInfo", projectInfo);
        // 2. 下载模版
        await this.downloadTemplate();
        // 3. 安装模版
        await this.installTemplate();
      }
    } catch (e) {
      log.error(e.message);
    }
  }

  async installTemplate() {
    console.log(`安装模版`, this.templateInfo);
    if (this.templateInfo) {
      if (!this.templateInfo.type) {
        this.templateInfo.type = TEMPLATE_TYPE_NORMAL;
      }

      if (this.templateInfo.type === TEMPLATE_TYPE_NORMAL) {
        this.installNormalTemplate();
      } else if (this.templateInfo.type === TEMPLATE_TYPE_CUSTOM) {
        this.installCustomTemplate();
      } else {
        throw new Error(`无法识别模版类型`);
      }
    } else {
      throw new Error(`模版信息不存在`);
    }
  }

  async installNormalTemplate() {
    let spinner = utils.spinnerStart("正在安装模版...");
    try {
      const templatePath = path.resolve(
        this.templateNpm.cacheFilePath,
        "template"
      );
      const targetPath = process.cwd();
      log.verbose('templatePath', templatePath)
      fse.ensureDirSync(templatePath);
      fse.ensureDir(targetPath);
      fse.copySync(templatePath, targetPath);
    } catch (e) {
      throw e;
    } finally {
      spinner.stop();
      log.info("模版安装成功");
    }
  }

  async installCustomTemplate() {
    console.log(`安装 custom 模版`);
  }

  async downloadTemplate() {
    const userHome = process.env.CLI_HOME_PATH;
    log.verbose("downloadTemplate", this.template, this.projectInfo);
    log.verbose("userHome", userHome);

    const { projectTemplate } = this.projectInfo;
    const templateInfo = this.template.find(
      (t) => t.npmName === projectTemplate
    );

    this.templateInfo = templateInfo;

    const targetPath = path.resolve(userHome, ".v-cli", "template");
    const storeDir = path.resolve(
      userHome,
      ".v-cli",
      "template",
      "node_modules"
    );
    const { npmName, version } = templateInfo;
    const templateNpm = new Package({
      targetPath,
      storeDir,
      packageName: npmName,
      packageVersion: version,
    });

    this.templateNpm = templateNpm;

    const npmExist = await templateNpm.exists();

    let spinner;
    try {
      if (!npmExist) {
        spinner = utils.spinnerStart("正在下载模版...");
        await utils.sleep();
        await templateNpm.install();
        spinner.stop();
        log.info(`模版下载成功`);
      } else {
        spinner = utils.spinnerStart("正在更新模版...");
        await utils.sleep();
        await templateNpm.update();
        spinner.stop();
        log.info(`模版更新成功`);
      }
    } catch (e) {
      log.error(e);
    }
  }

  async prepare() {
    // 0. 判断项目模版是否存在
    const template = await getProjectTemplate();
    log.verbose("template", template);
    if (!template || !template.length) {
      throw new Error(`项目模版不存在`);
    }
    this.template = template;

    // 1. 判断当前目录是否为空
    const localPath = process.cwd();
    const empty = this.isCwdEmpty(localPath);
    log.verbose("文件夹为空", empty);
    if (!empty) {
      let ifContinue;
      if (!this.force) {
        ifContinue = (
          await inquirer.prompt([
            {
              type: "confirm",
              name: "ifContinue",
              default: false,
              message: "当前文件夹不为空，是否继续创建项目",
            },
          ])
        ).ifContinue;

        if (!ifContinue) {
          return; // 不清空目录
        }
      }

      if (ifContinue || this.force) {
        // 二次确认，因为清空目录风险太大
        const { confirmDelete } = await inquirer.prompt({
          type: "confirm",
          name: "confirmDelete",
          default: false,
          message: "是否确认清空当前目录下的文件",
        });
        // 清空当前目录
        if (confirmDelete) {
          fse.emptyDirSync(localPath);
        }
      }
    }
    // 2. 是否启动强制更新
    return this.getProjectInfo();
  }

  async getProjectInfo() {
    let projectInfo = {};
    // 1. 选择创建项目或者组件
    const { type } = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "请选择项目类型",
        choices: [
          {
            name: "项目",
            value: "project",
          },
          {
            name: "组件",
            value: "component",
          },
        ],
      },
    ]);
    log.verbose("项目类型 ", type);
    if (type === TYPE_PROJECT) {
      // 2. 获取项目的基本信息
      projectInfo = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "请输入项目名称",
          default: "",
          validate(v) {
            // if(v === 'aa'){
            //   return true
            // }
            // log.error('\n haha') // 这样在不合法时会重复提问
            // return false
            const done = this.async();
            // 1. 首字符必须为英文字符
            // 2. 尾字符必须为英文或数字，不能为字符
            // 3. 字符仅允许 -_
            setTimeout(() => {
              if (!/^[a-zA-Z]+[\w-]*[a-zA-Z0-9]$/.test(v)) {
                done(`请输入合法的项目名称`); // 给用户提示
                return;
              }
              done(null, true);
            });

            // 如果return false，回车会卡在那，而没有任何提示
          },
        },
        {
          type: "input",
          name: "projectVersion",
          message: "请输入项目版本",
          default: "1.0.0",
          validate(v) {
            const done = this.async();
            // 1. 首字符必须为英文字符
            // 2. 尾字符必须为英文或数字，不能为字符
            // 3. 字符仅允许 -_
            setTimeout(() => {
              if (!semver.valid(v)) {
                done(`请输入合法版本号`); // 给用户提示
                return;
              }
              done(null, true);
            });

            // 如果return false，回车会卡在那，而没有任何提示
          },
          filter(v) {
            // 不正确的版本号如 1.0 会返回 null，另外一些不合法的版本如 v1.0.0 会转成 1.0.0
            if (!!semver.valid(v)) {
              return semver.valid(v);
            } else {
              return v;
            }
          },
        },
        {
          type: "list",
          name: "projectTemplate",
          message: "请选择项目模版",
          choices: this.createTempleateChoice(),
        },
      ]);
    } else if (type === TYPE_COMPONENT) {
    }
    projectInfo.type = type;

    return projectInfo;
  }

  createTempleateChoice() {
    return this.template.map((item) => {
      return {
        name: item.name,
        value: item.npmName,
      };
    });
  }

  isCwdEmpty(localPath) {
    // const localPath = process.cwd(); // path.resolve('.') 和 process.cwd() 是一样的
    log.verbose("localPath", localPath);
    let fileList = fse.readdirSync(localPath);
    log.verbose("fileList", fileList);
    // 文件过滤
    fileList = fileList.filter((file) => {
      return !file.startsWith(".") && ["node_modules"].indexOf(file) < 0;
    });
    return !fileList || fileList.length == 0;
  }
}

function init(argv) {
  log.verbose("init project", argv, process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
