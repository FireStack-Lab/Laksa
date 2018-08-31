import { isString, isNumber, validateFunctionArgs } from './validator'
/**
 * convert number to array representing the padded hex form
 * @param  {[string]} val        [description]
 * @param  {[number]} paddedSize [description]
 * @return {[string]}            [description]
 */
const intToByteArray = (val, paddedSize) => {
  validateFunctionArgs([val, paddedSize], [isString, isNumber])
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

const toHex = () => {
  // to be implemented
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
const toBN = () => {
  // to be implemented
}
const toNumber = () => {
  // to be implemented
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
  validateFunctionArgs([string, chars], [isString, isNumber])
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
  validateFunctionArgs([string, chars], [isString, isNumber])
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
  toNumber,
  padLeft,
  padRight
}
