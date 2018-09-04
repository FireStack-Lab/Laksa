"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.padRight = exports.padLeft = exports.toNumber = exports.toBN = exports.fromAscii = exports.fromUtf8 = exports.toAscii = exports.toUtf8 = exports.toHex = exports.intToByteArray = void 0;

var _numberToBn = _interopRequireDefault(require("number-to-bn"));

// import BN from 'bn.js'

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

exports.intToByteArray = intToByteArray;

var toHex = function toHex() {// to be implemented
};

exports.toHex = toHex;

var toUtf8 = function toUtf8() {// to utf 8
};

exports.toUtf8 = toUtf8;

var toAscii = function toAscii() {// to be implemented
};

exports.toAscii = toAscii;

var fromUtf8 = function fromUtf8() {// to be implemented
};

exports.fromUtf8 = fromUtf8;

var fromAscii = function fromAscii() {// to be implemented
};

exports.fromAscii = fromAscii;

var toBN = function toBN(data) {
  try {
    return (0, _numberToBn.default)(data);
  } catch (e) {
    throw new Error("".concat(e, " of \"").concat(data, "\""));
  } // to be implemented

};

exports.toBN = toBN;

var toNumber = function toNumber() {} // to be implemented

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

exports.toNumber = toNumber;

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


exports.padLeft = padLeft;

var padRight = function padRight(string, chars, sign) {
  return string + new Array(chars - string.length + 1).join(sign || '0');
};

exports.padRight = padRight;