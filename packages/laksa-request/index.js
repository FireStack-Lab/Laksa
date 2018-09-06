const node = require('./node/index.js')
const browser = require('./lib/index.js')

if (typeof window === 'undefined') {
  module.exports = node
} else {
  module.exports = browser
}
