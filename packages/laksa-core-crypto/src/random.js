/**
 * @function randomBytes
 * @description Uses JS-native CSPRNG to generate a specified number of bytes.
 * NOTE: this method throws if no PRNG is available.
 * @param {Number} bytes bytes number to generate
 * @returns {String} ramdom hex string
 */
export const randomBytes = bytes => {
  let randBz

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    randBz = window.crypto.getRandomValues(new Uint8Array(bytes))
  } else if (typeof require !== 'undefined') {
    randBz = require('crypto').randomBytes(bytes)
  } else {
    throw new Error('Unable to generate safe random numbers.')
  }

  let randStr = ''
  for (let i = 0; i < bytes; i += 1) {
    randStr += `00${randBz[i].toString(16)}`.slice(-2)
  }

  return randStr
}
