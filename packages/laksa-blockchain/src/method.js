import { transformerArray, generateValidateObjects } from 'laksa-shared'
import { validateArgs } from 'laksa-utils'
import { isObject } from './util'

/**
 * @class Method
 * @param  {Object} options - to constructor
 * @param {Messenger} messenger - Messenger instance
 * @return {Method}
 * @description generate a method
 */
class Method {
  /**
   * @memberof Method
   * @description method name
   * @type {String}
   */
  name

  /**
   * @memberof Method
   * @description method to call
   * @type {Function}
   */
  call

  /**
   * @memberof Method
   * @description Messenger of Method
   * @type {Messsenger}
   */
  messenger

  /**
   * @memberof Method
   * @description params send to Method
   * @type {?Object}
   */
  params

  /**
   * @memberof Method
   * @description transformer send to Method
   * @type {?Object}
   */
  transformer

  /**
   * @memberof Method
   * @description endpoint string to call
   * @type {?String}
   */
  endpoint

  /**
   * @memberof Method
   * @description whether send params as json
   * @type {Boolean}
   */
  isSendJson

  constructor(options, messenger) {
    const {
      name, call, params, endpoint, transformer, isSendJson
    } = options

    this.name = name
    this.call = call
    this.messenger = messenger
    this.params = params
    this.transformer = transformer || {}
    this.endpoint = endpoint || 'client'
    this.isSendJson = isSendJson || false
  }

  /**
   * @function setMessenger
   * @param  {Messenger} messenger - messenger instance
   * @memberof Method.prototype
   * @description messenger setter
   */
  setMessenger(msg) {
    this.messenger = msg
  }

  /**
   * @function validateArgs
   * @memberof Method.prototype
   * @description validate args received
   * @param  {Object} args         - args objects
   * @param  {Object} requiredArgs - requred args object
   * @param  {Object} optionalArgs - optional args object
   * @return {Boolean|Error} - validate result
   */
  validateArgs(args, requiredArgs, optionalArgs) {
    const reArgs = requiredArgs === undefined ? {} : requiredArgs
    const opArgs = optionalArgs === undefined ? {} : optionalArgs
    if (args && this.params !== {}) {
      return validateArgs(args, reArgs, opArgs)
    }
    return true
  }

  /**
   * @function extractParams
   * @memberof Method.prototype
   * @description extract params sent to Method
   * @param  {Object} args - args object
   * @return {Array<Object>} - extracted params
   */
  extractParams(args) {
    const paramsObject = isObject(args) ? args : {}
    let result
    const keyArrayLength = Object.keys(paramsObject).length

    if (keyArrayLength === 0) result = []
    if (keyArrayLength === 1 && !this.isSendJson) {
      const resultKey = Object.keys(paramsObject)[0]
      result = this.transformedBeforeSend(paramsObject[resultKey], resultKey)
    } else if (keyArrayLength > 0 && this.isSendJson) {
      const newObject = {}
      Object.keys(paramsObject).map(k => {
        newObject[k] = this.transformedBeforeSend(paramsObject[k], k)
        return false
      })
      result = newObject
    }
    return result
  }

  /**
   * @function transformedBeforeSend
   * @memberof Method.prototype
   * @description extract params sent to Method
   * @param  {any} value - value that waited to transform
   * @param  {String} key   - key to transform
   * @return {any}  - value that transformed
   */
  transformedBeforeSend(value, key) {
    const transformMethod = this.transformer[key]
    if (transformMethod !== undefined) {
      return transformerArray[transformMethod](value)
    } else return value
  }

  /**
   * @function assignToObject
   * @memberof Method.prototype
   * @description assign method to class object
   * @param  {Object} object - method object
   * @return {Object} - new object
   */
  assignToObject(object) {
    const newObject = {}
    newObject[this.name] = this.methodBuilder()
    return Object.assign(object, newObject)
  }

  /**
   * @function methodBuilder
   * @memberof Method.prototype
   * @description build method when call
   * @return {any} - call method
   */
  methodBuilder() {
    if (this.messenger !== null && this.endpoint === 'client') {
      return args => {
        const { requiredArgs, optionalArgs } = generateValidateObjects(this.params)
        this.validateArgs(args, requiredArgs, optionalArgs)
        const params = this.extractParams(args)
        return this.messenger.send(this.call, params)
      }
    }
    if (this.messenger !== null && this.endpoint !== 'client') {
      return args => {
        const { requiredArgs, optionalArgs } = generateValidateObjects(this.params)
        this.validateArgs(args, requiredArgs, optionalArgs)
        return this.messenger.sendServer(this.endpoint, args)
      }
    }
  }
}

export { Method }
