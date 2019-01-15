(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('valid-url'), require('bn.js'), require('long')) :
  typeof define === 'function' && define.amd ? define(['exports', 'valid-url', 'bn.js', 'long'], factory) :
  (factory((global.Laksa = {}),global.validUrl,global.BN,global.Long));
}(this, (function (exports,validUrl,BN,Long) { 'use strict';

  var BN__default = 'default' in BN ? BN['default'] : BN;
  Long = Long && Long.hasOwnProperty('default') ? Long['default'] : Long;

  const {
    isLong
  } = Long;
  /**
   * [isNumber verify param is a Number]
   * @param  {type}  obj [value]
   * @return {Boolean}     [boolean]
   */

  const isNumber = obj => {
    return obj === +obj;
  };
  /**
   * [isNumber verify param is a Number]
   * @param  {type}  obj [value]
   * @return {boolean}     [boolean]
   */


  const isInt = obj => {
    return isNumber(obj) && Number.isInteger(obj);
  };
  /**
   * [isString verify param is a String]
   * @param  {type}  obj [value]
   * @return {Boolean}     [boolean]
   */


  const isString = obj => {
    return obj === `${obj}`;
  };
  /**
   * [isBoolean verify param is a Boolean]
   * @param  {type}  obj [value]
   * @return {Boolean}     [boolean]
   */


  const isBoolean = obj => {
    return obj === !!obj;
  };
  /**
   * [isArray verify param input is an Array]
   * @param  {type}  obj [value]
   * @return {Boolean}     [boolean]
   */


  const isArray = obj => {
    return Array.isArray(obj);
  };
  /**
   * [isJson verify param input is a Json]
   * @param  {type}  obj [value]
   * @return {Boolean}     [boolean]
   */


  const isJsonString = obj => {
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


  const isObject = obj => {
    return obj !== null && !Array.isArray(obj) && typeof obj === 'object';
  };
  /**
   * [isFunction verify param is a Function]
   * @param  {type}  obj [value]
   * @return {Boolean}     [description]
   */


  const isFunction = obj => {
    return typeof obj === 'function';
  };
  /**
   * verify if param is correct
   * @param  {hex|string}  address [description]
   * @return {Boolean}         [description]
   */


  const isAddress = address => {
    return isByteString(address, 40);
  };

  const isPrivateKey = privateKey => {
    return isByteString(privateKey, 64);
  };

  const isPubkey = pubKey => {
    return isByteString(pubKey, 66);
  };

  const isSignature = sig => {
    return isByteString(sig, 128);
  };

  const isByteString = (str, len) => {
    if (!isString(str)) return false;
    return !!str.replace('0x', '').match(`^[0-9a-fA-F]{${len}}$`);
  };
  /**
   * verify if url is correct
   * @param  {string}  url [description]
   * @return {Boolean}     [description]
   */


  const isUrl = url => {
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


  const isHash = txHash => {
    return /^[0-9a-fA-F]{64}$/.test(txHash);
  };
  /**
   * Check if string is HEX
   *
   * @method isHex
   * @param {String} hex to be checked
   * @returns {Boolean}
   */


  const isHex = hex => {
    return (isString(hex) || isNumber(hex)) && /^0x?[0-9a-f]*$/i.test(hex);
  };
  /**
   * check Object isNull
   * @param  {type}  obj [description]
   * @return {Boolean}     [description]
   */


  const isNull = obj => {
    return obj === null;
  };
  /**
   * check object is undefined
   * @param  {type}  obj [description]
   * @return {Boolean}     [description]
   */


  const isUndefined = obj => {
    return obj === undefined;
  };
  /**
   * check object is undefined
   * @param  {type}  obj [description]
   * @return {Boolean}     [description]
   */


  const isUint = obj => {
    return isInt(obj) && obj >= 0;
  };
  /**
   * [isByStrX description]
   * @param  {type}  obj [description]
   * @return {Boolean}     [description]
   */


  const isByStrX = obj => {
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
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    const newArray = keys.map((k, index) => {
      const Obj = {};
      Obj[k] = values[index];
      return Obj;
    });
    return newArray;
  }

  function injectValidator(func) {
    if (typeof func === 'object' && func !== undefined) {
      const valName = Object.keys(func)[0];
      const valFunc = Object.values(func)[0];
      return Object.assign(valFunc, {
        validator: valName,
        test: obj => valFunc(obj),
        required: obj => [valFunc(obj), 'required', valName]
      });
    } else return false;
  }

  function extractValidator(vals) {
    const newValidator = [];
    const newArr = objToArray(vals);
    newArr.forEach((v, index) => {
      const newV = injectValidator(v);
      const validatorString = newV.validator;
      newValidator[validatorString] = newV;
      newValidator[index] = newV;
    });
    return newValidator;
  }

  const valArray = extractValidator(validators);
  const {
    isNumber: isNumber$1,
    isInt: isInt$1,
    isString: isString$1,
    isBoolean: isBoolean$1,
    isArray: isArray$1,
    isJsonString: isJsonString$1,
    isObject: isObject$1,
    isUint: isUint$1,
    isFunction: isFunction$1,
    isHash: isHash$1,
    isUrl: isUrl$1,
    isPubkey: isPubkey$1,
    isPrivateKey: isPrivateKey$1,
    isAddress: isAddress$1,
    isSignature: isSignature$1,
    isBN,
    isLong: isLong$1,
    isHex: isHex$1,
    isByStrX: isByStrX$1,
    isNull: isNull$1,
    isUndefined: isUndefined$1
  } = valArray;
  /**
   * [Validator description]
   * @param       {type} stringToTest    [description]
   * @param       {type} validatorString [description]
   * @constructor
   */

  function Validator(stringToTest, validatorString) {
    if (typeof validatorString === 'string' && valArray[`is${validatorString}`] !== undefined) {
      return valArray[`is${validatorString}`].test(stringToTest);
    } else if (typeof validatorString === 'function') {
      return validatorString(stringToTest);
    } else {
      throw new Error(`validator not found :${validatorString}`);
    }
  }

  function tester(value, callback) {
    try {
      const validateResult = valArray.map(func => {
        return func.test(value) ? func.validator.substring(2) : false;
      }).filter(d => d !== false);
      return callback === undefined ? validateResult : callback(validateResult);
    } catch (e) {
      return callback === undefined ? e : callback(e);
    }
  }

  Object.assign(Validator, {
    test: tester
  });
  const validator = Validator;
  /**
   * make sure each of the keys in requiredArgs is present in args
   * @param  {type} args         [description]
   * @param  {type} requiredArgs [description]
   * @param  {type} optionalArgs [description]
   * @return {type}              [description]
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

  function validateTypes(arg, validatorArray) {
    const valLength = validatorArray.length;

    if (valLength === 0 || !isArray$1(validatorArray)) {
      throw new Error('Must include some validators');
    }

    const valsKey = validator.test(arg);
    const getValidators = [];
    const finalReduceArray = validatorArray.map(v => {
      getValidators.push(v.validator);
      return valsKey.includes(v.validator.substring(2)) ? 1 : 0;
    });
    const finalReduce = finalReduceArray.reduce((acc, cur) => acc + cur);

    if (finalReduce === 0) {
      throw new TypeError(`One of [${[...getValidators]}] has to pass, but we have your arg to be [${[...valsKey]}]`);
    }

    return true;
  }

  function validateTypesMatch(arg, validatorArray) {
    const valLength = validatorArray.length;

    if (valLength === 0 || !isArray$1(validatorArray)) {
      throw new Error('Must include some validators');
    }

    const valsKey = validator.test(arg);
    const getValidators = [];
    const finalReduceArray = validatorArray.map(v => {
      getValidators.push(v.validator);
      return valsKey.includes(v.validator.substring(2)) ? 1 : 0;
    });
    const finalReduce = finalReduceArray.reduce((acc, cur) => acc + cur);

    if (finalReduce < valLength || finalReduce === 0) {
      throw new TypeError(`All of [${[...getValidators]}] has to pass, but we have your arg to be [${[...valsKey]}]`);
    }

    return true;
  }

  const toBN = data => {
    try {
      return new BN__default(data);
    } catch (e) {
      throw new Error(`${e} of "${data}"`);
    } // to be implemented

  };

  const toLong = data => {
    try {
      if (isString$1(data)) {
        return Long.fromString(data);
      } else if (isNumber$1(data)) {
        return Long.fromNumber(data);
      }
    } catch (e) {
      throw new Error(`${e} of "${data}"`);
    } // to be implemented

  };

  const strip0x = value => {
    if (!isString$1(value)) throw new Error('value has to be String');
    return `${value.replace(/^0x/i, '')}`;
  };
  /**
   * [add an '0x' prefix to value]
   * @param  {String|Number|Hex|BN} value [description]
   * @return {String}       [description]
   */


  const add0x = value => {
    validateTypes(value, [isString$1, isNumber$1, isHex$1, isBN]);
    let newString;

    if (!isString$1(value)) {
      newString = String(value);
      return `0x${newString.replace(/^0x/i, '')}`;
    }

    newString = `0x${value.replace(/^0x/i, '')}`;
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


  const pack = (a, b) => {
    if (!isNumber$1(a) || !isNumber$1(b)) {
      throw new Error('a and b must be number');
    }

    if (a >> 16 > 0 || b >> 16 > 0) {
      throw new Error('Both a and b must be 16 bits or less');
    }

    return (a << 16) + b;
  };

  /**
   * Adapted from https://github.com/ethjs/ethjs-unit/blob/master/src/index.js
   */
  const Units = Object.freeze({
    Zil: 'zil',
    Li: 'li',
    Qa: 'qa'
  });
  const DEFAULT_OPTIONS = {
    pad: false
  };
  const unitMap = new Map([[Units.Qa, '1'], [Units.Li, '1000000'], // 1e6 qa
  [Units.Zil, '1000000000000'] // 1e12 qa
  ]);
  const numToStr = input => {
    if (typeof input === 'string') {
      if (!input.match(/^-?[0-9.]+$/)) {
        throw new Error(`while converting number to string, invalid number value '${input}', should be a number matching (^-?[0-9.]+).`);
      }

      return input;
    } else if (typeof input === 'number') {
      return String(input);
    } else if (BN__default.isBN(input)) {
      return input.toString(10);
    }

    throw new Error(`while converting number to string, invalid number value '${input}' type ${typeof input}.`);
  };
  const fromQa = (qa, unit, options = DEFAULT_OPTIONS) => {
    let qaBN = qa;

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

    const baseStr = unitMap.get(unit);

    if (!baseStr) {
      throw new Error(`No unit of type ${unit} exists.`);
    }

    const base = new BN__default(baseStr, 10);
    const baseNumDecimals = baseStr.length - 1;
    let fraction = qaBN.abs().mod(base).toString(10); // prepend 0s to the fraction half

    while (fraction.length < baseNumDecimals) {
      fraction = `0${fraction}`;
    }

    if (!options.pad) {
      /* eslint-disable prefer-destructuring */
      fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
    }

    const whole = qaBN.div(base).toString(10);
    return fraction === '0' ? `${whole}` : `${whole}.${fraction}`;
  };
  const toQa = (input, unit) => {
    let inputStr = numToStr(input);
    const baseStr = unitMap.get(unit);

    if (!baseStr) {
      throw new Error(`No unit of type ${unit} exists.`);
    }

    const baseNumDecimals = baseStr.length - 1;
    const base = new BN__default(baseStr, 10); // Is it negative?

    const isNegative = inputStr.substring(0, 1) === '-';

    if (isNegative) {
      inputStr = inputStr.substring(1);
    }

    if (inputStr === '.') {
      throw new Error(`Cannot convert ${inputStr} to Qa.`);
    } // Split it into a whole and fractional part


    const comps = inputStr.split('.'); // eslint-disable-line

    if (comps.length > 2) {
      throw new Error(`Cannot convert ${inputStr} to Qa.`);
    }

    let [whole, fraction] = comps;

    if (!whole) {
      whole = '0';
    }

    if (!fraction) {
      fraction = '0';
    }

    if (fraction.length > baseNumDecimals) {
      throw new Error(`Cannot convert ${inputStr} to Qa.`);
    }

    while (fraction.length < baseNumDecimals) {
      fraction += '0';
    }

    const wholeBN = new BN__default(whole);
    const fractionBN = new BN__default(fraction);
    let wei = wholeBN.mul(base).add(fractionBN);

    if (isNegative) {
      wei = wei.neg();
    }

    return new BN__default(wei.toString(10), 10);
  };
  class Unit {
    static from(str) {
      return new Unit(str);
    }

    static Zil(str) {
      return new Unit(str).asZil();
    }

    static Li(str) {
      return new Unit(str).asLi();
    }

    static Qa(str) {
      return new Unit(str).asQa();
    }

    constructor(str) {
      this.unit = str;
    }

    asZil() {
      this.qa = toQa(this.unit, Units.Zil);
      return this;
    }

    asLi() {
      this.qa = toQa(this.unit, Units.Li);
      return this;
    }

    asQa() {
      this.qa = new BN__default(this.unit);
      return this;
    }

    toQa() {
      return this.qa;
    }

    toLi() {
      return fromQa(this.qa, Units.Li);
    }

    toZil() {
      return fromQa(this.qa, Units.Zil);
    }

    toQaString() {
      return this.qa.toString();
    }

  }

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

  Object.defineProperty(exports, '__esModule', { value: true });

})));
