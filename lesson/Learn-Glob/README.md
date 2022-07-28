# glob

[glob](https://www.npmjs.com/package/glob)

## 简介

glob 模式是使用通配符匹配文件。例如 Unix Bash shell 中使用 `rm -rf *.txt`。

## 语法

|  通配符 | 描述| 例子 | 匹配| 不匹配
|  ----  | ----  | ---- | ---- | ---- |
| `*`  | 匹配任意数量的任意字符，包括无| law*| law, laws 或 lawyer| GrokLaw, La 或 awk|
| `?`  | 匹配任何单个字符| ?at| cat, bat | at |
| `[abc]`  | 匹配括号中的一个字符 | [cb]at| cat 或 bat | at, cbat |
| `[^abc]`  | 匹配不在括号中的任何字符 | [^cb]at| aat | cat, bat |
| `[a-z]`  | 匹配括号中给定范围的一个字符| L[0-9]| L0, L1 最多 L9 | ls |
| `!(pattern|pattern|pattern)`  | 匹配与提供模式不匹配的任何内容|| | |
| `?(pattern|pattern|pattern)`  | 匹配与提供模式不匹配的任何内容|| | |
| `+(pattern|pattern|pattern)`  | 匹配与提供模式不匹配的任何内容|| | |
| `*(a|b|c)`  | 匹配所提供模式的零次或多次出现| `*(a|b|c)` | a, aa, ab, bc| ad |
| `@(pattern|pat*|pat?erN)`  | 完全匹配提供的模式之一|| | |
| `**`  | 匹配零个或多个目录以及子目录，不会爬取符号链接的目录|| | |

通常，永远不会匹配路径分割符(Linux 上的 /，或 Windows 上的 \)。


在 glob 表达式里都适用 `/`()，\ 会被作为转义。Win 也一样，`/foo/*` 匹配 `C:\foo\bar.txt`
