import { isWebUri } from 'valid-url'
import { isBN } from 'bn.js'

/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isNumber = obj => {
  return obj === +obj
}

/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isInt = obj => {
  return isNumber(obj) && Number.isInteger(obj)
}

/**
 * [isString verify param is a String]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isString = obj => {
  return obj === `${obj}`
}

/**
 * [isBoolean verify param is a Boolean]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isBoolean = obj => {
  return obj === !!obj
}

/**
 * [isArray verify param input is an Array]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isArray = obj => {
  return Array.isArray(obj)
}

/**
 * [isJson verify param input is a Json]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isJson = obj => {
  try {
    return !!JSON.parse(obj) && isObject(JSON.parse(obj))
  } catch (e) {
    return false
  }
}

/**
 * [isObject verify param is an Object]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isObject = obj => {
  return obj !== null && !Array.isArray(obj) && typeof obj === 'object'
}

/**
 * [isFunction verify param is a Function]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [description]
 */

const isFunction = obj => {
  return typeof obj === 'function'
}

/**
 * verify if param is correct
 * @param  {[hex|string]}  address [description]
 * @return {Boolean}         [description]
 */
// const isAddress = (address) => {
//   return !!address.match(/^[0-9a-fA-F]{40}$/)
// }

const isAddress = address => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true
  }
  return false
}

/**
 * verify if privateKey is correct
 * @param  {[hex|string]}  privateKey [description]
 * @return {Boolean}            [description]
 */
const isPrivateKey = privateKey => {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(privateKey)) {
    // check if it has the basic requirements of an privatekey
    return false
  } else if (/^(0x)?[0-9a-f]{64}$/.test(privateKey) || /^(0x)?[0-9A-F]{64}$/.test(privateKey)) {
    // If it's all small caps or all all caps, return true
    return true
  }
  // return !!privateKey.match(/^[0-9a-fA-F]{64}$/)
}

/**
 * verify if public key is correct
 * @param  {[hex|string]}  pubkey [description]
 * @return {Boolean}        [description]
 */
const isPubkey = pubkey => {
  if (!/^(0x)?[0-9a-f]{66}$/i.test(pubkey)) {
    // check if it has the basic requirements of an pubkey
    return false
  } else if (/^(0x)?[0-9a-f]{66}$/.test(pubkey) || /^(0x)?[0-9A-F]{66}$/.test(pubkey)) {
    // If it's all small caps or all all caps, return true
    return true
  }
  // return !!pubkey.match(/^[0-9a-fA-F]{66}$/)
}

/**
 * verify if url is correct
 * @param  {[string]}  url [description]
 * @return {Boolean}     [description]
 */
const isUrl = url => {
  if (typeof url === 'string') {
    return isWebUri(url)
  }
  return false
}

/**
 * verify if hash is correct
 * @param  {[string]}  txHash [description]
 * @return {Boolean}        [description]
 */
const isHash = txHash => {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(txHash)) {
    // check if it has the basic requirements of an txHash
    return false
  } else if (/^(0x)?[0-9a-f]{64}$/.test(txHash) || /^(0x)?[0-9A-F]{64}$/.test(txHash)) {
    // If it's all small caps or all all caps, return true
    return true
  }
  // return !!txHash.match(/^[0-9a-fA-F]{64}$/)
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
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
const isNull = obj => {
  return obj === null
}

/**
 * check object is undefined
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
const isUndefined = obj => {
  return obj === undefined
}

/**
 * check object is undefined
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
const isUnit = obj => {
  return isInt(obj) && obj >= 0
}

/**
 * [isByStrX description]
 * @param  {[type]}  obj [description]
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
  isJson,
  isObject,
  isUnit,
  isFunction,
  isHash,
  isUrl,
  isPubkey,
  isPrivateKey,
  isAddress,
  isBN,
  isHex,
  isByStrX,
  isNull,
  isUndefined
}
