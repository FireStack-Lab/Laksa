# Laksa

![travis](https://travis-ci.com/FireStack-Lab/Laksa.svg?branch=master)
[![npm version](https://img.shields.io/npm/v/laksa.svg?style=flat-square)](https://www.npmjs.org/package/laksa)

Laksa 是一个开发工具包，让开发者快速连接 Zilliqa-BlockChain

## 注意事项

本项目在不停的进行迭代和更新，包括测试用例，开发依赖以及工具可用性

项目在发布稳步版本前会经常发生改变，因此会含有出现不可预见的 BUG。

非常`不建议`在生产环境中使用

## 为什叫 `Laksa` 不叫 `Zilliqa-JS`?

- `Zilliqa-JS` 由 Zilliqa 核心团队开发. `Laksa` 由社区开发者开发。
- `Zilliqa-JS` 是一个包含了加密算法和基础工具的基础库。
- `Laksa` 是一个开发框架，在 `Zilliqa-JS`基础上进行扩展
- `Laska` 基于 "mono-repo" 进行库的设计，将主库分割成不同的子包（sub packages）。开发者可根据项目所需，自定义加载不同的包。
- `Laksa` 随着开发者社区成长而壮大，不仅限于 `Javascript`，日后将有更多的语言版本加入`Laksa` 家族.

## 如何使用?

### 在 `NodeJS` 或现代的 `WebApp`中使用

```bash
npm install laksa
// 或者使用yarn
yarn add laksa
```

### 在浏览器通过 HTML 加载

- 第一步 git clone 这个库.
- 安装依赖并构建 `yarn install && yarn dist`
- 如果构建过程顺利完成没有失败, 在 `{项目目录}/dist` 文件夹中将会看到 4 个文件.
- 把 `laksa.browser.js` 以及 `laksa.browser.js.map` 复制粘贴到你的 HTML 的项目中（一般放在 js 的文件夹里）.
- 在 HTML 的 `<script />` 进行引用，像下面这样.

```HTML
...
<script src="{your html project}/Laksa.browser.js"></script>
...
```

## API 索引以及文档

! 正在撰写 !

## 开发例子

! 正在撰写 !
