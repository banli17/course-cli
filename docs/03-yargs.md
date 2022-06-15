# 03-yargs

## what

yargs 是一个nodejs 包，用于解析命令行字符串。yargs 可以帮助你构建交互式命令行工具，通过解析参数和生成一个漂亮的交互界面。

## why

- 可以解析命令行选项
- 动态生成帮助菜单
- 完整的 bash 短命令
- 强大的 API

## how

1. 安装

```
npm i yargs
```

2. 简单使用

```js
#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

if (argv.ships > 3 && argv.distance < 53.5) {
  console.log('Plunder more riffiwobbles!')
} else {
  console.log('Retreat from the xupptumblers!')
}
```

```
$ ./plunder.js --ships=4 --distance=22
Plunder more riffiwobbles!

$ ./plunder.js --ships 12 --distance 98.7
Retreat from the xupptumblers!
```

## 完整使用

```js
#!/usr/bin/env node

const yargs = require('yargs')
const {hideBin} = require("yargs/helpers");
const dedent = require('dedent')
const arg = hideBin(process.argv) // 相当于 slice(2) -> ['--help', '--x']

const argv = process.argv.slice(2)

const pkg = require('../package.json')
const context = {
    cliVersion: pkg.version
}

const cli = yargs(arg)

cli
    .usage('Usage: v [command] <options>')
    // 输入错误时会提示最接近的命令
    // 最少要输入一个命令, 否则报错
    .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
    .strict() // 当输入不存在的参数时会提示 'Unknown arguments'
    // 如输入 v l 会提示 Did you mean ls?
    .recommendCommands()
    // 覆盖默认的错误处理函数, 默认的 fail 会打印帮助信息
    .fail((err, msg)=>{
        console.log('fail')
        console.log(err, msg)
    })
    .alias('h', 'help')
    .alias('v', 'version')
    .wrap(cli.terminalWidth()) // 一行占多长, cli.terminalWidth() 是整行长度
    // 结尾打印的文字
    .epilogue(dedent`
        When a command fails, all log are written to lerna-debug.log in the current working directory.
        For more infomation, find our manal at https://www.banli17.com
    `)
    // 定义参数
    .options({
        debug: {
            type: 'boolean',
            describe: 'Bootstrap debug mode',
            alias: 'd'
        }
    })
    .option('registry', {
        // hidden: true, // 隐藏属性, 不会打印
        type: 'string',
        describe: 'Define global registry',
        alias: 'r'
    })
    // 可以把参数进行分组，如 debug 放到 Dev Options: 组
    .group(['debug', 'registry'], 'Dev Options:')
    .command('init [name]', 'Do init a project', (yargs) => {
        // builder ， 在命令执行之前执行
        yargs.option('name', {
            type: 'string',
            describe: 'Name of a project',
            alias: 'n'
        })
    }, (argv) => {
        // hander
        // 命令执行函数
        // 执行命令 v init xx -d
        // 结果是： { _: [ 'init' ], d: true, debug: true, '$0': 'v', name: 'xx', n: 'xx' }
        console.log(argv) // argv 是一个 参数对象v
    })
    .command({
        command: 'list',
        aliases: ['ls', 'la', 'll'],
        describe: 'list something',
        builder: (yargs) => {

        },
        handler: (argv) => {
            console.log('list', argv)
        }
    })

    // .argv  // 会自动初始化命令, 自带 --help 和 --version
    .parse(argv, context) // 可以将 argv, context 合并变成为一个对象
    // v ls 时 list { _: [ 'ls' ], cliVersion: '0.0.1', '$0': 'v' }
```

## 附录

- [API文档](https://github.com/yargs/yargs/blob/HEAD/docs/api.md)