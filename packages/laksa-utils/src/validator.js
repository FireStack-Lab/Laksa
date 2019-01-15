import { isWebUri } from 'valid-url'
import { isBN } from 'bn.js'
import Long from 'long'

const { isLong } = Long

/**
 * [isNumber verify param is a Number]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isNumber = obj => {
  return obj === +obj
}

/**
 * [isNumber verify param is a Number]
 * @param  {type}  obj [value]
 * @return {boolean}     [boolean]
 */
const isInt = obj => {
  return isNumber(obj) && Number.isInteger(obj)
}

/**
 * [isString verify param is a String]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isString = obj => {
  return obj === `${obj}`
}

/**
 * [isBoolean verify param is a Boolean]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isBoolean = obj => {
  return obj === !!obj
}

/**
 * [isArray verify param input is an Array]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isArray = obj => {
  return Array.isArray(obj)
}

/**
 * [isJson verify param input is a Json]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isJsonString = obj => {
  try {
    return !!JSON.parse(obj) && isObject(JSON.parse(obj))
  } catch (e) {
    return false
  }
}

/**
 * [isObject verify param is an Object]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isObject = obj => {
  return obj !== null && !Array.isArray(obj) && typeof obj === 'object'
}

/**
 * [isFunction verify param is a Function]
 * @param  {type}  obj [value]
 * @return {Boolean}     [description]
 */

const isFunction = obj => {
  return typeof obj === 'function'
}

/**
 * verify if param is correct
 * @param  {hex|string}  address [description]
 * @return {Boolean}         [description]
 */

const isAddress = address => {
  return isByteString(address, 40)
}

const isPrivateKey = privateKey => {
  return isByteString(privateKey, 64)
}

const isPubkey = pubKey => {
  return isByteString(pubKey, 66)
}

const isSignature = sig => {
  return isByteString(sig, 128)
}

const isByteString = (str, len) => {
  if (!isString(str)) return false
  return !!str.replace('0x', '').match(`^[0-9a-fA-F]{${len}}$`)
}

/**
 * verify if url is correct
 * @param  {string}  url [description]
 * @return {Boolean}     [description]
 */
const isUrl = url => {
  if (isString(url)) {
    return !!isWebUri(url)
  }
  return false
}

/**
 * verify if hash is correct
 * @param  {string}  txHash [description]
 * @return {Boolean}        [description]
 */
const isHash = txHash => {
  return /^[0-9a-fA-F]{64}$/.test(txHash)
}

/**
 * Check if string is HEX
 *
 * @method isHex
 * @param {String} hex to be checked
 * @returns {Boolean}
 */
const isHex = hex => {
  return (isString(hex) || isNumber(hex)) && /^0x?[0-9a-f]*$/i.test(hex)
}

/**
 * check Object isNull
 * @param  {type}  obj [description]
 * @return {Boolean}     [description]
 */
const isNull = obj => {
  return obj === null
}

/**
 * check object is undefined
 * @param  {type}  obj [description]
 * @return {Boolean}     [description]
 */
const isUndefined = obj => {
  return obj === undefined
}

/**
 * check object is undefined
 * @param  {type}  obj [description]
 * @return {Boolean}     [description]
 */
const isUint = obj => {
  return isInt(obj) && obj >= 0
}

/**
 * [isByStrX description]
 * @param  {type}  obj [description]
 * @return {Boolean}     [description]
 */
const isByStrX = obj => {
  return /^0x[A-F0-9]{20,65}$/i.test(obj)
}

export {
  isNumber,
  isInt,
  isString,
  isBoolean,
  isArray,
  isJsonString,
  isObject,
  isUint,
  isFunction,
  isHash,
  isUrl,
  isPubkey,
  isPrivateKey,
  isSignature,
  isAddress,
  isBN,
  isLong,
  isHex,
  isByStrX,
  isNull,
  isUndefined
}
