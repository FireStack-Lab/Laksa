"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var JsonRpc = function JsonRpc() {
  var _this = this;

  (0, _classCallCheck2.default)(this, JsonRpc);
  (0, _defineProperty2.default)(this, "toPayload", function (method, params) {
    if (!method) console.error('jsonrpc method should be specified!'); // advance message ID

    _this.messageId += 1;
    return {
      jsonrpc: '2.0',
      id: _this.messageId,
      method: method,
      params: params || []
    };
  });
  (0, _defineProperty2.default)(this, "toBatchPayload", function (messages) {
    return messages.map(function (message) {
      return _this.toPayload(message.method, message.params);
    });
  });
  this.messageId = 0;
};

var _default = JsonRpc;
exports.default = _default;
module.exports = exports.default;