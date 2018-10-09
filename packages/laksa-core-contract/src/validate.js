import {
  isByStrX, isUint, isInt, isString, isBN, toBN
} from 'laksa-utils'

const Matchers = {
  ByStrX: /^ByStr[0-9]+$/,
  String: /^String$/,
  Uint: /^Uint(32|64|128|256)$/,
  Int: /^Int(32|64|128|256)$/,
  BNum: /^BNum$/
}
const validators = [
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
    validatorFn: value => isBN.test(toBN(value))
  },
  {
    type: 'String',
    match: type => Matchers.String.test(type),
    validatorFn: value => isString.test(value)
  }
]

const validate = (type, value) => {
  return validators.some(val => val.match(type) && val.validatorFn(value))
}

export { toBN, validate }
