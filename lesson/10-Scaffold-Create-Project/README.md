# 脚手架创建项目流程开发

## 架构背后的思考

项目创建功能

- 可扩展：能够快速复用到不同团队，适应不同团队之间的差异
- 低成本：不改动脚手架源码的情况下，能够新增模版，且新增模版的成本很低
- 高性能：控制存储空间，安装时充分利用 Node 多进程提升安装性能

## 架构设计图

![](imgs/2022-07-21-22-37-17.png)
![](imgs/2022-07-21-22-37-56.png)
![](imgs/2022-07-21-22-38-10.png)


- egg + mongo 提供模版列表接口
- vue-element-admin

创建模版

模版目录

```
- template
  - 项目模板文件
- package.json
```

cli-spinners

## installTemplate


