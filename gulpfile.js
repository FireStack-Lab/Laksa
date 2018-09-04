// const path = require('path')
// const cp = require('child_process')
const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')
const rollup = require('rollup')
const commonjs = require('rollup-plugin-commonjs')

// const { exec } = cp
const packages = [
  'laksa-core-crypto',
  'laksa-request',
  'laksa-shared',
  'laksa-utils',
  'laksa-zil',
  'laksa-core',
  'laksa'
]

const babelConfig = {
  babelrc: false,
  // runtimeHelpers: true,
  presets: ['@babel/preset-env'],
  plugins: [
    // '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    'add-module-exports'
  ],
  exclude: 'packages/**/node_modules/**'
}

gulp.task('babel', () => {
  packages.map((p) => {
    // const pathToRoot = path.resolve(__dirname)
    const pathToSrc = `packages/${p}/src/*.js`
    const pathToDes = `packages/${p}/lib`
    return gulp
      .src(pathToSrc)
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(pathToDes))
  })
})

// gulp.task('rollup', (cb) => {
//   // 构建 Jekyll
//   exec('npm run packages:rollup', (err) => {
//     if (err) return cb(err) // return error
//     cb() // 完成 task
//   })
// })

gulp.task('clean', () => {
  packages.map((p) => {
    // const pathToRoot = path.resolve(__dirname)
    const pathToDist = `packages/${p}/dist`
    const pathToLib = `packages/${p}/lib`
    return del([pathToDist, pathToLib])
  })
})

gulp.task('lib', ['clean', 'babel'])
