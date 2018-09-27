import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import packages from '../packages'
import serverConfig from '../babel/babel.server.config.js'

function bundles() {
  return packages.map((p) => {
    return {
      input: `packages/${p}/src/index.js`,
      output: {
        file: `packages/${p}/node/index.js`,
        format: 'umd',
        name: 'Laksa'
      },
      plugins: [babel(serverConfig), json()]
    }
  })
}

export default bundles()
