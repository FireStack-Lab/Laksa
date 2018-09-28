import numToBN from 'number-to-bn'
import utf8 from 'utf8'

import {
  isHex,
  isNull,
  isUndefined,
  isBN,
  isAddress,
  isBoolean,
  isObject,
  isString,
  isNumber,
  validateTypes
} from './generator'
/**
 * convert number to array representing the padded hex form
 * @param  {[string]} val        [description]
 * @param  {[number]} paddedSize [description]
 * @return {[string]}            [description]
 */
const intToByteArray = (val, paddedSize) => {
  const arr = []

  const hexVal = val.toString(16)
  const hexRep = []

  let i
  for (i = 0; i < hexVal.length; i += 1) {
    hexRep[i] = hexVal[i].toString()
  }

  for (i = 0; i < paddedSize - hexVal.length; i += 1) {
    arr.push('0')
  }

  for (i = 0; i < hexVal.length; i += 1) {
    arr.push(hexRep[i])
  }

  return arr
}

/**
 * Converts value to it's hex representation
 *
 * @method numberToHex
 * @param {String|Number|BN} value
 * @return {String}
 */
const numberToHex = (value) => {
  validateTypes(value, [isString, isNumber, isBN, isNull, isUndefined])
  if (isNull(value) || isUndefined(value)) {
    return value
  }

  if (!Number.isFinite(value) && !isHex(value) && !isBN(value) && !isString(value)) {
    throw new Error(`Given input "${value}" is not a number.`)
  }

  const number = isBN(value) ? value : toBN(value)
  const result = number.toString(16)

  return number.lt(toBN(0)) ? `-0x${result.substr(1)}` : `0x${result}`
}

const toUtf8 = () => {
  // to utf 8
}
const toAscii = () => {
  // to be implemented
}
const fromUtf8 = () => {
  // to be implemented
}
const fromAscii = () => {
  // to be implemented
}

const toBN = (data) => {
  try {
    return numToBN(data)
  } catch (e) {
    throw new Error(`${e} of "${data}"`)
  }
  // to be implemented
}
/**
 * Converts value to it's number representation
 *
 * @method hexToNumber
 * @param {String|Number|BN} value
 * @return {String}
 */
const hexToNumber = (value) => {
  validateTypes(value, [isNumber, isString, isHex, isBN, isUndefined])
  if (!value) {
    return value
  }
  return toBN(value).toNumber()
}

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method utf8ToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
const utf8ToHex = (str) => {
  validateTypes(str, [isAddress, isString, isHex])
  let hex = ''

  const newString = utf8.encode(str)

  const str1 = newString.replace(/^(?:\u0000)*/, '')
  const str2 = str1
    .split('')
    .reverse()
    .join('')
  const str3 = str2.replace(/^(?:\u0000)*/, '')
  const str4 = str3
    .split('')
    .reverse()
    .join('')

  for (let i = 0; i < str4.length; i += 1) {
    const code = str4.charCodeAt(i)
    // if (code !== 0) {
    const n = code.toString(16)
    hex += n.length < 2 ? `0${n}` : n
    // }
  }

  return `0x${hex}`
}

/**
 * Auto converts any given value into it's hex representation.
 *
 * And even stringifys objects before.
 *
 * @method toHex
 * @param {String|Number|BN|Object} value
 * @param {Boolean} returnType
 * @return {String}
 */
const toHex = (value, returnType) => {
  /* jshint maxcomplexity: false */
  validateTypes(value, [isAddress, isBoolean, isObject, isString, isNumber, isHex, isBN])
  if (isAddress(value)) {
    // strip 0x from address
    return returnType ? 'address' : `0x${value.toLowerCase().replace(/^0x/i, '')}`
  }

  if (isBoolean(value)) {
    return returnType ? 'bool' : value ? '0x01' : '0x00'
  }

  if (isObject(value) && !isBN(value)) {
    return returnType ? 'string' : utf8ToHex(JSON.stringify(value))
  }

  if (isBN(value)) {
    return returnType ? 'BN' : numberToHex(value)
  }
  // if its a negative number, pass it through numberToHex
  if (isString(value)) {
    if (isHex(value) || !Number.isNaN(Number(value))) {
      return returnType ? (value < 0 ? 'int256' : 'uint256') : numberToHex(value)
    } else if (!Number.isFinite(value) && !isUndefined(value) && Number.isNaN(Number(value))) {
      return returnType ? 'string' : add0x(value)
    }
  }

  return returnType ? (value < 0 ? 'int256' : 'uint256') : numberToHex(value)
}

const strip0x = (value) => {
  const newString = toHex(value)
  return `${newString.replace(/^0x/i, '')}`
}

/**
 * [add an '0x' prefix to value]
 * @param  {[String|Number|Hex|BN]} value [description]
 * @return {[String]}       [description]
 */
const add0x = (value) => {
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
 * Should be called to pad string to expected length
 *
 * @method padLeft
 * @param {String} string to be padded
 * @param {Number} characters that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
const padLeft = (string, chars, sign) => {
  return new Array(chars - string.length + 1).join(sign || '0') + string
}

/**
 * Should be called to pad string to expected length
 *
 * @method padRight
 * @param {String} string to be padded
 * @param {Number} characters that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
const padRight = (string, chars, sign) => {
  return string + new Array(chars - string.length + 1).join(sign || '0')
}

export {
  intToByteArray,
  toHex,
  toUtf8,
  toAscii,
  fromUtf8,
  fromAscii,
  toBN,
  hexToNumber,
  utf8ToHex,
  numberToHex,
  padLeft,
  padRight,
  strip0x,
  add0x
}
