(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('valid-url'), require('bn.js'), require('number-to-bn'), require('ramda'), require('laksa-core-crypto')) :
  typeof define === 'function' && define.amd ? define(['exports', 'valid-url', 'bn.js', 'number-to-bn', 'ramda', 'laksa-core-crypto'], factory) :
  (factory((global.Laksa = {}),global.validUrl,global.bn_js,global.numToBN,global.R,global.laksaCoreCrypto));
}(this, (function (exports,validUrl,bn_js,numToBN,R,laksaCoreCrypto) { 'use strict';

  numToBN = numToBN && numToBN.hasOwnProperty('default') ? numToBN['default'] : numToBN;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /**
   * [isNumber verify param is a Number]
   * @param  {[type]}  obj [value]
   * @return {Boolean}     [boolean]
   */

  const isNumber = obj => {
    return obj === +obj;
  }; // assign validator string


  Object.assign(isNumber, {
    validator: 'Number'
  });
  /**
   * [isString verify param is a String]
   * @param  {[type]}  obj [value]
   * @return {Boolean}     [boolean]
   */

  const isString = obj => {
    return obj === `${obj}`;
  }; // assign validator string


  Object.assign(isString, {
    validator: 'String'
  });
  /**
   * [isBoolean verify param is a Boolean]
   * @param  {[type]}  obj [value]
   * @return {Boolean}     [boolean]
   */

  const isBoolean = obj => {
    return obj === !!obj;
  }; // assign validator string


  Object.assign(isBoolean, {
    validator: 'Boolean'
  });
  /**
   * [isArray verify param input is an Array]
   * @param  {[type]}  obj [value]
   * @return {Boolean}     [boolean]
   */

  const isArray = obj => {
    return Array.isArray(obj);
  }; // assign validator string


  Object.assign(isArray, {
    validator: 'Array'
  });
  /**
   * [isJson verify param input is a Json]
   * @param  {[type]}  obj [value]
   * @return {Boolean}     [boolean]
   */

  const isJson = obj => {
    try {
      return !!JSON.parse(obj);
    } catch (e) {
      return false;
    }
  }; // assign validator string


  Object.assign(isJson, {
    validator: 'Json'
  });
  /**
   * [isObject verify param is an Object]
   * @param  {[type]}  obj [value]
   * @return {Boolean}     [boolean]
   */

  const isObject = obj => {
    return obj !== null && !Array.isArray(obj) && typeof obj === 'object';
  }; // assign validator string


  Object.assign(isObject, {
    validator: 'Object'
  });
  /**
   * [isFunction verify param is a Function]
   * @param  {[type]}  obj [value]
   * @return {Boolean}     [description]
   */

  const isFunction = obj => {
    return typeof obj === 'function';
  }; // assign validator string


  Object.assign(isFunction, {
    validator: 'Function'
  });
  /**
   * verify if param is correct
   * @param  {[hex|string]}  address [description]
   * @return {Boolean}         [description]
   */
  // const isAddress = (address) => {
  //   return !!address.match(/^[0-9a-fA-F]{40}$/)
  // }

  const isAddress = address => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
      // If it's all small caps or all all caps, return true
      return true;
    } // web3.js use checksumAddress
    // else {
    //     // Otherwise check each case
    //     return isChecksumAddress(address)
    // }

  }; // assign validator string


  Object.assign(isAddress, {
    validator: 'Address'
  });
  /**
   * verify if privateKey is correct
   * @param  {[hex|string]}  privateKey [description]
   * @return {Boolean}            [description]
   */

  const isPrivateKey = privateKey => {
    if (!/^(0x)?[0-9a-f]{64}$/i.test(privateKey)) {
      // check if it has the basic requirements of an privatekey
      return false;
    } else if (/^(0x)?[0-9a-f]{64}$/.test(privateKey) || /^(0x)?[0-9A-F]{64}$/.test(privateKey)) {
      // If it's all small caps or all all caps, return true
      return true;
    } // return !!privateKey.match(/^[0-9a-fA-F]{64}$/)

  }; // assign validator string


  Object.assign(isPrivateKey, {
    validator: 'PrivateKey'
  });
  /**
   * verify if public key is correct
   * @param  {[hex|string]}  pubkey [description]
   * @return {Boolean}        [description]
   */

  const isPubkey = pubkey => {
    if (!/^(0x)?[0-9a-f]{66}$/i.test(pubkey)) {
      // check if it has the basic requirements of an pubkey
      return false;
    } else if (/^(0x)?[0-9a-f]{66}$/.test(pubkey) || /^(0x)?[0-9A-F]{66}$/.test(pubkey)) {
      // If it's all small caps or all all caps, return true
      return true;
    } // return !!pubkey.match(/^[0-9a-fA-F]{66}$/)

  }; // assign validator string


  Object.assign(isPubkey, {
    validator: 'PublicKey'
  });
  /**
   * verify if url is correct
   * @param  {[string]}  url [description]
   * @return {Boolean}     [description]
   */

  const isUrl = url => {
    return validUrl.isWebUri(url);
  }; // assign validator string


  Object.assign(isUrl, {
    validator: 'Url'
  });
  /**
   * verify if hash is correct
   * @param  {[string]}  txHash [description]
   * @return {Boolean}        [description]
   */

  const isHash = txHash => {
    if (!/^(0x)?[0-9a-f]{64}$/i.test(txHash)) {
      // check if it has the basic requirements of an txHash
      return false;
    } else if (/^(0x)?[0-9a-f]{64}$/.test(txHash) || /^(0x)?[0-9A-F]{64}$/.test(txHash)) {
      // If it's all small caps or all all caps, return true
      return true;
    } // return !!txHash.match(/^[0-9a-fA-F]{64}$/)

  }; // assign validator string


  Object.assign(isHash, {
    validator: 'Hash'
  }); // isBN
  // imported

  Object.assign(bn_js.isBN, {
    validator: 'BN'
  });
  /**
   * make sure each of the keys in requiredArgs is present in args
   * @param  {[type]} args         [description]
   * @param  {[type]} requiredArgs [description]
   * @param  {[type]} optionalArgs [description]
   * @return {[type]}              [description]
   */

  function validateArgs(args, requiredArgs, optionalArgs) {
    for (const key in requiredArgs) {
      if (args[key] !== undefined) {
        for (let i = 0; i < requiredArgs[key].length; i += 1) {
          if (typeof requiredArgs[key][i] !== 'function') throw new Error('Validator is not a function');

          if (!requiredArgs[key][i](args[key])) {
            throw new Error(`Validation failed for ${key},should be ${requiredArgs[key][i].validator}`);
          }
        }
      } else throw new Error(`Key not found: ${key}`);
    }

    for (const key in optionalArgs) {
      if (args[key]) {
        for (let i = 0; i < optionalArgs[key].length; i += 1) {
          if (typeof optionalArgs[key][i] !== 'function') throw new Error('Validator is not a function');

          if (!optionalArgs[key][i](args[key])) {
            throw new Error(`Validation failed for ${key},should be ${optionalArgs[key][i].validator}`);
          }
        }
      }
    }

    return true;
  }

  function validateFunctionArgs(ArgsArray, validatorArray) {
    const argLength = ArgsArray.length;
    const valLength = validatorArray.length;
    if (argLength < valLength) throw new Error('Some args are required by function but missing');

    for (let i = 0; i < valLength; i += 1) {
      if (!validatorArray[i](ArgsArray[i])) {
        throw new Error(`Validation failed for arguments[${i}], should be ${validatorArray[i].validator}`);
      }
    }

    return true;
  }

  // import BN from 'bn.js'
  /**
   * convert number to array representing the padded hex form
   * @param  {[string]} val        [description]
   * @param  {[number]} paddedSize [description]
   * @return {[string]}            [description]
   */

  const intToByteArray = (val, paddedSize) => {
    const arr = [];
    const hexVal = val.toString(16);
    const hexRep = [];
    let i;

    for (i = 0; i < hexVal.length; i += 1) {
      hexRep[i] = hexVal[i].toString();
    }

    for (i = 0; i < paddedSize - hexVal.length; i += 1) {
      arr.push('0');
    }

    for (i = 0; i < hexVal.length; i += 1) {
      arr.push(hexRep[i]);
    }

    return arr;
  };

  const toHex = () => {// to be implemented
  };

  const toUtf8 = () => {// to utf 8
  };

  const toAscii = () => {// to be implemented
  };

  const fromUtf8 = () => {// to be implemented
  };

  const fromAscii = () => {// to be implemented
  };

  const toBN = data => {
    try {
      return numToBN(data);
    } catch (e) {
      throw new Error(`${e} of "${data}"`);
    } // to be implemented

  };

  const toNumber = () => {} // to be implemented

  /**
   * Should be called to pad string to expected length
   *
   * @method padLeft
   * @param {String} string to be padded
   * @param {Number} characters that result string should have
   * @param {String} sign, by default 0
   * @returns {String} right aligned string
   */
;

  const padLeft = (string, chars, sign) => {
    return new Array(chars - string.length + 1).join(sign || '0') + string;
  };
  /**
   * Should be called to pad string to expected length
   *
   * @method padRight
   * @param {String} string to be padded
   * @param {Number} characters that result string should have
   * @param {String} sign, by default 0
   * @returns {String} right aligned string
   */


  const padRight = (string, chars, sign) => {
    return string + new Array(chars - string.length + 1).join(sign || '0');
  };

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
    isBN: [bn_js.isBN],
    isAddress: [isAddress]
  };
  const transformerArray = {
    toBn: toBN,
    toNumber: string => Number(string),
    toString: string => String(string)
  };

  class Method {
    constructor(options) {
      _defineProperty(this, "setMessanger", msg => {
        this.messanger = msg;
      });

      _defineProperty(this, "generateValidateObjects", () => {
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
      });

      _defineProperty(this, "validateArgs", (args, requiredArgs, optionalArgs) => {
        const reArgs = requiredArgs === undefined ? {} : requiredArgs;
        const opArgs = optionalArgs === undefined ? {} : optionalArgs;

        if (args && this.params !== {}) {
          return validateArgs(args, reArgs, opArgs);
        }

        return true;
      });

      _defineProperty(this, "extractParams", args => {
        const paramsObject = isObject(args) ? args : {};
        let result;
        const keyArrayLength = Object.keys(paramsObject).length;
        if (keyArrayLength === 0) result = [];

        if (keyArrayLength === 1 && !this.isSendJson) {
          const resultKey = Object.keys(paramsObject)[0];
          result = [this.transformedBeforeSend(paramsObject[resultKey], resultKey)];
        } else if (keyArrayLength > 1 && this.isSendJson) {
          const newObject = R.mapObjIndexed(this.transformedBeforeSend, paramsObject);
          result = [newObject];
        }

        return result;
      });

      _defineProperty(this, "transformedBeforeSend", (value, key) => {
        const transformMethod = this.transformer[key];

        if (transformMethod !== undefined) {
          return transformerArray[transformMethod](value);
        } else return value;
      });

      _defineProperty(this, "assignToObject", object => {
        const newObject = {};
        newObject[this.name] = this.methodBuilder();
        return Object.assign(object, newObject);
      });

      _defineProperty(this, "methodBuilder", () => {
        if (this.messanger !== null && this.endpoint === 'client') {
          return (args, callback) => {
            const {
              requiredArgs,
              optionalArgs
            } = this.generateValidateObjects();
            this.validateArgs(args, requiredArgs, optionalArgs);
            const params = this.extractParams(args);
            console.log(params);

            if (callback) {
              return this.messanger.sendAsync({
                method: this.call,
                params
              }, callback);
            }

            return this.messanger.send({
              method: this.call,
              params
            });
          };
        }

        if (this.messanger !== null && this.endpoint !== 'client') {
          return (args, callback) => {
            const {
              requiredArgs,
              optionalArgs
            } = this.generateValidateObjects();
            this.validateArgs(args, requiredArgs, optionalArgs);

            if (callback) {
              return this.messanger.sendAsyncServer(this.endpoint, args, callback);
            }

            return this.messanger.sendServer(this.endpoint, args);
          };
        }
      });

      const {
        name,
        call,
        params: _params,
        endpoint,
        transformer,
        isSendJson
      } = options;
      this.name = name;
      this.call = call;
      this.messanger = null;
      this.params = _params;
      this.transformer = transformer || {};
      this.endpoint = endpoint || 'client';
      this.isSendJson = isSendJson || false;
    }

  }

  class Property {
    constructor(options) {
      _defineProperty(this, "setMessanger", msg => {
        this.messanger = msg;
      });

      _defineProperty(this, "assignToObject", object => {
        const zilName = this.name;

        const asyncGetterName = getName => {
          return `get${getName.charAt(0).toUpperCase()}${getName.slice(1)}`;
        };

        const zilObject = {
          get: this.propertyBuilder(),
          enumerable: true
        };
        const newZilObject = {};
        newZilObject[asyncGetterName(zilName)] = this.propertyBuilder();
        Object.defineProperty(object, zilName, zilObject); //

        Object.assign(object, newZilObject);
      });

      _defineProperty(this, "propertyBuilder", () => {
        if (this.messanger !== null) {
          return callback => {
            if (callback) {
              return this.messanger.sendAsync({
                method: this.getter
              }, callback);
            }

            return this.messanger.send({
              method: this.getter
            });
          };
        }
      });

      const {
        name,
        getter,
        setter
      } = options;
      this.name = name;
      this.getter = getter;
      this.setter = setter;
      this.messanger = null;
    }

  }

  exports.isBN = bn_js.isBN;
  exports.generatePrivateKey = laksaCoreCrypto.generatePrivateKey;
  exports.getAddressFromPrivateKey = laksaCoreCrypto.getAddressFromPrivateKey;
  exports.getPubKeyFromPrivateKey = laksaCoreCrypto.getPubKeyFromPrivateKey;
  exports.compressPublicKey = laksaCoreCrypto.compressPublicKey;
  exports.getAddressFromPublicKey = laksaCoreCrypto.getAddressFromPublicKey;
  exports.verifyPrivateKey = laksaCoreCrypto.verifyPrivateKey;
  exports.encodeTransaction = laksaCoreCrypto.encodeTransaction;
  exports.createTransactionJson = laksaCoreCrypto.createTransactionJson;
  exports.Method = Method;
  exports.Property = Property;
  exports.isNumber = isNumber;
  exports.isString = isString;
  exports.isBoolean = isBoolean;
  exports.isArray = isArray;
  exports.isJson = isJson;
  exports.isObject = isObject;
  exports.isFunction = isFunction;
  exports.isHash = isHash;
  exports.isUrl = isUrl;
  exports.isPubkey = isPubkey;
  exports.isPrivateKey = isPrivateKey;
  exports.isAddress = isAddress;
  exports.validateArgs = validateArgs;
  exports.validateFunctionArgs = validateFunctionArgs;
  exports.intToByteArray = intToByteArray;
  exports.toHex = toHex;
  exports.toUtf8 = toUtf8;
  exports.toAscii = toAscii;
  exports.fromUtf8 = fromUtf8;
  exports.fromAscii = fromAscii;
  exports.toBN = toBN;
  exports.toNumber = toNumber;
  exports.padLeft = padLeft;
  exports.padRight = padRight;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
