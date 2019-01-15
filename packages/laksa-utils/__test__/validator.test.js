import {
  isNumber,
  isInt,
  isString,
  isBoolean,
  isArray,
  isJsonString,
  isObject,
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
  isUndefined,
  isLong,
  validator,
  validateArgs,
  validateTypes,
  validateTypesMatch,
  validateFunctionArgs,
  extractValidator
} from '../src'

import { basicType, advanceType } from './fixtures'

function expector(fun, val, bool) {
  return expect(fun(val)).toEqual(bool)
}

function expectorTest(fun, val, bool) {
  return expect(fun.test(val)).toEqual(bool)
}
function expectorValidator(fun, val, bool) {
  return expect(validator(val, fun)).toEqual(bool)
}

function mapTest(testObject, testTrue, testFunc) {
  const keys = Object.keys(testObject)
  keys.forEach(k => {
    if (testTrue.includes(k)) {
      expector(testFunc, testObject[k], true)
      expectorTest(testFunc, testObject[k], true)
      expectorValidator(testFunc, testObject[k], true)
    } else {
      expector(testFunc, testObject[k], false)
      expectorTest(testFunc, testObject[k], false)
      expectorValidator(testFunc, testObject[k], false)
    }
  })
}

describe('test validator', () => {
  it('test isNumber', () => {
    const beTrue = ['zero', 'float', 'hexNumber']
    mapTest(basicType, beTrue, isNumber)
  })
  it('test isInt', () => {
    const beTrue = ['zero', 'hexNumber']
    mapTest(basicType, beTrue, isInt)
  })
  it('test isString', () => {
    const beTrue = ['text', 'hexString', 'jsonString']
    mapTest(basicType, beTrue, isString)
  })
  it('test isBoolean', () => {
    const beTrue = ['bool']
    mapTest(basicType, beTrue, isBoolean)
  })
  it('test isArray', () => {
    const beTrue = ['array']
    mapTest(basicType, beTrue, isArray)
  })
  it('test isJsonString', () => {
    const beTrue = ['jsonString']
    mapTest(basicType, beTrue, isJsonString)
  })
  it('test isObject', () => {
    const beTrue = ['object']
    mapTest(basicType, beTrue, isObject)
  })
  it('test isUndefined', () => {
    const beTrue = ['undefined']
    mapTest(basicType, beTrue, isUndefined)
  })
  it('test isNull', () => {
    const beTrue = ['null']
    mapTest(basicType, beTrue, isNull)
  })
  it('test isFunction', () => {
    const beTrue = ['function']
    mapTest(basicType, beTrue, isFunction)
  })
  it('test isLong', () => {
    const beTrue = ['long']
    mapTest({ ...basicType, ...advanceType }, beTrue, isLong)
  })

  it('test isHash', () => {
    const beTrue = ['privateKey', 'hash']
    mapTest({ ...basicType, ...advanceType }, beTrue, isHash)
  })
  it('test isUrl', () => {
    const beTrue = ['url']
    mapTest({ ...basicType, ...advanceType }, beTrue, isUrl)
  })
  it('test isPubKey', () => {
    const beTrue = ['publicKey']
    mapTest({ ...basicType, ...advanceType }, beTrue, isPubkey)
  })
  it('test isAddress', () => {
    const beTrue = ['address', 'hexAddress', 'checkSumAddress', 'byStrX']
    mapTest({ ...basicType, ...advanceType }, beTrue, isAddress)
  })
  it('test isPrivateKey', () => {
    const beTrue = ['privateKey', 'hash']
    mapTest({ ...basicType, ...advanceType }, beTrue, isPrivateKey)
  })
  it('test isHex', () => {
    const beTrue = [
      'zero',
      'publicKey',
      'hex',
      'hexString',
      'hexAddress',
      'checkSumAddress',
      'byStrX'
    ]
    mapTest({ ...basicType, ...advanceType }, beTrue, isHex)
  })
  it('test isBN', () => {
    const beTrue = ['bn']
    mapTest({ ...basicType, ...advanceType }, beTrue, isBN)
  })
  it('test isByStrX', () => {
    const beTrue = ['byStrX', 'hexAddress', 'checkSumAddress']
    mapTest({ ...basicType, ...advanceType }, beTrue, isByStrX)
  })
  it('test validator func', () => {
    expect(validator.test(basicType.zero)).toEqual(expect.arrayContaining(['Int']))
    expect(validator.test(basicType.float)).toEqual(expect.arrayContaining(['Number']))
    expect(validator.test(basicType.text)).toEqual(expect.arrayContaining(['String']))
    expect(validator.test(basicType.hexNumber)).toEqual(expect.arrayContaining(['Number']))
    expect(validator.test(basicType.hexString)).toEqual(expect.arrayContaining(['String']))
    expect(validator.test(basicType.bool)).toEqual(expect.arrayContaining(['Boolean']))
    expect(validator.test(basicType.undefined)).toEqual(expect.arrayContaining(['Undefined']))
    expect(validator.test(basicType.null)).toEqual(expect.arrayContaining(['Null']))
    expect(validator.test(basicType.jsonString)).toEqual(expect.arrayContaining(['JsonString']))
    expect(validator.test(basicType.function)).toEqual(expect.arrayContaining(['Function']))
    expect(validator.test(basicType.array)).toEqual(expect.arrayContaining(['Array']))
    expect(validator.test(basicType.object)).toEqual(expect.arrayContaining(['Object']))
    expect(validator.test(advanceType.privateKey)).toEqual(expect.arrayContaining(['PrivateKey']))
    expect(validator.test(advanceType.publicKey)).toEqual(expect.arrayContaining(['Pubkey']))
    expect(validator.test(advanceType.address)).toEqual(expect.arrayContaining(['Address']))
    expect(validator.test(advanceType.hexAddress)).toEqual(expect.arrayContaining(['Address']))
    expect(validator.test(advanceType.checkSumAddress)).toEqual(expect.arrayContaining(['ByStrX']))
    expect(validator.test(advanceType.hex)).toEqual(expect.arrayContaining(['Hex']))
    expect(validator.test(advanceType.hash)).toEqual(expect.arrayContaining(['Hash']))
    expect(validator.test(advanceType.bn)).toEqual(expect.arrayContaining(['BN']))
    expect(validator.test(advanceType.uint)).toEqual(expect.arrayContaining(['Uint']))
    expect(validator.test(advanceType.byStrX)).toEqual(expect.arrayContaining(['ByStrX']))
    expect(validator.test(advanceType.url)).toEqual(expect.arrayContaining(['Url']))
  })
  it('test validator args', () => {
    expect(
      validateArgs(
        basicType,
        {
          zero: [isNumber],
          float: [isNumber],
          text: [isString],
          jsonString: [isJsonString],
          hexNumber: [isNumber],
          hexString: [isString],
          bool: [isBoolean],
          null: [isNull],
          function: [isFunction],
          array: [isArray],
          object: [isObject]
        },
        { undefined: [isUndefined] }
      )
    ).toEqual(true)
    try {
      validateArgs(advanceType, {
        url: [isNull]
      })
    } catch (error) {
      expect(error.message).toEqual('Validation failed for url,should be isNull')
    }
    try {
      validateArgs(advanceType, {
        ppp: [isNull]
      })
    } catch (error) {
      expect(error.message).toEqual('Key not found: ppp')
    }
    try {
      validateArgs(advanceType, {
        url: 'aaa'
      })
    } catch (error) {
      expect(error.message).toEqual('Validator is not a function')
    }
    try {
      validateArgs(
        advanceType,
        {},
        {
          url: 'aaa'
        }
      )
    } catch (error) {
      expect(error.message).toEqual('Validator is not a function')
    }
    try {
      validateArgs(
        advanceType,
        {},
        {
          url: [isNull]
        }
      )
    } catch (error) {
      expect(error.message).toEqual('Validation failed for url,should be isNull')
    }
  })
  it('test validateTypes', () => {
    expect(validateTypes(advanceType.address, [isAddress])).toEqual(true)
    try {
      validateTypes(advanceType.address, [isNumber, isNull])
    } catch (error) {
      expect(error.message).toEqual(
        'One of [isNumber,isNull] has to pass, but we have your arg to be [String,Address]'
      )
    }
    try {
      validateTypes(advanceType.address, [])
    } catch (error) {
      expect(error.message).toEqual('Must include some validators')
    }
  })
  it('test validateTypesMatch', () => {
    expect(validateTypesMatch(advanceType.address, [isAddress, isString])).toEqual(true)
    try {
      validateTypesMatch(advanceType.address, [isNumber, isNull])
    } catch (error) {
      expect(error.message).toEqual(
        'All of [isNumber,isNull] has to pass, but we have your arg to be [String,Address]'
      )
    }
    try {
      validateTypesMatch(advanceType.address, [])
    } catch (error) {
      expect(error.message).toEqual('Must include some validators')
    }
  })
  it('test validateFunctionArgs', () => {
    expect(
      validateFunctionArgs([advanceType.address, advanceType.privateKey], [isAddress, isPrivateKey])
    ).toEqual(true)
    try {
      validateFunctionArgs([advanceType.address, advanceType.privateKey], [isAddress, isNull])
    } catch (error) {
      expect(error.message).toEqual('Validation failed for arguments[1], should be isNull')
    }
    try {
      validateFunctionArgs([advanceType.address], [isAddress, isNull])
    } catch (error) {
      expect(error.message).toEqual('Some args are required by function but missing')
    }
  })
  it('test extractValidators', () => {
    const validators = {
      isPubkey,
      isPrivateKey
    }
    expect(extractValidator(validators)).toEqual(expect.arrayContaining([isPubkey, isPrivateKey]))
  })
})
