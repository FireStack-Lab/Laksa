import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import packages from './packages'

function formatPackagesSettings() {
  return packages.map((p) => {
    return {
      input: `packages/${p}/src/index.js`,
      output: {
        file: `packages/${p}/lib/bundle.js`,
        format: 'cjs'
      },
      plugins: [
        resolve({ preferBuiltins: false }),
        babel({
          plugins: [
            [
              'transform-class-properties',
              {
                spec: true
              }
            ],
            'add-module-exports'
          ],
          exclude: '**/node_modules/**'
        }),
        commonjs()
      ]
    }
  })
}

export default formatPackagesSettings()
