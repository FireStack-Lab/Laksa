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

export {
  toBN, toLong, strip0x, add0x
}
