import {
  isByStrX, isUint, isInt, isString, isBN, BN, isHash
} from 'laksa-utils'

/**
 * @var {Object<String>} Matchers
 * @description Matchers object with multiple patterns
 */
export const Matchers = {
  ByStrX: /^ByStr[0-9]+$/,
  String: /^String$/,
  Uint: /^Uint(32|64|128|256)$/,
  Int: /^Int(32|64|128|256)$/,
  BNum: /^BNum$/
}

/**
 * @var {Array<Object>} validators
 * @description valitador objects
 */
export const validators = [
  {
    type: 'ByStrX',
    match: type => Matchers.ByStrX.test(type),
    validatorFn: value => isByStrX.test(value),
    transformer: value => String(value)
  },
  {
    type: 'UInt',
    match: type => Matchers.Uint.test(type),
    validatorFn: value => isUint.test(value),
    transformer: value => Number(value, 10)
  },
  {
    type: 'Int',
    match: type => Matchers.Int.test(type),
    validatorFn: value => isInt.test(value),
    transformer: value => Number(value, 10)
  },
  {
    type: 'BNum',
    match: type => Matchers.BNum.test(type),
    validatorFn: value => isBN.test(new BN(value)),
    transformer: value => Number(value, 10)
  },
  {
    type: 'String',
    match: type => Matchers.String.test(type),
    validatorFn: value => isString.test(value),
    transformer: value => String(value)
  }
]

/**
 * @function validate
 * @description validate param type and it's value
 * @param  {String} type  - param type
 * @param  {any} value - param value to validate
 * @return {Boolean} validate result
 */
export const validate = (type, value) => {
  return validators.some(val => val.match(type) && val.validatorFn(value))
}

/**
 * @function transform
 * @description transform a value to it's validator format
 * @param  {String} type  - param type
 * @param  {any} value - param value to validate
 * @return {any} transform result
 */
export const transform = (type, value) => {
  if (validate(type, value)) {
    const found = validators.find(d => d.match(type))
    return found.transformer(value)
  } else {
    throw new Error('Cannot transform')
  }
}

export { isInt, isHash }
