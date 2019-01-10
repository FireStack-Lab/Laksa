import BN from 'bn.js'
import Long from 'long'

import {
  isHex, isBN, isString, isNumber, validateTypes
} from './generator'

const toBN = data => {
  try {
    return new BN(data)
  } catch (e) {
    throw new Error(`${e} of "${data}"`)
  }
  // to be implemented
}

const toLong = data => {
  try {
    if (isString(data)) {
      return Long.fromString(data)
    } else if (isNumber(data)) {
      return Long.fromNumber(data)
    }
  } catch (e) {
    throw new Error(`${e} of "${data}"`)
  }
  // to be implemented
}

const strip0x = value => {
  return `${value.replace(/^0x/i, '')}`
}

/**
 * [add an '0x' prefix to value]
 * @param  {String|Number|Hex|BN} value [description]
 * @return {String}       [description]
 */
const add0x = value => {
  validateTypes(value, [isString, isNumber, isHex, isBN])
  let newString
  if (!isString(value)) {
    newString = String(value)
    return `0x${newString.replace(/^0x/i, '')}`
  }
  newString = `0x${value.replace(/^0x/i, '')}`
  return newString
}

/**
 * pack
 *
 * Takes two 16-bit integers and combines them. Used to compute version.
 *
 * @param {number} a
 * @param {number} b
 *
 * @returns {number} - a 32-bit number
 */
const pack = (a, b) => {
  if (!isNumber(a) || !isNumber(b)) {
    throw new Error('a and b must be number')
  }
  if (a >> 16 > 0 || b >> 16 > 0) {
    throw new Error('Both a and b must be 16 bits or less')
  }

  return (a << 16) + b
}

export {
  toBN, toLong, strip0x, add0x, pack
}
