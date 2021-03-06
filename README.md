# 前端脚手架开发

## 目录

1. [需求分析和设计](lesson/01-Req-Analysis-and-Design/README.md)
1. [需求设计](lesson/02-Tec-Design/README.md)
1. [脚手架执行原理](lesson/03-Principle-Of-Scaffold/README.md)
1. [学习 yargs](lesson/04-Learn-Yargs/README.md)
1. [学习 lerna](lesson/05-Learn-Lerna/README.md)
1. [脚手架核心流程开发(一): 整体介绍](lesson/06-Scaffold-Core/README.md)
1. [脚手架核心流程开发(二): 准备阶段](lesson/08-Scaffold-Command-Prepare/README.md)
1. [学习 commander.js](lesson/07-Learn-Commander/README.md)
1. [脚手架核心流程开发(三): 命令注册](lesson/08-Scaffold-Command-Register/README.md)
1. [脚手架核心流程开发(四): 命令执行](lesson/09-Scaffold-Command-Exec/README.md)
1. [脚手架创建项目流程开发](lesson/10-Scaffold-Create-Project/README.md)
1. [学习 inquirer.js](lesson/11-Learn-Inquirer/README.md)
1. [命令行交互原理](lesson/12-Principle-Of-CLI/README.md)

## 常用库

- [ora](lesson/Lib-Ora/README.md)

## 附录

1. [Nodejs 如何使用 ESM](lesson/Appendix-Use-ESM-In-Node/README.md)
2. [命令调试方法](lesson/Appendix-Debugger/README.md)

## 收获

- 脚手架实现原理
- lerna 常见用法
- 架构设计技巧和架构图绘制方法

## 主要内容

- 学习如何以架构师角度思考基础架构问题
- 多 packages 项目管理痛点和解决方案，基于 lerna 脚手架框架搭建
- 脚手架需求分析和架构设计，架构设计图

## 学习方法

- 架构三部曲：掌握原理，独立思考，总结反思
- 深度剖析开源项目
- 视角切换：多切换架构师视角，从全局思考问题

目标 -

脚手架的核心目标：提升前端研发效率

大厂研发架构图

- 每条研发线都有很多团队
- 都需要
  - 创建项目、通用代码
    - 埋点
    - http 请求
    - 工具方法
    - 组件库
  - git 操作
    - 创建仓库
    - 代码冲突
    - 远程代码同步
    - 创建版本
    - 发布打 tag
  - 构建、发布上线
    - 依赖安装和构建
    - 资源上传到 CDN
    - 域名绑定
    - 测试/正式服务器

脚手架核心价值
将研发过程：

- 自动化: 项目重复代码拷贝/git 操作/发布上线操作
- 标准化: 项目创建/git flow/发布流程/回滚流程
- 数据化：研发过程系统化、数据化、使得研发过程可量化

和自动化构建工具区别

jenkins、travis 自动化构建工具比较成熟了，为什么还要自研脚手架？

- 不满足需求，jenkins、travis 通常在 git hooks 中触发,需要在服务器上执行，无法覆盖本地开发。
- 定制复杂，定制过程需要开发插件，过程较为复杂，需要使用 java, 对前端不太友好。

## 脚手架命令注册与参数解析

通过解析 process.env.argv 来实现。

## 3、脚手架核心流程开发

### 3-1、脚手架拆包策略

- 核心流程 core
  - 准备阶段
  - 命令注册
  - 命令执行
- 命令 commands
  - 初始化
  - 发布
  - 清除缓存
- 模型层 models
  - Command 命令
  - Project 项目
  - Component 组件
  - Npm 模块
  - Git 仓库
- utils
  - Git 操作
  - 云构建
  - 工具方法
  - API 请求
  - Git API


```
v init --debug test-project
```
