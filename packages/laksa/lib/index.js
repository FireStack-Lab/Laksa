"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Laksa = _interopRequireWildcard(require("laksa-core"));

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Laksa === 'undefined') {
  window.Laksa = Laksa;
}

var _default = Laksa;
exports.default = _default;
module.exports = exports.default;