# 前端脚手架开发

## 目录

1. [需求和架构分析](docs/01-需求和架构分析.md)
2. [以架构师思维分析需求](docs/02-以架构师思维分析需求.md)
3. [yargs](docs/03-yargs.md)
4. [学习 lerna](docs/04-lerna.md)
5. [core 模块技术方案](./docs/08-core模块技术方案.md)
6. [学习 commander](./docs/09-commander.md)
7. [Nodejs 如何使用 ESM](./docs/10-Nodejs使用ESM.md)
8. [脚手架命令注册和执行过程开发](./docs/11-脚手架命令注册和执行过程开发.md)

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

脚手架本质是一个操作系统的客户端，通过命令行执行。实际上主要是由于 node 是客户端，编写的文件通过 node 去执行。

```
node vue.js
node -e "console.log('vue')"
```

```
vue create test --force
```

- 主命令
- command 子命令
- command 的 param: 参数
- option: 选项名 `--force` 或短写 `-f`, 选项值为 true

脚手架执行原理

1. 终端在环境变量中找到命令，即 which vue。
2. vue 是个软链接, 指向全局安装的 node_modules 里的 vue。
3. 使用 node 执行 vue.js
4. 执行完毕，退出

![](./imgs/2021-10-16-17-37-19.png)

npm i -g @vue/cli 时

- 安装，并根据 package.json 里 bin 配置在 node/bin 下创建软链接 vue -> vue.js
- 注意：如果当前目录下有 @vue/cli 目录，会在全局 node_modules 下创建该目录的一个软链接执行本地当前目录，如果不想这样，就离开该目录进行全局安装

执行 vue 命令时

- 环境变量中找 vue 命令，然后找到真实的 vue.js 文件
- `#!/usr/bin/env node`, 直接调用文件时系统会去环境变量 env 设置里找 node 命令，然后执行，即 node vue.js。注意这里不能写死，如`#!/usr/bin/node`，这个在其他人电脑上可能就有问题了。

```
ln -s xx/vue.js vue
```

本地调试脚手架

1. 在该目录的父级 npm i -g xx, 会创建该目录的软链接
2. 在该目录中, npm link 会创建 2 个软链接，一个 bin，一个 lib

脚手架分包本地调试

```
test-v-cli
test-v-lib
```

1. 首先在 test-v-lib 里 npm link 链接到全局
2. 在 test-v-cli package.json 里添加依赖 test-v-lib，然后 npm link test-v-lib, 会将全局的 test-v-lib 链接到本地 node_modules 下。

```
/Users/banli/Desktop/learn/engineering/cli/test-v-cli/node_modules/test-v-lib -> /Users/banli/.nvm/versions/node/v14.16.0/lib/node_modules/test-v-lib -> /Users/banli/Desktop/learn/engineering/cli/test-v-lib
```

也可以直接在 test-v-lib 里 npm link ../test-v-lib 包创建软链接。

```
/Users/banli/.nvm/versions/node/v14.16.0/lib/node_modules/test-v-lib -> /Users/banli/Desktop/learn/engineering/cli/test-v-lib
/Users/banli/Desktop/learn/engineering/cli/test-v-cli/node_modules/test-v-lib -> /Users/banli/.nvm/versions/node/v14.16.0/lib/node_modules/test-v-lib -> /Users/banli/Desktop/learn/engineering/cli/test-v-lib
```

npm link (directory)做了什么:

1. 会安装依赖
2. 会在 node 目录的 bin 目录下生成命令链接
3. 会在 node 目录的 lib 目录生产软连接

unlink 的流程：

1. 在 test-v-cli 中 npm unlink test-v-lib
2. 在 test-v-lib 中 npm unlink, 然后发布
3. 在 test-v-cli 中安装远程的 test-v-lib，然后发布

如果报错可以直接删除 node_modules 下的 test-v-lib。

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
