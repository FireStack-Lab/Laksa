/**
 * This source code is being disclosed to you solely for the purpose of your participation in
 * testing Zilliqa and Laksa. You may view, compile and run the code for that purpose and pursuant to
 * the protocols and algorithms that are programmed into, and intended by, the code. You may
 * not do anything else with the code without express permission from Zilliqa Research Pte. Ltd.,
 * including modifying or publishing the code (or any part of it), and developing or forming
 * another public or private blockchain network. This source code is provided ‘as is’ and no
 * warranties are given as to title or non-infringement, merchantability or fitness for purpose
 * and, to the extent permitted by law, all liability for your use of the code is disclaimed.
 * Some programs in this code are governed by the GNU General Public License v3.0 (available at
 * https://www.gnu.org/licenses/gpl-3.0.en.html) (‘GPLv3’). The programs that are governed by
 * GPLv3.0 are those programs that are located in the folders src/depends and tests/depends
 * and which include a reference to GPLv3 in their program files.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.replace');
require('core-js/modules/es6.regexp.match');
var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
require('core-js/modules/es6.number.constructor');
require('core-js/modules/es6.number.is-integer');
var validUrl = require('valid-url');
var BN = require('bn.js');
var BN__default = _interopDefault(BN);
var Long = _interopDefault(require('long'));
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
require('core-js/modules/es7.array.includes');
require('core-js/modules/es6.string.includes');
require('core-js/modules/es6.object.assign');
require('core-js/modules/es7.object.values');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _slicedToArray = _interopDefault(require('@babel/runtime/helpers/slicedToArray'));
require('core-js/modules/es6.regexp.split');
require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/es6.map');
require('core-js/modules/es6.object.freeze');

var isLong = Long.isLong;
/**
 * [isNumber verify param is a Number]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isNumber = function isNumber(obj) {
  return obj === +obj;
};
/**
 * [isNumber verify param is a Number]
 * @param  {type}  obj [value]
 * @return {boolean}     [boolean]
 */


var isInt = function isInt(obj) {
  return isNumber(obj) && Number.isInteger(obj);
};
/**
 * [isString verify param is a String]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isString = function isString(obj) {
  return obj === "".concat(obj);
};
/**
 * [isBoolean verify param is a Boolean]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isBoolean = function isBoolean(obj) {
  return obj === !!obj;
};
/**
 * [isArray verify param input is an Array]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isArray = function isArray(obj) {
  return Array.isArray(obj);
};
/**
 * [isJson verify param input is a Json]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isJsonString = function isJsonString(obj) {
  try {
    return !!JSON.parse(obj) && isObject(JSON.parse(obj));
  } catch (e) {
    return false;
  }
};
/**
 * [isObject verify param is an Object]
 * @param  {type}  obj [value]
 * @return {Boolean}     [boolean]
 */


var isObject = function isObject(obj) {
  return obj !== null && !Array.isArray(obj) && _typeof(obj) === 'object';
};
/**
 * [isFunction verify param is a Function]
 * @param  {type}  obj [value]
 * @return {Boolean}     [description]
 */


var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
};
/**
 * verify if param is correct
 * @param  {hex|string}  address [description]
 * @return {Boolean}         [description]
 */


var isAddress = function isAddress(address) {
  return isByteString(address, 40);
};

var isPrivateKey = function isPrivateKey(privateKey) {
  return isByteString(privateKey, 64);
};

var isPubkey = function isPubkey(pubKey) {
  return isByteString(pubKey, 66);
};

var isSignature = function isSignature(sig) {
  return isByteString(sig, 128);
};

var isByteString = function isByteString(str, len) {
  if (!isString(str)) return false;
  return !!str.replace('0x', '').match("^[0-9a-fA-F]{".concat(len, "}$"));
};
/**
 * verify if url is correct
 * @param  {string}  url [description]
 * @return {Boolean}     [description]
 */


var isUrl = function isUrl(url) {
  if (isString(url)) {
    return !!validUrl.isWebUri(url);
  }

  return false;
};
/**
 * verify if hash is correct
 * @param  {string}  txHash [description]
 * @return {Boolean}        [description]
 */


var isHash = function isHash(txHash) {
  return /^[0-9a-fA-F]{64}$/.test(txHash);
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
 * @param  {type}  obj [description]
 * @return {Boolean}     [description]
 */


var isNull = function isNull(obj) {
  return obj === null;
};
/**
 * check object is undefined
 * @param  {type}  obj [description]
 * @return {Boolean}     [description]
 */


var isUndefined = function isUndefined(obj) {
  return obj === undefined;
};
/**
 * check object is undefined
 * @param  {type}  obj [description]
 * @return {Boolean}     [description]
 */


var isUint = function isUint(obj) {
  return isInt(obj) && obj >= 0;
};
/**
 * [isByStrX description]
 * @param  {type}  obj [description]
 * @return {Boolean}     [description]
 */


var isByStrX = function isByStrX(obj) {
  return /^0x[A-F0-9]{20,65}$/i.test(obj);
};

var validators = /*#__PURE__*/Object.freeze({
  isNumber: isNumber,
  isInt: isInt,
  isString: isString,
  isBoolean: isBoolean,
  isArray: isArray,
  isJsonString: isJsonString,
  isObject: isObject,
  isUint: isUint,
  isFunction: isFunction,
  isHash: isHash,
  isUrl: isUrl,
  isPubkey: isPubkey,
  isPrivateKey: isPrivateKey,
  isSignature: isSignature,
  isAddress: isAddress,
  isBN: BN.isBN,
  isLong: isLong,
  isHex: isHex,
  isByStrX: isByStrX,
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
      },
      required: function required(obj) {
        return [valFunc(obj), 'required', valName];
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
    isJsonString$1 = valArray.isJsonString,
    isObject$1 = valArray.isObject,
    isUint$1 = valArray.isUint,
    isFunction$1 = valArray.isFunction,
    isHash$1 = valArray.isHash,
    isUrl$1 = valArray.isUrl,
    isPubkey$1 = valArray.isPubkey,
    isPrivateKey$1 = valArray.isPrivateKey,
    isAddress$1 = valArray.isAddress,
    isSignature$1 = valArray.isSignature,
    isBN = valArray.isBN,
    isLong$1 = valArray.isLong,
    isHex$1 = valArray.isHex,
    isByStrX$1 = valArray.isByStrX,
    isNull$1 = valArray.isNull,
    isUndefined$1 = valArray.isUndefined;
/**
 * [Validator description]
 * @param       {type} stringToTest    [description]
 * @param       {type} validatorString [description]
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
 * @param  {type} args         [description]
 * @param  {type} requiredArgs [description]
 * @param  {type} optionalArgs [description]
 * @return {type}              [description]
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

var toBN = function toBN(data) {
  try {
    return new BN__default(data);
  } catch (e) {
    throw new Error("".concat(e, " of \"").concat(data, "\""));
  } // to be implemented

};

var toLong = function toLong(data) {
  try {
    if (isString$1(data)) {
      return Long.fromString(data);
    } else if (isNumber$1(data)) {
      return Long.fromNumber(data);
    }
  } catch (e) {
    throw new Error("".concat(e, " of \"").concat(data, "\""));
  } // to be implemented

};

var strip0x = function strip0x(value) {
  if (!isString$1(value)) throw new Error('value has to be String');
  return "".concat(value.replace(/^0x/i, ''));
};
/**
 * [add an '0x' prefix to value]
 * @param  {String|Number|Hex|BN} value [description]
 * @return {String}       [description]
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
 * pack
 *
 * Takes two 16-bit integers and combines them. Used to compute version.
 *
 * @param {number} a
 * @param {number} b
 *
 * @returns {number} - a 32-bit number
 */


var pack = function pack(a, b) {
  if (!isNumber$1(a) || !isNumber$1(b)) {
    throw new Error('a and b must be number');
  }

  if (a >> 16 > 0 || b >> 16 > 0) {
    throw new Error('Both a and b must be 16 bits or less');
  }

  return (a << 16) + b;
};

var Units = Object.freeze({
  Zil: 'zil',
  Li: 'li',
  Qa: 'qa'
});
var DEFAULT_OPTIONS = {
  pad: false
};
var unitMap = new Map([[Units.Qa, '1'], [Units.Li, '1000000'], // 1e6 qa
[Units.Zil, '1000000000000'] // 1e12 qa
]);
var numToStr = function numToStr(input) {
  if (typeof input === 'string') {
    if (!input.match(/^-?[0-9.]+$/)) {
      throw new Error("while converting number to string, invalid number value '".concat(input, "', should be a number matching (^-?[0-9.]+)."));
    }

    return input;
  } else if (typeof input === 'number') {
    return String(input);
  } else if (BN__default.isBN(input)) {
    return input.toString(10);
  }

  throw new Error("while converting number to string, invalid number value '".concat(input, "' type ").concat(_typeof(input), "."));
};
var fromQa = function fromQa(qa, unit) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTIONS;
  var qaBN = qa;

  if (!isBN(qa)) {
    try {
      qaBN = new BN__default(qa);
    } catch (error) {
      throw Error(error);
    }
  }

  if (unit === 'qa') {
    return qaBN.toString(10);
  }

  var baseStr = unitMap.get(unit);

  if (!baseStr) {
    throw new Error("No unit of type ".concat(unit, " exists."));
  }

  var base = new BN__default(baseStr, 10);
  var baseNumDecimals = baseStr.length - 1;
  var fraction = qaBN.abs().mod(base).toString(10); // prepend 0s to the fraction half

  while (fraction.length < baseNumDecimals) {
    fraction = "0".concat(fraction);
  }

  if (!options.pad) {
    /* eslint-disable prefer-destructuring */
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  }

  var whole = qaBN.div(base).toString(10);
  return fraction === '0' ? "".concat(whole) : "".concat(whole, ".").concat(fraction);
};
var toQa = function toQa(input, unit) {
  var inputStr = numToStr(input);
  var baseStr = unitMap.get(unit);

  if (!baseStr) {
    throw new Error("No unit of type ".concat(unit, " exists."));
  }

  var baseNumDecimals = baseStr.length - 1;
  var base = new BN__default(baseStr, 10); // Is it negative?

  var isNegative = inputStr.substring(0, 1) === '-';

  if (isNegative) {
    inputStr = inputStr.substring(1);
  }

  if (inputStr === '.') {
    throw new Error("Cannot convert ".concat(inputStr, " to Qa."));
  } // Split it into a whole and fractional part


  var comps = inputStr.split('.'); // eslint-disable-line

  if (comps.length > 2) {
    throw new Error("Cannot convert ".concat(inputStr, " to Qa."));
  }

  var _comps = _slicedToArray(comps, 2),
      whole = _comps[0],
      fraction = _comps[1];

  if (!whole) {
    whole = '0';
  }

  if (!fraction) {
    fraction = '0';
  }

  if (fraction.length > baseNumDecimals) {
    throw new Error("Cannot convert ".concat(inputStr, " to Qa."));
  }

  while (fraction.length < baseNumDecimals) {
    fraction += '0';
  }

  var wholeBN = new BN__default(whole);
  var fractionBN = new BN__default(fraction);
  var wei = wholeBN.mul(base).add(fractionBN);

  if (isNegative) {
    wei = wei.neg();
  }

  return new BN__default(wei.toString(10), 10);
};
var Unit =
/*#__PURE__*/
function () {
  _createClass(Unit, null, [{
    key: "from",
    value: function from(str) {
      return new Unit(str);
    }
  }, {
    key: "Zil",
    value: function Zil(str) {
      return new Unit(str).asZil();
    }
  }, {
    key: "Li",
    value: function Li(str) {
      return new Unit(str).asLi();
    }
  }, {
    key: "Qa",
    value: function Qa(str) {
      return new Unit(str).asQa();
    }
  }]);

  function Unit(str) {
    _classCallCheck(this, Unit);

    this.unit = str;
  }

  _createClass(Unit, [{
    key: "asZil",
    value: function asZil() {
      this.qa = toQa(this.unit, Units.Zil);
      return this;
    }
  }, {
    key: "asLi",
    value: function asLi() {
      this.qa = toQa(this.unit, Units.Li);
      return this;
    }
  }, {
    key: "asQa",
    value: function asQa() {
      this.qa = new BN__default(this.unit);
      return this;
    }
  }, {
    key: "toQa",
    value: function toQa() {
      return this.qa;
    }
  }, {
    key: "toLi",
    value: function toLi() {
      return fromQa(this.qa, Units.Li);
    }
  }, {
    key: "toZil",
    value: function toZil() {
      return fromQa(this.qa, Units.Zil);
    }
  }, {
    key: "toQaString",
    value: function toQaString() {
      return this.qa.toString();
    }
  }]);

  return Unit;
}();

exports.BN = BN__default;
exports.Long = Long;
exports.isNumber = isNumber$1;
exports.isInt = isInt$1;
exports.isString = isString$1;
exports.isBoolean = isBoolean$1;
exports.isArray = isArray$1;
exports.isJsonString = isJsonString$1;
exports.isObject = isObject$1;
exports.isUint = isUint$1;
exports.isFunction = isFunction$1;
exports.isHash = isHash$1;
exports.isUrl = isUrl$1;
exports.isPubkey = isPubkey$1;
exports.isPrivateKey = isPrivateKey$1;
exports.isAddress = isAddress$1;
exports.isSignature = isSignature$1;
exports.isBN = isBN;
exports.isLong = isLong$1;
exports.isHex = isHex$1;
exports.isByStrX = isByStrX$1;
exports.isNull = isNull$1;
exports.isUndefined = isUndefined$1;
exports.validator = validator;
exports.validateArgs = validateArgs;
exports.validateTypes = validateTypes;
exports.validateTypesMatch = validateTypesMatch;
exports.validateFunctionArgs = validateFunctionArgs;
exports.extractValidator = extractValidator;
exports.toBN = toBN;
exports.toLong = toLong;
exports.strip0x = strip0x;
exports.add0x = add0x;
exports.pack = pack;
exports.Units = Units;
exports.unitMap = unitMap;
exports.numToStr = numToStr;
exports.fromQa = fromQa;
exports.toQa = toQa;
exports.Unit = Unit;
