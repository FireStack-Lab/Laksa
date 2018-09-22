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
  validateArgs
} from './generator'

import { toBN } from './transformer'

const validatorArray = {
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
  isAddress: [isAddress]
}

const transformerArray = {
  toBn: toBN,
  toNumber: string => Number(string),
  toString: string => String(string)
}

class Method {
  constructor(options) {
    const {
      name, call, params, endpoint, transformer, isSendJson
    } = options
    this.name = name
    this.call = call
    this.messanger = null
    this.params = params
    this.transformer = transformer || {}
    this.endpoint = endpoint || 'client'
    this.isSendJson = isSendJson || false
  }

  setMessanger = (msg) => {
    this.messanger = msg
  }

  generateValidateObjects = () => {
    const validatorObject = this.params

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

  validateArgs = (args, requiredArgs, optionalArgs) => {
    const reArgs = requiredArgs === undefined ? {} : requiredArgs
    const opArgs = optionalArgs === undefined ? {} : optionalArgs
    if (args && this.params !== {}) {
      return validateArgs(args, reArgs, opArgs)
    }
    return true
  }

  extractParams = (args) => {
    const paramsObject = isObject(args) ? args : {}
    let result
    const keyArrayLength = Object.keys(paramsObject).length

    if (keyArrayLength === 0) result = []
    if (keyArrayLength === 1 && !this.isSendJson) {
      const resultKey = Object.keys(paramsObject)[0]
      result = [this.transformedBeforeSend(paramsObject[resultKey], resultKey)]
    } else if (keyArrayLength > 0 && this.isSendJson) {
      const newObject = {}
      Object.keys(paramsObject).map((k) => {
        newObject[k] = this.transformedBeforeSend(paramsObject[k], k)
        return false
      })
      result = [newObject]
    }
    return result
  }

  transformedBeforeSend = (value, key) => {
    const transformMethod = this.transformer[key]
    if (transformMethod !== undefined) {
      return transformerArray[transformMethod](value)
    } else return value
  }

  assignToObject = (object) => {
    const newObject = {}
    newObject[this.name] = this.methodBuilder()
    return Object.assign(object, newObject)
  }

  methodBuilder = () => {
    if (this.messanger !== null && this.endpoint === 'client') {
      return (args, callback) => {
        const { requiredArgs, optionalArgs } = this.generateValidateObjects()
        this.validateArgs(args, requiredArgs, optionalArgs)
        const params = this.extractParams(args)
        const newCallback = isFunction(args) ? args : callback
        if (newCallback) {
          return this.messanger.sendAsync({ method: this.call, params }, newCallback)
        }
        return this.messanger.send({ method: this.call, params })
      }
    }
    if (this.messanger !== null && this.endpoint !== 'client') {
      return (args, callback) => {
        const { requiredArgs, optionalArgs } = this.generateValidateObjects()
        this.validateArgs(args, requiredArgs, optionalArgs)
        const newCallback = isFunction(args) ? args : callback
        if (newCallback) {
          return this.messanger.sendAsyncServer(this.endpoint, args, newCallback)
        }
        return this.messanger.sendServer(this.endpoint, args)
      }
    }
  }
}

export default Method
