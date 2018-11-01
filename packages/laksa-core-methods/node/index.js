(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('laksa-utils')) :
  typeof define === 'function' && define.amd ? define(['laksa-utils'], factory) :
  (global.Laksa = factory(global.laksaUtils));
}(this, (function (laksaUtils) { 'use strict';

  const validatorArray = {
    isNumber: [laksaUtils.isNumber],
    isString: [laksaUtils.isString],
    isBoolean: [laksaUtils.isBoolean],
    isArray: [laksaUtils.isArray],
    isJson: [laksaUtils.isJson],
    isObject: [laksaUtils.isObject],
    isFunction: [laksaUtils.isFunction],
    isHash: [laksaUtils.isHash],
    isUrl: [laksaUtils.isUrl],
    isPubkey: [laksaUtils.isPubkey],
    isPrivateKey: [laksaUtils.isPrivateKey],
    isBN: [laksaUtils.isBN],
    isAddress: [laksaUtils.isAddress]
  };
  const transformerArray = {
    toBn: laksaUtils.toBN,
    toNumber: string => Number(string),
    toString: string => String(string)
  };

  class Method {
    constructor(options) {
      const {
        name,
        call,
        params,
        endpoint,
        transformer,
        isSendJson
      } = options;
      this.name = name;
      this.call = call;
      this.messenger = null;
      this.params = params;
      this.transformer = transformer || {};
      this.endpoint = endpoint || 'client';
      this.isSendJson = isSendJson || false;
    }
    /**
     * @function {setMessenger}
     * @param  {Messenger} msg {messenger instance}
     * @return {Messenger} {messenger setter}
     */


    setMessenger(msg) {
      this.messenger = msg;
    }
    /**
     * @function {generateValidateObjects}
     * @return {object} {validate object}
     */


    generateValidateObjects() {
      const validatorObject = this.params;
      const requiredArgs = {};
      const optionalArgs = {};

      for (const index in validatorObject) {
        if (index !== undefined) {
          const newObjectKey = index;
          const newObjectValid = validatorObject[index][0];
          const isRequired = validatorObject[index][1];

          if (isRequired === 'required') {
            requiredArgs[newObjectKey] = validatorArray[newObjectValid];
          } else {
            optionalArgs[newObjectKey] = validatorArray[newObjectValid];
          }
        }
      }

      return {
        requiredArgs,
        optionalArgs
      };
    }
    /**
     * @function {validateArgs}
     * @param  {object} args         {args objects}
     * @param  {object} requiredArgs {requred args object}
     * @param  {object} optionalArgs {optional args object}
     * @return {boolean|Error} {validate result}
     */


    validateArgs(args, requiredArgs, optionalArgs) {
      const reArgs = requiredArgs === undefined ? {} : requiredArgs;
      const opArgs = optionalArgs === undefined ? {} : optionalArgs;

      if (args && this.params !== {}) {
        return laksaUtils.validateArgs(args, reArgs, opArgs);
      }

      return true;
    }
    /**
     * @function {extractParams}
     * @param  {object} args {args object}
     * @return {Array<object>} {extracted params}
     */


    extractParams(args) {
      const paramsObject = laksaUtils.isObject(args) ? args : {};
      let result;
      const keyArrayLength = Object.keys(paramsObject).length;
      if (keyArrayLength === 0) result = [];

      if (keyArrayLength === 1 && !this.isSendJson) {
        const resultKey = Object.keys(paramsObject)[0];
        result = [this.transformedBeforeSend(paramsObject[resultKey], resultKey)];
      } else if (keyArrayLength > 0 && this.isSendJson) {
        const newObject = {};
        Object.keys(paramsObject).map(k => {
          newObject[k] = this.transformedBeforeSend(paramsObject[k], k);
          return false;
        });
        result = [newObject];
      }

      return result;
    }
    /**
     * @function {transformedBeforeSend}
     * @param  {any} value {value that waited to transform}
     * @param  {string} key   {key to transform}
     * @return {any} {value that transformed}
     */


    transformedBeforeSend(value, key) {
      const transformMethod = this.transformer[key];

      if (transformMethod !== undefined) {
        return transformerArray[transformMethod](value);
      } else return value;
    }
    /**
     * @function {assignToObject} {assign method to some object}
     * @param  {object} object {method object}
     * @return {object} {new object}
     */


    assignToObject(object) {
      const newObject = {};
      newObject[this.name] = this.methodBuilder();
      return Object.assign(object, newObject);
    }
    /**
     * @function {methodBuilder}
     * @return {any} {built method}
     */


    methodBuilder() {
      if (this.messenger !== null && this.endpoint === 'client') {
        return (args, callback) => {
          const {
            requiredArgs,
            optionalArgs
          } = this.generateValidateObjects();
          this.validateArgs(args, requiredArgs, optionalArgs);
          const params = this.extractParams(args);
          const newCallback = laksaUtils.isFunction(args) ? args : callback;

          if (newCallback) {
            return this.messenger.sendAsync({
              method: this.call,
              params
            }, newCallback);
          }

          return this.messenger.send({
            method: this.call,
            params
          });
        };
      }

      if (this.messenger !== null && this.endpoint !== 'client') {
        return (args, callback) => {
          const {
            requiredArgs,
            optionalArgs
          } = this.generateValidateObjects();
          this.validateArgs(args, requiredArgs, optionalArgs);
          const newCallback = laksaUtils.isFunction(args) ? args : callback;

          if (newCallback) {
            return this.messenger.sendAsyncServer(this.endpoint, args, newCallback);
          }

          return this.messenger.sendServer(this.endpoint, args);
        };
      }
    }

  }

  return Method;

})));
