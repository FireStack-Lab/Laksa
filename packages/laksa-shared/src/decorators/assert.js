import {
  isNumber,
  isString,
  isBoolean,
  isBase58,
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
  isLong,
  validateArgs,
  BN
} from 'laksa-utils'

export const validatorArray = {
  isNumber: [isNumber],
  isString: [isString],
  isBoolean: [isBoolean],
  isBase58: [isBase58],
  isArray: [isArray],
  isJson: [isJson],
  isObject: [isObject],
  isFunction: [isFunction],
  isHash: [isHash],
  isUrl: [isUrl],
  isPubkey: [isPubkey],
  isPrivateKey: [isPrivateKey],
  isBN: [isBN],
  isLong: [isLong],
  isAddress: [isAddress]
}

export const transformerArray = {
  toBN: number => new BN(number),
  toNumber: string => Number(string),
  toString: string => String(string)
}

/**
 * @function {generateValidateObjects}
 * @return {object} {validate object}
 */
export function generateValidateObjects(validatorObject) {
  const requiredArgs = {}
  const optionalArgs = {}
  for (const index in validatorObject) {
    if (index !== undefined) {
      const newObjectKey = index
      const newObjectValid = validatorObject[index][0]
      const isRequired = validatorObject[index][1]
      if (isRequired === 'required') {
        requiredArgs[newObjectKey] = validatorArray[newObjectValid]
      } else {
        optionalArgs[newObjectKey] = validatorArray[newObjectValid]
      }
    }
  }
  return { requiredArgs, optionalArgs }
}

/* eslint-disable no-param-reassign */
export const assertObject = input => (target, key, descriptor) => {
  const { requiredArgs, optionalArgs } = generateValidateObjects(input)
  const original = descriptor.value
  function interceptor(...args) {
    validateArgs(args[0], requiredArgs, optionalArgs)
    return original.apply(this, args)
  }
  descriptor.value = interceptor
  return descriptor
}
