'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var laksaShared = require('laksa-shared');

var JsonRpc = function JsonRpc() {
  var _this = this;

  _classCallCheck(this, JsonRpc);

  _defineProperty(this, "toPayload", function (method, params) {
    // FIXME: error to be done by shared/errors
    if (!method) throw new Error('jsonrpc method should be specified!'); // advance message ID

    _this.messageId += 1;
    return {
      jsonrpc: '2.0',
      id: _this.messageId,
      method: method,
      params: params || []
    };
  });

  _defineProperty(this, "toBatchPayload", function (messages) {
    return messages.map(function (message) {
      return _this.toPayload(message.method, message.params);
    });
  });

  this.messageId = 0;
};

var Messanger = function Messanger(_provider) {
  var _this = this;

  _classCallCheck(this, Messanger);

  _defineProperty(this, "send",
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(data) {
      var payload, result;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.providerCheck();

              payload = _this.JsonRpc.toPayload(data.method, data.params);
              _context.next = 4;
              return _this.provider.send(payload);

            case 4:
              result = _context.sent;
              return _context.abrupt("return", result);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  _defineProperty(this, "sendAsync", function (data, callback) {
    _this.providerCheck();

    var payload = _this.JsonRpc.toPayload(data.method, data.params);

    _this.provider.sendAsync(payload, function (err, result) {
      if (err) {
        return callback(err);
      }

      callback(null, result);
    });
  });

  _defineProperty(this, "sendBatch", function (data, callback) {
    _this.providerCheck();

    var payload = _this.JsonRpc.toBatchPayload(data);

    _this.provider.sendAsync(payload, function (err, results) {
      if (err) {
        return callback(err);
      }

      callback(null, results);
    });
  });

  _defineProperty(this, "sendServer",
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee2(endpoint, data) {
      var result;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _this.providerCheck();

              _context2.next = 3;
              return _this.provider.sendServer(endpoint, data);

            case 3:
              result = _context2.sent;
              return _context2.abrupt("return", result);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }());

  _defineProperty(this, "sendAsyncServer", function (endpoint, data, callback) {
    _this.providerCheck();

    _this.provider.sendAsyncServer(endpoint, data, function (err, result) {
      if (err) {
        return callback(err);
      }

      callback(null, result);
    });
  });

  _defineProperty(this, "sendBatchServer", function (data, callback) {
    _this.providerCheck();

    _this.provider.sendAsync(data, function (err, results) {
      if (err) {
        return callback(err);
      }

      callback(null, results);
    });
  });

  _defineProperty(this, "setProvider", function (provider) {
    _this.provider = provider;
  });

  _defineProperty(this, "providerCheck", function () {
    if (!_this.provider) {
      laksaShared.InvalidProvider();
      return null;
    }
  });

  this.provider = _provider;
  this.JsonRpc = new JsonRpc();
};

exports.JsonRpc = JsonRpc;
exports.Messenger = Messanger;
