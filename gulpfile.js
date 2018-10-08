const gulp = require('gulp')
const del = require('del')

const packages = [
  'laksa-core-crypto',
  'laksa-core-messenger',
  'laksa-core-contract',
  'laksa-core-methods',
  'laksa-core-properties',
  'laksa-extend-keystore',
  'laska-account',
  'laksa-providers-http',
  'laksa-shared',
  'laksa-utils',
  'laksa-wallet',
  'laksa-hd-wallet',
  'laksa-zil',
  'laksa-core',
  'laksa'
]

gulp.task('cleanBrowser', () => {
  packages.map((p) => {
    const pathToLib = `packages/${p}/lib`
    return del([pathToLib])
  })
})

gulp.task('cleanServer', () => {
  packages.map((p) => {
    const pathToLib = `packages/${p}/node`
    return del([pathToLib])
  })
})
