import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import packages from '../packages'
import browserConfig from '../babel/babel.browser.config.js'
import { getKeys } from './getDependencies'

function bundles() {
  return packages.map(p => {
    const external = getKeys(p)
    const externalSetting = getKeys(p).length > 0 ? { external } : {}
    const normal = {
      input: `packages/${p}/src/index.js`,
      output: {
        file: `packages/${p}/lib/index.js`,
        format: 'cjs'
      },
      plugins: [babel(browserConfig), commonjs(), json()]
    }
    return Object.assign(normal, externalSetting)
  })
}

export default bundles()
