const gulp = require('gulp')
const del = require('del')

const packages = [
  'laksa-extend-keystore',
  'laksa-core-crypto',
  'laksa-core-messenger',
  'laksa-core-contract',
  'laksa-core-transaction',
  'laksa-core-provider',
  'laksa-account',
  'laksa-providers-http',
  'laksa-shared',
  'laksa-utils',
  'laksa-wallet',
  'laksa-blockchain',
  'laksa-core',
  'laksa'
]

gulp.task('cleanBrowser', () => {
  packages.map(p => {
    const pathToLib = `packages/${p}/lib`
    return del([pathToLib])
  })
})

gulp.task('cleanServer', () => {
  packages.map(p => {
    const pathToLib = `packages/${p}/node`
    return del([pathToLib])
  })
})
