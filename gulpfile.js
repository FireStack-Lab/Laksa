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

gulp.task('clean', () => {
  packages.map((p) => {
    const pathToDist = `packages/${p}/dist`
    const pathToLib = `packages/${p}/lib`
    return del([pathToDist, pathToLib])
  })
})
