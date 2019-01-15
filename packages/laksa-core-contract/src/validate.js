import {
  isByStrX, isUint, isInt, isString, isBN, BN, isHash
} from 'laksa-utils'

export const Matchers = {
  ByStrX: /^ByStr[0-9]+$/,
  String: /^String$/,
  Uint: /^Uint(32|64|128|256)$/,
  Int: /^Int(32|64|128|256)$/,
  BNum: /^BNum$/
}
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

export const validate = (type, value) => {
  return validators.some(val => val.match(type) && val.validatorFn(value))
}

export const transform = (type, value) => {
  if (validate(type, value)) {
    const found = validators.find(d => d.match(type))
    return found.transformer(value)
  } else {
    throw new Error('Cannot transform')
  }
}

export { isInt, isHash }
