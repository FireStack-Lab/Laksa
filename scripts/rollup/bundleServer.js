import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import packages from '../packages'
import serverConfig from '../babel/babel.server.config.js'

function bundles() {
  return packages.map((p) => {
    return {
      input: `packages/${p}/src/index.js`,
      output: {
        file: `packages/${p}/node/index.js`,
        format: 'cjs'
      },
      plugins: [babel(serverConfig), commonjs()]
    }
  })
}

export default bundles()
