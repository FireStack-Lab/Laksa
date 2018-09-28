'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.number.is-nan');
require('core-js/modules/es6.regexp.split');
require('core-js/modules/es6.regexp.replace');
require('core-js/modules/es6.number.constructor');
require('core-js/modules/es6.number.is-finite');
require('core-js/modules/es6.regexp.to-string');
var numToBN = _interopDefault(require('number-to-bn'));
var utf8 = _interopDefault(require('utf8'));
var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
require('core-js/modules/es6.number.is-integer');
var validUrl = require('valid-url');
var bn_js = require('bn.js');
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
require('core-js/modules/es7.array.includes');
require('core-js/modules/es6.string.includes');
require('core-js/modules/es6.object.assign');
require('core-js/modules/es7.object.values');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');

/**
 * convert number to array representing the padded hex form
 * @param  {[string]} val        [description]
 * @param  {[number]} paddedSize [description]
 * @return {[string]}            [description]
 */

var intToByteArray = function intToByteArray(val, paddedSize) {
  var arr = [];
  var hexVal = val.toString(16);
  var hexRep = [];
  var i;

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
/**
 * Converts value to it's hex representation
 *
 * @method numberToHex
 * @param {String|Number|BN} value
 * @return {String}
 */


var numberToHex = function numberToHex(value) {
  validateTypes(value, [isString$1, isNumber$1, isBN, isNull$1, isUndefined$1]);

  if (isNull$1(value) || isUndefined$1(value)) {
    return value;
  }

  if (!Number.isFinite(value) && !isHex$1(value) && !isBN(value) && !isString$1(value)) {
    throw new Error("Given input \"".concat(value, "\" is not a number."));
  }

  var number = isBN(value) ? value : toBN(value);
  var result = number.toString(16);
  return number.lt(toBN(0)) ? "-0x".concat(result.substr(1)) : "0x".concat(result);
};

var toUtf8 = function toUtf8() {// to utf 8
};

var toAscii = function toAscii() {// to be implemented
};

var fromUtf8 = function fromUtf8() {// to be implemented
};

var fromAscii = function fromAscii() {// to be implemented
};

var toBN = function toBN(data) {
  try {
    return numToBN(data);
  } catch (e) {
    throw new Error("".concat(e, " of \"").concat(data, "\""));
  } // to be implemented

};
/**
 * Converts value to it's number representation
 *
 * @method hexToNumber
 * @param {String|Number|BN} value
 * @return {String}
 */


var hexToNumber = function hexToNumber(value) {
  validateTypes(value, [isNumber$1, isString$1, isHex$1, isBN, isUndefined$1]);

  if (!value) {
    return value;
  }

  return toBN(value).toNumber();
};
/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method utf8ToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */


var utf8ToHex = function utf8ToHex(str) {
  validateTypes(str, [isAddress$1, isString$1, isHex$1]);
  var hex = '';
  var newString = utf8.encode(str);
  var str1 = newString.replace(/^(?:\u0000)*/, '');
  var str2 = str1.split('').reverse().join('');
  var str3 = str2.replace(/^(?:\u0000)*/, '');
  var str4 = str3.split('').reverse().join('');

  for (var i = 0; i < str4.length; i += 1) {
    var code = str4.charCodeAt(i); // if (code !== 0) {

    var n = code.toString(16);
    hex += n.length < 2 ? "0".concat(n) : n; // }
  }

  return "0x".concat(hex);
};
/**
 * Auto converts any given value into it's hex representation.
 *
 * And even stringifys objects before.
 *
 * @method toHex
 * @param {String|Number|BN|Object} value
 * @param {Boolean} returnType
 * @return {String}
 */


var toHex = function toHex(value, returnType) {
  /* jshint maxcomplexity: false */
  validateTypes(value, [isAddress$1, isBoolean$1, isObject$1, isString$1, isNumber$1, isHex$1, isBN]);

  if (isAddress$1(value)) {
    // strip 0x from address
    return returnType ? 'address' : "0x".concat(value.toLowerCase().replace(/^0x/i, ''));
  }

  if (isBoolean$1(value)) {
    return returnType ? 'bool' : value ? '0x01' : '0x00';
  }

  if (isObject$1(value) && !isBN(value)) {
    return returnType ? 'string' : utf8ToHex(JSON.stringify(value));
  }

  if (isBN(value)) {
    return returnType ? 'BN' : numberToHex(value);
  } // if its a negative number, pass it through numberToHex


  if (isString$1(value)) {
    if (isHex$1(value) || !Number.isNaN(Number(value))) {
      return returnType ? value < 0 ? 'int256' : 'uint256' : numberToHex(value);
    } else if (!Number.isFinite(value) && !isUndefined$1(value) && Number.isNaN(Number(value))) {
      return returnType ? 'string' : add0x(value);
    }
  }

  return returnType ? value < 0 ? 'int256' : 'uint256' : numberToHex(value);
};

var strip0x = function strip0x(value) {
  var newString = toHex(value);
  return "".concat(newString.replace(/^0x/i, ''));
};
/**
 * [add an '0x' prefix to value]
 * @param  {[String|Number|Hex|BN]} value [description]
 * @return {[String]}       [description]
 */


var add0x = function add0x(value) {
  validateTypes(value, [isString$1, isNumber$1, isHex$1, isBN]);
  var newString;

  if (!isString$1(value)) {
    newString = String(value);
    return "0x".concat(newString.replace(/^0x/i, ''));
  }

  newString = "0x".concat(value.replace(/^0x/i, ''));
  return newString;
};
/**
 * Should be called to pad string to expected length
 *
 * @method padLeft
 * @param {String} string to be padded
 * @param {Number} characters that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */


var padLeft = function padLeft(string, chars, sign) {
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


var padRight = function padRight(string, chars, sign) {
  return string + new Array(chars - string.length + 1).join(sign || '0');
};

/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isNumber = function isNumber(obj) {
  return obj === +obj;
};
/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isInt = function isInt(obj) {
  return isNumber(obj) && Number.isInteger(obj);
};
/**
 * [isString verify param is a String]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isString = function isString(obj) {
  return obj === "".concat(obj);
};
/**
 * [isBoolean verify param is a Boolean]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isBoolean = function isBoolean(obj) {
  return obj === !!obj;
};
/**
 * [isArray verify param input is an Array]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isArray = function isArray(obj) {
  return Array.isArray(obj);
};
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
};
/**
 * [isObject verify param is an Object]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isObject = function isObject(obj) {
  return obj !== null && !Array.isArray(obj) && _typeof(obj) === 'object';
};
/**
 * [isFunction verify param is a Function]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [description]
 */


var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
};
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
  }
};
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

};
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

};
/**
 * verify if url is correct
 * @param  {[string]}  url [description]
 * @return {Boolean}     [description]
 */


var isUrl = function isUrl(url) {
  if (typeof url === 'string') {
    return validUrl.isWebUri(url);
  }

  return false;
};
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

};
/**
 * Check if string is HEX
 *
 * @method isHex
 * @param {String} hex to be checked
 * @returns {Boolean}
 */


var isHex = function isHex(hex) {
  return (isString(hex) || isNumber(hex)) && /^0x?[0-9a-f]*$/i.test(hex);
};
/**
 * check Object isNull
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */


var isNull = function isNull(obj) {
  return obj === null;
};
/**
 * check object is undefined
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */


var isUndefined = function isUndefined(obj) {
  return obj === undefined;
};

var validators = /*#__PURE__*/Object.freeze({
  isNumber: isNumber,
  isInt: isInt,
  isString: isString,
  isBoolean: isBoolean,
  isArray: isArray,
  isJson: isJson,
  isObject: isObject,
  isFunction: isFunction,
  isHash: isHash,
  isUrl: isUrl,
  isPubkey: isPubkey,
  isPrivateKey: isPrivateKey,
  isAddress: isAddress,
  isBN: bn_js.isBN,
  isHex: isHex,
  isNull: isNull,
  isUndefined: isUndefined
});

function objToArray(obj) {
  var keys = Object.keys(obj);
  var values = Object.values(obj);
  var newArray = keys.map(function (k, index) {
    var Obj = {};
    Obj[k] = values[index];
    return Obj;
  });
  return newArray;
}

function injectValidator(func) {
  if (_typeof(func) === 'object' && func !== undefined) {
    var valName = Object.keys(func)[0];
    var valFunc = Object.values(func)[0];
    return Object.assign(valFunc, {
      validator: valName,
      test: function test(obj) {
        return valFunc(obj);
      }
    });
  } else return false;
}

function extractValidator(vals) {
  var newValidator = [];
  var newArr = objToArray(vals);
  newArr.forEach(function (v, index) {
    var newV = injectValidator(v);
    var validatorString = newV.validator;
    newValidator[validatorString] = newV;
    newValidator[index] = newV;
  });
  return newValidator;
}

var valArray = extractValidator(validators);
var isNumber$1 = valArray.isNumber,
    isInt$1 = valArray.isInt,
    isString$1 = valArray.isString,
    isBoolean$1 = valArray.isBoolean,
    isArray$1 = valArray.isArray,
    isJson$1 = valArray.isJson,
    isObject$1 = valArray.isObject,
    isFunction$1 = valArray.isFunction,
    isHash$1 = valArray.isHash,
    isUrl$1 = valArray.isUrl,
    isPubkey$1 = valArray.isPubkey,
    isPrivateKey$1 = valArray.isPrivateKey,
    isAddress$1 = valArray.isAddress,
    isBN = valArray.isBN,
    isHex$1 = valArray.isHex,
    isNull$1 = valArray.isNull,
    isUndefined$1 = valArray.isUndefined;
/**
 * [Validator description]
 * @param       {[type]} stringToTest    [description]
 * @param       {[type]} validatorString [description]
 * @constructor
 */

function Validator(stringToTest, validatorString) {
  if (typeof validatorString === 'string' && valArray["is".concat(validatorString)] !== undefined) {
    return valArray["is".concat(validatorString)].test(stringToTest);
  } else if (typeof validatorString === 'function') {
    return validatorString(stringToTest);
  } else {
    throw new Error("validator not found :".concat(validatorString));
  }
}

function tester(value, callback) {
  try {
    var validateResult = valArray.map(function (func) {
      return func.test(value) ? func.validator.substring(2) : false;
    }).filter(function (d) {
      return d !== false;
    });
    return callback === undefined ? validateResult : callback(validateResult);
  } catch (e) {
    return callback === undefined ? e : callback(e);
  }
}

Object.assign(Validator, {
  test: tester
});
var validator = Validator;
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

function validateTypes(arg, validatorArray) {
  var valLength = validatorArray.length;

  if (valLength === 0 || !isArray$1(validatorArray)) {
    throw new Error('Must include some validators');
  }

  var valsKey = validator.test(arg);
  var getValidators = [];
  var finalReduceArray = validatorArray.map(function (v) {
    getValidators.push(v.validator);
    return valsKey.includes(v.validator.substring(2)) ? 1 : 0;
  });
  var finalReduce = finalReduceArray.reduce(function (acc, cur) {
    return acc + cur;
  });

  if (finalReduce === 0) {
    throw new TypeError("One of [".concat(getValidators.concat(), "] has to pass, but we have your arg to be [").concat(_toConsumableArray(valsKey), "]"));
  }

  return true;
}

function validateTypesMatch(arg, validatorArray) {
  var valLength = validatorArray.length;

  if (valLength === 0 || !isArray$1(validatorArray)) {
    throw new Error('Must include some validators');
  }

  var valsKey = validator.test(arg);
  var getValidators = [];
  var finalReduceArray = validatorArray.map(function (v) {
    getValidators.push(v.validator);
    return valsKey.includes(v.validator.substring(2)) ? 1 : 0;
  });
  var finalReduce = finalReduceArray.reduce(function (acc, cur) {
    return acc + cur;
  });

  if (finalReduce < valLength || finalReduce === 0) {
    throw new TypeError("All of [".concat(getValidators.concat(), "] has to pass, but we have your arg to be [").concat(_toConsumableArray(valsKey), "]"));
  }

  return true;
}

exports.isNumber = isNumber$1;
exports.isInt = isInt$1;
exports.isString = isString$1;
exports.isBoolean = isBoolean$1;
exports.isArray = isArray$1;
exports.isJson = isJson$1;
exports.isObject = isObject$1;
exports.isFunction = isFunction$1;
exports.isHash = isHash$1;
exports.isUrl = isUrl$1;
exports.isPubkey = isPubkey$1;
exports.isPrivateKey = isPrivateKey$1;
exports.isAddress = isAddress$1;
exports.isBN = isBN;
exports.isHex = isHex$1;
exports.isNull = isNull$1;
exports.isUndefined = isUndefined$1;
exports.validator = validator;
exports.validateArgs = validateArgs;
exports.validateTypes = validateTypes;
exports.validateTypesMatch = validateTypesMatch;
exports.validateFunctionArgs = validateFunctionArgs;
exports.extractValidator = extractValidator;
exports.intToByteArray = intToByteArray;
exports.toHex = toHex;
exports.toUtf8 = toUtf8;
exports.toAscii = toAscii;
exports.toBN = toBN;
exports.hexToNumber = hexToNumber;
exports.utf8ToHex = utf8ToHex;
exports.numberToHex = numberToHex;
exports.fromUtf8 = fromUtf8;
exports.fromAscii = fromAscii;
exports.padLeft = padLeft;
exports.padRight = padRight;
exports.strip0x = strip0x;
exports.add0x = add0x;
