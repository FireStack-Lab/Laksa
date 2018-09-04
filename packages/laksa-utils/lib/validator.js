"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateArgs = validateArgs;
exports.validateFunctionArgs = validateFunctionArgs;
Object.defineProperty(exports, "isBN", {
  enumerable: true,
  get: function get() {
    return _bn.isBN;
  }
});
exports.isAddress = exports.isPrivateKey = exports.isPubkey = exports.isUrl = exports.isHash = exports.isFunction = exports.isObject = exports.isJson = exports.isArray = exports.isBoolean = exports.isString = exports.isNumber = void 0;

var _validUrl = require("valid-url");

var _bn = require("bn.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
var isNumber = function isNumber(obj) {
  return obj === +obj;
}; // assign validator string


exports.isNumber = isNumber;
Object.assign(isNumber, {
  validator: 'Number'
});
/**
 * [isString verify param is a String]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isString = function isString(obj) {
  return obj === "".concat(obj);
}; // assign validator string


exports.isString = isString;
Object.assign(isString, {
  validator: 'String'
});
/**
 * [isBoolean verify param is a Boolean]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isBoolean = function isBoolean(obj) {
  return obj === !!obj;
}; // assign validator string


exports.isBoolean = isBoolean;
Object.assign(isBoolean, {
  validator: 'Boolean'
});
/**
 * [isArray verify param input is an Array]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isArray = function isArray(obj) {
  return Array.isArray(obj);
}; // assign validator string


exports.isArray = isArray;
Object.assign(isArray, {
  validator: 'Array'
});
/**
 * [isJson verify param input is a Json]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isJson = function isJson(obj) {
  try {
    return !!JSON.parse(obj);
  } catch (e) {
    return false;
  }
}; // assign validator string


exports.isJson = isJson;
Object.assign(isJson, {
  validator: 'Json'
});
/**
 * [isObject verify param is an Object]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isObject = function isObject(obj) {
  return obj !== null && !Array.isArray(obj) && _typeof(obj) === 'object';
}; // assign validator string


exports.isObject = isObject;
Object.assign(isObject, {
  validator: 'Object'
});
/**
 * [isFunction verify param is a Function]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [description]
 */

var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
}; // assign validator string


exports.isFunction = isFunction;
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

var isAddress = function isAddress(address) {
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


exports.isAddress = isAddress;
Object.assign(isAddress, {
  validator: 'Address'
});
/**
 * verify if privateKey is correct
 * @param  {[hex|string]}  privateKey [description]
 * @return {Boolean}            [description]
 */

var isPrivateKey = function isPrivateKey(privateKey) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(privateKey)) {
    // check if it has the basic requirements of an privatekey
    return false;
  } else if (/^(0x)?[0-9a-f]{64}$/.test(privateKey) || /^(0x)?[0-9A-F]{64}$/.test(privateKey)) {
    // If it's all small caps or all all caps, return true
    return true;
  } // return !!privateKey.match(/^[0-9a-fA-F]{64}$/)

}; // assign validator string


exports.isPrivateKey = isPrivateKey;
Object.assign(isPrivateKey, {
  validator: 'PrivateKey'
});
/**
 * verify if public key is correct
 * @param  {[hex|string]}  pubkey [description]
 * @return {Boolean}        [description]
 */

var isPubkey = function isPubkey(pubkey) {
  if (!/^(0x)?[0-9a-f]{66}$/i.test(pubkey)) {
    // check if it has the basic requirements of an pubkey
    return false;
  } else if (/^(0x)?[0-9a-f]{66}$/.test(pubkey) || /^(0x)?[0-9A-F]{66}$/.test(pubkey)) {
    // If it's all small caps or all all caps, return true
    return true;
  } // return !!pubkey.match(/^[0-9a-fA-F]{66}$/)

}; // assign validator string


exports.isPubkey = isPubkey;
Object.assign(isPubkey, {
  validator: 'PublicKey'
});
/**
 * verify if url is correct
 * @param  {[string]}  url [description]
 * @return {Boolean}     [description]
 */

var isUrl = function isUrl(url) {
  return (0, _validUrl.isWebUri)(url);
}; // assign validator string


exports.isUrl = isUrl;
Object.assign(isUrl, {
  validator: 'Url'
});
/**
 * verify if hash is correct
 * @param  {[string]}  txHash [description]
 * @return {Boolean}        [description]
 */

var isHash = function isHash(txHash) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(txHash)) {
    // check if it has the basic requirements of an txHash
    return false;
  } else if (/^(0x)?[0-9a-f]{64}$/.test(txHash) || /^(0x)?[0-9A-F]{64}$/.test(txHash)) {
    // If it's all small caps or all all caps, return true
    return true;
  } // return !!txHash.match(/^[0-9a-fA-F]{64}$/)

}; // assign validator string


exports.isHash = isHash;
Object.assign(isHash, {
  validator: 'Hash'
}); // isBN
// imported

Object.assign(_bn.isBN, {
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
  for (var key in requiredArgs) {
    if (args[key] !== undefined) {
      for (var i = 0; i < requiredArgs[key].length; i += 1) {
        if (typeof requiredArgs[key][i] !== 'function') throw new Error('Validator is not a function');

        if (!requiredArgs[key][i](args[key])) {
          throw new Error("Validation failed for ".concat(key, ",should be ").concat(requiredArgs[key][i].validator));
        }
      }
    } else throw new Error("Key not found: ".concat(key));
  }

  for (var _key in optionalArgs) {
    if (args[_key]) {
      for (var _i = 0; _i < optionalArgs[_key].length; _i += 1) {
        if (typeof optionalArgs[_key][_i] !== 'function') throw new Error('Validator is not a function');

        if (!optionalArgs[_key][_i](args[_key])) {
          throw new Error("Validation failed for ".concat(_key, ",should be ").concat(optionalArgs[_key][_i].validator));
        }
      }
    }
  }

  return true;
}

function validateFunctionArgs(ArgsArray, validatorArray) {
  var argLength = ArgsArray.length;
  var valLength = validatorArray.length;
  if (argLength < valLength) throw new Error('Some args are required by function but missing');

  for (var i = 0; i < valLength; i += 1) {
    if (!validatorArray[i](ArgsArray[i])) {
      throw new Error("Validation failed for arguments[".concat(i, "], should be ").concat(validatorArray[i].validator));
    }
  }

  return true;
}