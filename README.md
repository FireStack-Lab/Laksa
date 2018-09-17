# Laksa

![travis](https://travis-ci.com/FireStack-Lab/Laksa.svg?branch=master)
[![npm version](https://img.shields.io/npm/v/laksa.svg?style=flat-square)](https://www.npmjs.org/package/laksa)

[English README](./README.md)

[中文版说明](./docs/cn/index_cn.md)

Laksa is a developer tools that interigate with Zilliqa-BlockChain.

## Warning

This project is under developement and updated frequently, including `test scripts` and `dependencies`.

So it may change a lot before it's stable version is released.

`DO NOT` use it into your production envirorment.

## Why `Laksa` but not `Zilliqa-JS`?

- `Zilliqa-JS` is developed by Zilliqa Core Team. `Laksa` is developed by Zilliqa community.
- `Zilliqa-JS` is a basic library contained crypto algos, and basic utils.
- `Laksa` is a framework that provides more features than `Zilliqa-JS`.
- `Laska` is a "mono-repo" that devide the repo to multiple sub packages. Developers may customize their project using different packages on their demands.
- `Laksa` will grow as the community grows, not just `Javascript`, and more language support join the `Laksa` family.

## How to Use?

### In `NodeJS` or modern `WebApp`

```bash
npm install laksa
// or
yarn add laksa
```

### In HTML and for Browser

- First git clone this library.
- Then `yarn install && yarn dist`
- If the build process is finished and without failure, you can see 4 files in `{your project}/dist` folder.
- Paste the `laksa.browser.js` and `laksa.browser.js.map` into your html project.
- Then throw them into your html `<script />` tag.

```HTML
...
<script src="{your html project}/Laksa.browser.js"></script>
...
```

## API Reference

! Coming Soon !

## Examples

! Coming Soon !
