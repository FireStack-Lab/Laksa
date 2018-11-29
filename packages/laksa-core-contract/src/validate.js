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
    validatorFn: value => isByStrX.test(value)
  },
  {
    type: 'UInt',
    match: type => Matchers.Uint.test(type),
    validatorFn: value => isUint.test(value)
  },
  {
    type: 'Int',
    match: type => Matchers.Int.test(type),
    validatorFn: value => isInt.test(value)
  },
  {
    type: 'BNum',
    match: type => Matchers.BNum.test(type),
    validatorFn: value => isBN.test(new BN(value))
  },
  {
    type: 'String',
    match: type => Matchers.String.test(type),
    validatorFn: value => isString.test(value)
  }
]

export const validate = (type, value) => {
  return validators.some(val => val.match(type) && val.validatorFn(value))
}

export { isInt, isHash }
