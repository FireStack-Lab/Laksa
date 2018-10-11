module.exports =
  typeof window === 'undefined' ? require('./node/index.js') : require('./lib/index.js')
