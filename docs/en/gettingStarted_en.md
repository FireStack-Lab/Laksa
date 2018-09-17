# Getting Started

Currently, `Laksa` is a javascript repository for web development, supported for `Node.js` and `Browser`.

You can easlily run `Laksa` in your `Node.js`.
Or, in your SPA WebApp,using `React`,`Vue` ,`Angular`,or any other modern WebApp Technology. As long as it is a javascript Envirorment.

- For `React-native` and `vue-native` user, we have to use another repo, please be patient. we will upgrade new `hybrid` version for those lovers.

## Preparation for dev env, < Required! >

1. make sure that you have `nodejs` version >= 8.0.0
2. make sure you have upgrade `npm` to latest version
3. we suggest you use `yarn` instead of `npm`

```bash
$bash > brew install nodejs # Install nodejs(Mac only)，for Windows user you can download it from nodejs website
$bash > node -v # check nodejs version
v10.5.0 # we recommend you use v10.0.0 stable version
...
$bash > npm i -g npm@latest # Install latest version of npm
$bash > npm -v # Check npm version
6.4.1 # you should use latest npm
...
$bash > npm i -g yarn@latest # Install latest version of yarn
$bash > yarn -v # Check yarn version
1.9.4 # you should use latest yarn
```

## Install

We use `Lerna.js` to manage `Laksa`'s packages, as long as run the install script, multiple packages will be install from `npm` or `yarn`. You can see those packages in your `node_modules`
folder. The packages will be look like `laksa-<foo>-<bar>-<baz>`。

But tranditionally, many web developers use javascript library in their html, like `jquery` or `bootstrap` commonly used, inside `<script />` tag. So we provide other way to use `Laksa`, which will describe in later part of this document.

### Install For Node.js and WebApp

`npm`

```bash
$bash > npm i -S laksa #install laksa from npm
$bash > npm i -S laksa@0.0.39 # you can install specific version
$bash > npm i -S laksa@latest # you can install the latest version
```

`yarn`

```bash
$bash > yarn add laksa #install laksa from yarn
$bash > yarn add laksa@0.0.39 # you can install specific version
$bash > yarn add laksa@latest # you can install the latest version
```

For more `npm` commands, please refer to:[npm docs](https://docs.npmjs.com/)

For more `yarn` commands, please refer to:[yarn docs](https://yarnpkg.com/en/docs/)

### Manually Build For HTML/Browser

If you find it hard, please wait for our release version later. You may download the production version or use directly in CDN.

1. Make sure npm/yarn and nodejs is install correctly, we have to build it manually before we use it in `HTML/script`

2. After you've install all requred env, run the following commands in your command-line

```bash
$bash > git clone https://github.com/FireStack-Lab/Laksa.git && cd Laksa && yarn install && yarn build
```

3. After all install scripts are executed and finished without Error. You can find 4 files in the `/dist` folder, which are:

> `laksa.js` `laksa.js.map` `laksa.browser.js` `laksa.browser.js.map`

4. Copy and paste the `laksa.browser.js` and `laksa.browser.js.map` to your html project folder, and use it in your `<script />` tag

```HTML
...
<script src="{your html project}/Laksa.browser.js"></script>
...
```

### Download `release` version from release page.

We don't have it yet. please follow us

### Use `release` version from CDN.

We don't have it yet. please follow us
