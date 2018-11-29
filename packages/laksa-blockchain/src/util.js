import {
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
  isLong,
  strip0x,
  validateArgs,
  BN,
  Long
} from 'laksa-utils'

export const validatorArray = {
  isNumber: [isNumber],
  isString: [isString],
  isBoolean: [isBoolean],
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
export function toTxParams(response) {
  const {
    ID,
    toAddr,
    gasPrice,
    gasLimit,
    amount,
    nonce,
    receipt,
    version,
    senderPubKey,
    ...rest
  } = response

  return {
    ...rest,
    TranID: ID,
    nonce,
    pubKey: strip0x(senderPubKey),
    version: parseInt(version, 10),
    toAddr,
    gasPrice: new BN(gasPrice),
    gasLimit: Long.fromString(gasLimit, 10),
    amount: new BN(amount),
    receipt: {
      ...receipt,
      cumulative_gas: parseInt(receipt.cumulative_gas, 10)
    }
  }
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
export const assert = input => (target, key, descriptor) => {
  const { requiredArgs, optionalArgs } = generateValidateObjects(input)
  const original = descriptor.value
  function interceptor(args) {
    validateArgs(args, requiredArgs, optionalArgs)
    return original.call(this, args)
  }
  descriptor.value = interceptor
  return descriptor
}

export { isObject, validateArgs }
