const gulp = require('gulp')
const del = require('del')

const packages = [
  'laksa-core-crypto',
  'laksa-extend-keystore',
  'laksa-core-messenger',
  'laksa-core-contract',
  'laksa-core-provider',
  'laksa-core-transaction',
  'laksa-contracts',
  'laksa-providers-http',
  'laksa-shared',
  'laksa-utils',
  'laksa-account',
  'laksa-core-methods',
  'laksa-core-properties',
  'laksa-wallet',
  'laksa-hd-wallet',
  'laksa-zil',
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
