import { transformerArray, generateValidateObjects } from 'laksa-shared'
import { validateArgs } from 'laksa-utils'
import { isObject } from './util'

class Method {
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
   * @function {setMessenger}
   * @param  {Messenger} msg {messenger instance}
   * @return {Messenger} {messenger setter}
   */
  setMessenger(msg) {
    this.messenger = msg
  }

  /**
   * @function {validateArgs}
   * @param  {object} args         {args objects}
   * @param  {object} requiredArgs {requred args object}
   * @param  {object} optionalArgs {optional args object}
   * @return {boolean|Error} {validate result}
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
   * @function {extractParams}
   * @param  {object} args {args object}
   * @return {Array<object>} {extracted params}
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
   * @function {transformedBeforeSend}
   * @param  {any} value {value that waited to transform}
   * @param  {string} key   {key to transform}
   * @return {any} {value that transformed}
   */
  transformedBeforeSend(value, key) {
    const transformMethod = this.transformer[key]
    if (transformMethod !== undefined) {
      return transformerArray[transformMethod](value)
    } else return value
  }

  /**
   * @function {assignToObject} {assign method to some object}
   * @param  {object} object {method object}
   * @return {object} {new object}
   */
  assignToObject(object) {
    const newObject = {}
    newObject[this.name] = this.methodBuilder()
    return Object.assign(object, newObject)
  }

  /**
   * @function {methodBuilder}
   * @return {any} {built method}
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
