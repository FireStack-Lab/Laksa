const { task } = require('gulp')
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

task('cleanBrowser', async () => {
  await packages.map(p => {
    const pathToLib = `packages/${p}/lib`
    return del.sync([pathToLib])
  })
})

task('cleanServer', async () => {
  await packages.map(p => {
    const pathToLib = `packages/${p}/node`
    return del.sync([pathToLib])
  })
})

task('cleanDocs', async () => {
  await packages.map(p => {
    const pathToLib = `packages/${p}/doc`
    return del.sync([pathToLib])
  })
})
