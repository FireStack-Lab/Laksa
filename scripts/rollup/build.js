// import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'

// const envTypes = {
//   DEV: 'Developement',
//   PRO: 'Production',
//   TEST: 'Test'
// }
//
// const formatTypes = {
//   CJS: 'cjs',
//   UMD: 'umd',
//   AMD: 'amd',
//   ESM: 'esm'
// }
//
// const buildFiles = [
//   {
//     name: 'laksa',
//     env: envTypes.DEV,
//     format: formatTypes.CJS
//   },
//   {
//     name: 'laksa',
//     env: envTypes.DEV,
//     format: formatTypes.UMD
//   },
//   {
//     name: 'laksa',
//     env: envTypes.DEV,
//     format: formatTypes.AMD
//   },
//   {
//     name: 'laksa',
//     env: envTypes.DEV,
//     format: formatTypes.ESM
//   }
// ]

// function builds() {
//   const files = buildFiles.map((f) => {
//     return {
//       input: `packages/${f.name}/lib/index.js`,
//       output: {
//         file: `dist/${f.name}.${f.env}.${f.format}.js`,
//         format: `${f.format}`
//       },
//       plugins: [resolve()]
//     }
//   })
//   return files
// }

// function builds() {
//   return {
//     input: 'packages/laksa/src/index.js',
//     output: {
//       file: 'dist/laksa.Developement.cjs.js',
//       format: 'cjs'
//     },
//     plugins: [resolve()]
//   }
// }

export default {
  // input: 'packages/laksa-core/src/index.js',
  // output: {
  //   name: 'Laksa',
  //   file: 'dist/Laksa.browser.cjs.js',
  //   format: 'system'
  // }
  // plugins: [
  // resolve(),
  // {
  // pass custom options to the resolve plugin
  // customResolveOptions: {
  //   moduleDirectory: 'packages/laksa/node_modules'
  // }
  // }
  // commonjs()
  // ]
}
