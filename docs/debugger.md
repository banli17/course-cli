# 命令开发调试方法

## 方式一: console 打印

1. 在需要调试处打印 console.log。
2. 在项目下 npm link。
3. 在命令行运行命令。

## 方式二: debugger

1. 进入调试界面，创建 launch.json 文件。

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}\\bin\\create-thingjs-app", // 配置调试入口文件
            "console": "integratedTerminal", // 用于调试交互式命令
            "outFiles": [
                "${workspaceFolder}/dist/**/*.js"
            ]
        }
    ]
}
```

2. 在源代码中, 点击行号前空白处打断点。
3. 点击运行和调试按钮(或F5) 开始调试。
4. 点击调试菜单，可以看到左侧调试信息。
