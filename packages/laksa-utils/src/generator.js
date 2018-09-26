import * as validators from './validator'

function objToArray(obj) {
  const keys = Object.keys(obj)
  const values = Object.values(obj)
  const newArray = keys.map((k, index) => {
    const Obj = {}
    Obj[k] = values[index]
    return Obj
  })
  return newArray
}

function injectValidator(func) {
  if (typeof func === 'object' && func !== undefined) {
    const valName = Object.keys(func)[0]
    const valFunc = Object.values(func)[0]
    return Object.assign(valFunc, {
      validator: valName,
      test: obj => valFunc(obj)
    })
  } else return false
}

function extractValidator(vals) {
  const newValidator = []
  const newArr = objToArray(vals)
  newArr.forEach((v, index) => {
    const newV = injectValidator(v)
    const validatorString = newV.validator
    newValidator[validatorString] = newV
    newValidator[index] = newV
  })
  return newValidator
}

const valArray = extractValidator(validators)
const {
  isNumber,
  isInt,
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
  isHex,
  isNull,
  isUndefined
} = valArray

/**
 * [Validator description]
 * @param       {[type]} stringToTest    [description]
 * @param       {[type]} validatorString [description]
 * @constructor
 */
function Validator(stringToTest, validatorString) {
  if (typeof validatorString === 'string' && valArray[`is${validatorString}`] !== undefined) {
    return valArray[`is${validatorString}`].test(stringToTest)
  } else if (typeof validatorString === 'function') {
    return validatorString(stringToTest)
  } else {
    throw new Error(`validator not found :${validatorString}`)
  }
}

function tester(value, callback) {
  try {
    const validateResult = valArray
      .map((func) => {
        return func.test(value) ? func.validator.substring(2) : false
      })
      .filter(d => d !== false)
    return callback === undefined ? validateResult : callback(validateResult)
  } catch (e) {
    return callback === undefined ? e : callback(e)
  }
}

Object.assign(Validator, { test: tester })

const validator = Validator

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

function validateTypes(arg, validatorArray) {
  const valLength = validatorArray.length

  if (valLength === 0 || !isArray(validatorArray)) {
    throw new Error('Must include some validators')
  }
  const valsKey = validator.test(arg)

  const getValidators = []
  const finalReduceArray = validatorArray.map((v) => {
    getValidators.push(v.validator)
    return valsKey.includes(v.validator.substring(2)) ? 1 : 0
  })
  const finalReduce = finalReduceArray.reduce((acc, cur) => acc + cur)
  if (finalReduce === 0) {
    throw new TypeError(
      `One of [${[...getValidators]}] has to pass, but we have your arg to be [${[...valsKey]}]`
    )
  }
  return true
}

export {
  isNumber,
  isInt,
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
  isHex,
  isNull,
  isUndefined,
  validator,
  validateArgs,
  validateTypes,
  validateFunctionArgs,
  extractValidator
}
