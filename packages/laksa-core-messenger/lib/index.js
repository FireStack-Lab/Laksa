'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
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

function getResultForData(data) {
  return data.error ? data.error : data.message ? data : data.result;
}

var Messanger =
/*#__PURE__*/
function () {
  function Messanger(provider) {
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

                _context.prev = 1;
                payload = _this.JsonRpc.toPayload(data.method, data.params);
                _context.next = 5;
                return _this.provider.send(payload);

              case 5:
                result = _context.sent;
                return _context.abrupt("return", getResultForData(result));

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](1);
                throw new Error(_context.t0);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 9]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

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

                _context2.prev = 1;
                _context2.next = 4;
                return _this.scillaProvider.sendServer(endpoint, data);

              case 4:
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                throw new Error(_context2.t0);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 8]]);
      }));

      return function (_x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    }());

    this.provider = provider;
    this.scillaProvider = provider;
    this.JsonRpc = new JsonRpc();
  }

  _createClass(Messanger, [{
    key: "sendAsync",
    value: function sendAsync(data, callback) {
      this.providerCheck();
      var payload = this.JsonRpc.toPayload(data.method, data.params);
      this.provider.sendAsync(payload, function (err, result) {
        if (err || result.error) {
          var errors = err || result.error;
          return callback(errors);
        }

        callback(null, getResultForData(result));
      });
    }
  }, {
    key: "sendBatch",
    value: function sendBatch(data, callback) {
      this.providerCheck();
      var payload = this.JsonRpc.toBatchPayload(data);
      this.provider.sendAsync(payload, function (err, results) {
        if (err) {
          return callback(err);
        }

        callback(null, results);
      });
    }
  }, {
    key: "sendAsyncServer",
    value: function sendAsyncServer(endpoint, data, callback) {
      this.providerCheck();
      this.scillaProvider.sendAsyncServer(endpoint, data, function (err, result) {
        if (err || result.error) {
          var errors = err || result.error;
          return callback(errors);
        }

        callback(null, result);
      });
    }
  }, {
    key: "sendBatchServer",
    value: function sendBatchServer(data, callback) {
      this.providerCheck();
      this.scillaProvider.sendAsync(data, function (err, results) {
        if (err) {
          return callback(err);
        }

        callback(null, results);
      });
    }
  }, {
    key: "setProvider",
    value: function setProvider(provider) {
      this.provider = provider;
    }
  }, {
    key: "setScillaProvider",
    value: function setScillaProvider(provider) {
      this.scillaProvider = provider;
    }
  }, {
    key: "providerCheck",
    value: function providerCheck() {
      if (!this.provider) {
        laksaShared.InvalidProvider();
        return null;
      }
    }
  }]);

  return Messanger;
}();

exports.JsonRpc = JsonRpc;
exports.Messenger = Messanger;
