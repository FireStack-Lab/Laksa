# 开始

当前, `Laksa` 是一个 Web 开发工具包, 主要支持 `Node.js` 以及 `现代浏览器`。

你可以轻松的在 `node.js`环境下运行`Laksa`

或者，在你的 WebApp 应用，使用如`React`,`Vue` ,`Angular`或者其他任何现代 WebApp 技术，进行二次开发。只要是`javascript`的运行环境

- 对于 `React-native` 以及 `vue-native` 爱好者, 我们还需要对开发库进行升级，请给予耐心和支持，我们会在日后版本针对 hybrid 环境做新的版本

## 准备开发环境

1. 请确保 `nodejs` 版本 >= 8.0.0,
2. 请确保已经将 `npm` 升级至最新版本
3. 我们推荐使用 `yarn` 替代 `npm`

```bash
$bash > brew install nodejs # 安装nodejs(Mac用户)，对于Windows用户，你也可以去官网下载
$bash > node -v # 检查nodejs版本
v10.5.0 # 我们推荐v10+的稳定版本
...
$bash > npm i -g npm@latest # 安装 最新版本npm
$bash > npm -v # 检查npm版本
6.4.1 # 建议使用最新版本的npm
...
$bash > npm i -g yarn@latest # 安装最新版本yarn
$bash > yarn -v # 检查yarn版本
1.9.4 # 我们推荐使用最新版本的yarn
```

## 安装

我们使用`Lerna.js`去管理`Laksa`的依赖包，只要你运行安装脚本，一系列的包都会自动从`npm`或者`yarn`上安装到你的项目当中。你可以在 `node_modules`里面看到这些依赖包，长得像这样:`laksa-<foo>-<bar>-<baz>`

然而，传统上，许多 WEb 开发者习惯在 html 上加载 javascript，就像`jquery`或者`bootstrap`一样，在`<script />`标签中引入相应的 js。所以我们还提供了其他的应用方式来使用`Laksa`，这部分内容在文档中会单独作为解释。

### 为 Node.js 和 WebApp 安装

`npm`

```bash
$bash > npm i -S laksa # 使用npm安装laksa
$bash > npm i -S laksa@0.0.39 # 你可以安装指定的版本
$bash > npm i -S laksa@latest # 你可以安装最新的版本
```

`yarn`

```bash
$bash > yarn add laksa # 使用yarn 安装laksa
$bash > yarn add laksa@0.0.39 # 你可以安装指定的版本
$bash > yarn add laksa@latest # 你可以安装最新的版本
```

更详细的 `npm` 指令, 请阅读:[npm docs](https://docs.npmjs.com/)

更详细的 `yarn` 指令, 请阅读:[yarn 文档](https://yarnpkg.com/zh-Hans/docs)

### 手动为 HTML/Browser 构建可运行版本

如果你觉得以下步骤太麻烦，可以等我们的发布版本。到时候，你可以直接下载或者直接在 CDN 路径中引用

1. 请先确保所有环境都已经安装好，包括：npm/yarn 和 nodejs, 我们需要手动构建之后，才能在 `HTML/script`之中使用

2. 在安装好环境之后，你可以输入以下命令执行.

```bash
$bash > git clone https://github.com/FireStack-Lab/Laksa.git && cd Laksa && yarn install && yarn build
```

3. 当所有命令执行完毕，并且没有出现错误提示的话，会在项目路径的`/dist`下面找到 四个文件，分别是

> `laksa.js` `laksa.js.map` `laksa.browser.js` `laksa.browser.js.map`

4. 复制`laksa.browser.js` 和 `laksa.browser.js.map` ，粘贴到你的 html 项目路径中, 并在 `<script />` 标签内引用他。

```HTML
...
<script src="{your html project}/Laksa.browser.js"></script>
...
```

### 在发布页下载并使用最新发布版本.

目前暂无，请关注我们

### 在 CDN 路径中使用最新发布版本.

目前暂无，请关注我们
