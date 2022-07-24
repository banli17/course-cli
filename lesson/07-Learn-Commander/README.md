# 学习commander

## 使用

最小示例

```js
const commander = require("commander");

// 是一个单例
commander.version(pkg.version).parse(process.argv);

// 也可以实例化
const program = new commander.Command();
program.version(pkg.version).parse(process.argv);
```

上面代码执行命令时只初始化了 -V 和 -h 参数。

## 注册命令

注册命令有下面两种方式。

### command 注册命令

```js
program
  .command("clone <source> [destination]")
  .option("-f, --force", "是否强制克隆")
  .action((source, destination, cmdObj) => {
    console.log(source, destination, cmdObj.force);
  });

program
  .command("pack")
  .description("打包并压缩")
  .addOption(
    new Option(
      "-p, --packages <package-name...>",
      `要打包并压缩的包,值为包名或目录名,多个使用空格分开`
    )
      .default(["all"])
      .choices([...pkgNames, "all"])
  )
  .addOption(
    new Option("-a, --author [author-name...]", "包的作者, 多个使用空格分开")
  )
  .action(run);
```

### addCommand 注册子命令

```js
const service = new commander.Command("service");
service.command("start [port]").action((port) => console.log("port", port));
// 这里命令不能连着链式写，要分开写
service.command("stop [port]").action((port) => console.log("port", port));
```

## program 命令数据结构

```js
{
	commands: [
		Command {
			_name: 'clone'
			commands: [],
			options: [
				Option {
					flags: '-f, --force',
					flags: '-f, --force',
					description: '是否强制克隆',
					required: false,
					optional: false,
					variadic: false,
					mandatory: false,
					short: '-f',
					long: '--force',
					negate: false,
					defaultValue: undefined,
					defaultValueDescription: undefined,
					presetArg: undefined,
					envVar: undefined,
					parseArg: undefined,
					hidden: false,
					argChoices: undefined,
					conflictsWith: [],
					implied: undefined
				}
			]
		},
		Command {
			_name: 'service',
			commands: [
				Command {
					_name: 'start'
				},
				Command {
					_name: 'stop'
				},
			]
		}
	]
}
```

## 选项

```js
.option('-e, --envName <envName>', '获取环境变量名称', 'dev')

// 或
.addOption(
    new Option(
      '-p, --packages <package-name...>',
      `要发布的包,值为包名或目录名,多个使用空格分开`
    )
      .default(['all'])
      .choices([...pkgNames, 'all'])
  )
```
