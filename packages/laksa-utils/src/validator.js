import * as validUrl from 'valid-url'
import * as BN from 'bn.js'

const { isBN } = BN
const { isWebUri } = validUrl
/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isNumber = (obj) => {
  return obj === +obj
}
// assign validator string
Object.assign(isNumber, { validator: 'Number' })

/**
 * [isString verify param is a String]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isString = (obj) => {
  return obj === `${obj}`
}
// assign validator string
Object.assign(isString, { validator: 'String' })

/**
 * [isBoolean verify param is a Boolean]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isBoolean = (obj) => {
  return obj === !!obj
}
// assign validator string
Object.assign(isBoolean, { validator: 'Boolean' })

/**
 * [isArray verify param input is an Array]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isArray = (obj) => {
  return Array.isArray(obj)
}
// assign validator string
Object.assign(isArray, { validator: 'Array' })

/**
 * [isJson verify param input is a Json]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isJson = (obj) => {
  try {
    return !!JSON.parse(obj)
  } catch (e) {
    return false
  }
}
// assign validator string
Object.assign(isJson, { validator: 'Json' })

/**
 * [isObject verify param is an Object]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
const isObject = (obj) => {
  return obj !== null && !Array.isArray(obj) && typeof obj === 'object'
}
// assign validator string
Object.assign(isObject, { validator: 'Object' })

/**
 * [isFunction verify param is a Function]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [description]
 */

const isFunction = (obj) => {
  return typeof obj === 'function'
}
// assign validator string
Object.assign(isFunction, { validator: 'Function' })

/**
 * verify if param is correct
 * @param  {[hex|string]}  address [description]
 * @return {Boolean}         [description]
 */
// const isAddress = (address) => {
//   return !!address.match(/^[0-9a-fA-F]{40}$/)
// }

const isAddress = (address) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true
  }
  // web3.js use checksumAddress
  // else {
  //     // Otherwise check each case
  //     return isChecksumAddress(address)
  // }
}
// assign validator string
Object.assign(isAddress, { validator: 'Address' })

/**
 * verify if privateKey is correct
 * @param  {[hex|string]}  privateKey [description]
 * @return {Boolean}            [description]
 */
const isPrivateKey = (privateKey) => {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(privateKey)) {
    // check if it has the basic requirements of an privatekey
    return false
  } else if (/^(0x)?[0-9a-f]{64}$/.test(privateKey) || /^(0x)?[0-9A-F]{64}$/.test(privateKey)) {
    // If it's all small caps or all all caps, return true
    return true
  }
  // return !!privateKey.match(/^[0-9a-fA-F]{64}$/)
}
// assign validator string
Object.assign(isPrivateKey, { validator: 'PrivateKey' })

/**
 * verify if public key is correct
 * @param  {[hex|string]}  pubkey [description]
 * @return {Boolean}        [description]
 */
const isPubkey = (pubkey) => {
  if (!/^(0x)?[0-9a-f]{66}$/i.test(pubkey)) {
    // check if it has the basic requirements of an pubkey
    return false
  } else if (/^(0x)?[0-9a-f]{66}$/.test(pubkey) || /^(0x)?[0-9A-F]{66}$/.test(pubkey)) {
    // If it's all small caps or all all caps, return true
    return true
  }
  // return !!pubkey.match(/^[0-9a-fA-F]{66}$/)
}
// assign validator string
Object.assign(isPubkey, { validator: 'PublicKey' })

/**
 * verify if url is correct
 * @param  {[string]}  url [description]
 * @return {Boolean}     [description]
 */
const isUrl = (url) => {
  return isWebUri(url)
}
// assign validator string
Object.assign(isUrl, { validator: 'Url' })

/**
 * verify if hash is correct
 * @param  {[string]}  txHash [description]
 * @return {Boolean}        [description]
 */
const isHash = (txHash) => {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(txHash)) {
    // check if it has the basic requirements of an txHash
    return false
  } else if (/^(0x)?[0-9a-f]{64}$/.test(txHash) || /^(0x)?[0-9A-F]{64}$/.test(txHash)) {
    // If it's all small caps or all all caps, return true
    return true
  }
  // return !!txHash.match(/^[0-9a-fA-F]{64}$/)
}
// assign validator string
Object.assign(isHash, { validator: 'Hash' })

// isBN
// imported
Object.assign(isBN, { validator: 'BN' })

/**
 * make sure each of the keys in requiredArgs is present in args
 * @param  {[type]} args         [description]
 * @param  {[type]} requiredArgs [description]
 * @param  {[type]} optionalArgs [description]
 * @return {[type]}              [description]
 */
function validateArgs(args, requiredArgs, optionalArgs) {
  for (const key in requiredArgs) {
    if (args[key] !== undefined) {
      for (let i = 0; i < requiredArgs[key].length; i += 1) {
        if (typeof requiredArgs[key][i] !== 'function') throw new Error('Validator is not a function')

        if (!requiredArgs[key][i](args[key])) {
          throw new Error(
            `Validation failed for ${key},should be ${requiredArgs[key][i].validator}`
          )
        }
      }
    } else throw new Error(`Key not found: ${key}`)
  }

  for (const key in optionalArgs) {
    if (args[key]) {
      for (let i = 0; i < optionalArgs[key].length; i += 1) {
        if (typeof optionalArgs[key][i] !== 'function') throw new Error('Validator is not a function')

        if (!optionalArgs[key][i](args[key])) {
          throw new Error(
            `Validation failed for ${key},should be ${optionalArgs[key][i].validator}`
          )
        }
      }
    }
  }
  return true
}

function validateFunctionArgs(ArgsArray, validatorArray) {
  const argLength = ArgsArray.length
  const valLength = validatorArray.length
  if (argLength < valLength) throw new Error('Some args are required by function but missing')
  for (let i = 0; i < valLength; i += 1) {
    if (!validatorArray[i](ArgsArray[i])) {
      throw new Error(
        `Validation failed for arguments[${i}], should be ${validatorArray[i].validator}`
      )
    }
  }
  return true
}

export {
  isNumber,
  isString,
  isBoolean,
  isArray,
  isJson,
  isObject,
  isFunction,
  isHash,
  isUrl,
  isPubkey,
  isPrivateKey,
  isAddress,
  isBN,
  validateArgs,
  validateFunctionArgs
}
