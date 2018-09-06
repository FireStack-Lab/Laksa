const gulp = require('gulp')
const del = require('del')

const packages = [
  'laksa-core-crypto',
  'laksa-request',
  'laksa-shared',
  'laksa-utils',
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
