# 通用脚手架命令 Command 类

## 脚手架参数初始化

## Node 多进程动态执行命令

## windows 操作系统 spawn 命令兼容

windows 系统上需要使用 cmd 命令进行执行。

```sh
# -c 表示静默执行
cmd -c node -e nodecode
```

封装 spawn 方法如下：

```js
const cp = require('child-process')

function spawn(command, args, options = {}) {
  const win32 = process.platform === 'win32'
  const cmd = win32 ? 'cmd' : command
  const cmdArgs = win32 ? ['-c'].concat(command, args) : args
  return cp.spawn(cmd, cmdArgs, options)
}
```

