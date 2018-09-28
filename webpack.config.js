// Copyright (c) 2018 Zilliqa
// This source code is being disclosed to you solely for the purpose of your participation in
// testing Zilliqa. You may view, compile and run the code for that purpose and pursuant to
// the protocols and algorithms that are programmed into, and intended by, the code. You may
// not do anything else with the code without express permission from Zilliqa Research Pte. Ltd.,
// including modifying or publishing the code (or any part of it), and developing or forming
// another public or private blockchain network. This source code is provided ‘as is’ and no
// warranties are given as to title or non-infringement, merchantability or fitness for purpose
// and, to the extent permitted by law, all liability for your use of the code is disclaimed.
// Base webpack configuration - to be used in ALL environments.
/* eslint import/no-extraneous-dependencies: ["error", { devDependencies: true }] */
const path = require('path')
const UglifyJs = require('uglifyjs-webpack-plugin')
const packagesSettings = require('./scripts/packagesList')

function createBatchConfig(list) {
  return list.map((l) => {
    const entryBase = {}
    entryBase[l.name] = [`./packages/${l.dest}/index.js`]

    const batchBaseConfig = {
      entry: entryBase,
      mode: 'production',
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader'
            }
          }
        ]
      },
      devtool: 'source-map',
      resolve: {
        symlinks: true,
        extensions: ['.js']
      }
    }

    const batchClientConfig = {
      ...batchBaseConfig,
      optimization: {
        minimizer: [
          new UglifyJs({
            uglifyOptions: {
              compress: true,
              mangle: true,
              toplevel: false,
              output: {
                beautify: false,
                comments: false
              }
            },
            parallel: true,
            sourceMap: true
          })
        ]
      },
      output: {
        libraryTarget: 'umd',
        library: `${l.name}`,
        filename: '[name].browser.js',
        path: path.join(__dirname, 'dist')
      }
    }

    return [batchBaseConfig, batchClientConfig]
  })
}

function reduceDimension(arr) {
  return Array.prototype.concat.apply([], arr)
}

const batch = reduceDimension(createBatchConfig(packagesSettings))

module.exports = batch

// const baseConfig = {
//   entry: {
//     Laksa: ['./packages/laksa/index.js']
//   },
//   mode: 'production',
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         use: {
//           loader: 'babel-loader'
//           // options: {
//           //   babelrc: true,
//           //   cacheDirectory: true
//           // }
//         }
//       }
//     ]
//   },
//   devtool: 'source-map',
//   resolve: {
//     symlinks: true,
//     extensions: ['.js']
//   }
// }
//
// const clientConfig = {
//   ...baseConfig,
//   optimization: {
//     minimizer: [
//       new UglifyJs({
//         uglifyOptions: {
//           compress: true,
//           mangle: true,
//           toplevel: false,
//           output: {
//             beautify: false,
//             comments: false
//           }
//         },
//         parallel: true,
//         sourceMap: true
//       })
//     ]
//   },
//   output: {
//     libraryTarget: 'umd',
//     library: 'laksa.js',
//     filename: '[name].browser.js',
//     path: path.join(__dirname, 'dist')
//   }
// }
//
// module.exports = [baseConfig, clientConfig]
