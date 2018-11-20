/**
 * intToHexArray
 *
 * @param {number} int - the number to be converted to hex
 * @param {number)} size - the desired width of the hex value. will pad.
 *
 * @returns {string[]}
 */
export const intToHexArray = (int, size) => {
  const hex = []
  const hexRep = []
  const hexVal = int.toString(16)

  // TODO: this really needs to be refactored.
  for (let i = 0; i < hexVal.length; i += 1) {
    hexRep[i] = hexVal[i].toString()
  }

  for (let i = 0; i < size - hexVal.length; i += 1) {
    hex.push('0')
  }

  for (let i = 0; i < hexVal.length; i += 1) {
    hex.push(hexRep[i])
  }

  return hex
}

/**
 * intToByteArray
 *
 * Converts a number to Uint8Array
 *
 * @param {number} num
 * @param {number} size
 *
 * @returns {Uint8Array}
 */
export const intToByteArray = (num, size) => {
  let x = num
  const res = []

  while (x > 0) {
    res.push(x & 255)
    x >>= 8
  }

  const pad = size - res.length

  for (let i = 0; i < pad; i += 1) {
    res.unshift(0)
  }

  return Uint8Array.from(res)
}

/**
 * hexToByteArray
 *
 * Convers a hex string to a Uint8Array
 *
 * @param {string} hex
 * @returns {Uint8Array}
 */
export const hexToByteArray = hex => {
  const res = new Uint8Array(hex.length / 2)

  for (let i = 0; i < hex.length; i += 2) {
    res[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }

  return res
}

/**
 * hexToIntArray
 *
 * @param {string} hex
 * @returns {number[]}
 */
export const hexToIntArray = hex => {
  if (!hex || !isHex(hex)) {
    return []
  }

  const res = []

  for (let i = 0; i < hex.length; i += 1) {
    const c = hex.charCodeAt(i)
    const hi = c >> 8
    const lo = c & 0xff

    if (hi) {
      res.push(hi, lo)
    }
    res.push(lo)
  }

  return res
}

/**
 * compareBytes
 *
 * A constant time HMAC comparison function.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export const isEqual = (a, b) => {
  const bzA = hexToIntArray(a)
  const bzB = hexToIntArray(b)

  if (bzA.length !== bzB.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < bzA.length; i += 1) {
    result |= bzA[i] ^ bzB[i]
  }

  return result === 0
}

/**
 * isHex
 *
 * @param {string} str - string to be tested
 * @returns {boolean}
 */
export const isHex = str => {
  const plain = str.replace('0x', '')
  return /[0-9a-f]*$/i.test(plain)
}
