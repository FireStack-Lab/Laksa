import commonjs from 'rollup-plugin-commonjs'
import packages from '../packages'

function formatPackagesSettings() {
  return packages.map((p) => {
    return {
      input: `packages/${p}/lib/index.js`,
      output: {
        file: `packages/${p}/dist/bundle.js`,
        format: 'cjs'
      },
      plugins: [commonjs()]
    }
  })
}

export default formatPackagesSettings()
