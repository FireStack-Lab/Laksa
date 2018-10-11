import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import packages from '../packages'
import browserConfig from '../babel/babel.browser.config.js'

function bundles() {
  return packages.map(p => {
    return {
      input: `packages/${p}/src/index.js`,
      output: {
        file: `packages/${p}/lib/index.js`,
        format: 'cjs'
      },
      plugins: [babel(browserConfig), commonjs(), json()]
    }
  })
}

export default bundles()
