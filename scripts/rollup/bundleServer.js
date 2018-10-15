import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import packages from '../packages'
import serverConfig from '../babel/babel.server.config.js'
import { getKeys } from './getDependencies'

function bundles() {
  return packages.map(p => {
    const external = getKeys(p)
    const externalSetting = getKeys(p).length > 0 ? { external } : {}
    const normal = {
      input: `packages/${p}/src/index.js`,
      output: {
        file: `packages/${p}/node/index.js`,
        format: 'umd',
        name: 'Laksa'
      },
      plugins: [babel(serverConfig), json()]
    }
    return Object.assign(normal, externalSetting)
  })
}

export default bundles()
