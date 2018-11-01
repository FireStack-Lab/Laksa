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
}
/**
 * @function {toPayload}
 * @param  {string} method {RPC method}
 * @param  {Array<object>} params {params that send to RPC}
 * @return {object} {payload object}
 */
;

/**
 * @function getResultForData
 * @param  {object} data {object get from provider}
 * @return {object} {data result or data}
 */

function getResultForData(data) {
  if (data.result) {
    return data.result;
  }

  return data;
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

                _this.provider.middleware.response.use(getResultForData);

                _context.next = 6;
                return _this.provider.send(payload);

              case 6:
                result = _context.sent;
                return _context.abrupt("return", result);

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](1);
                throw new Error(_context.t0);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 10]]);
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
  /**
   * @function {send}
   * @param  {object} data {data object with method and params}
   * @return {object|Error} {result from provider}
   */


  _createClass(Messanger, [{
    key: "sendAsync",

    /**
     * @function {sendAsync}
     * @param  {object} data {data object with method and params}
     * @param  {any} callback {callback function}
     * @return {any} {callback function execution}
     */
    value: function sendAsync(data, callback) {
      this.providerCheck();
      var payload = this.JsonRpc.toPayload(data.method, data.params);
      this.provider.middleware.response.use(getResultForData);
      this.provider.send(payload,
      /*#__PURE__*/
      function () {
        var _ref3 = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee3(err, result) {
          var errors, promiseResult;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(err || result.error)) {
                    _context3.next = 3;
                    break;
                  }

                  errors = err || result.error;
                  return _context3.abrupt("return", callback(errors));

                case 3:
                  _context3.next = 5;
                  return result;

                case 5:
                  promiseResult = _context3.sent;
                  callback(null, promiseResult);

                case 7:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        return function (_x4, _x5) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
    /**
     * @function {sendBatch}
     * @param  {object} data {data object with method and params}
     * @param  {any} callback {callback function}
     * @return {any} {callback function execution}
     */

  }, {
    key: "sendBatch",
    value: function sendBatch(data, callback) {
      this.providerCheck();
      var payload = this.JsonRpc.toBatchPayload(data);
      this.provider.send(payload,
      /*#__PURE__*/
      function () {
        var _ref4 = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee4(err, results) {
          var promiseResult;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  if (!err) {
                    _context4.next = 2;
                    break;
                  }

                  return _context4.abrupt("return", callback(err));

                case 2:
                  _context4.next = 4;
                  return results;

                case 4:
                  promiseResult = _context4.sent;
                  callback(null, promiseResult);

                case 6:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        return function (_x6, _x7) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
    /**
     * @function {sendServer}
     * @param  {string} endpoint {endpoint that point to server}
     * @param  {object} data     {data object with method and params}
     * @return {object|Error} {result from provider}
     */

  }, {
    key: "sendAsyncServer",

    /**
     * @function {sendAsyncServer}
     * @param  {string} endpoint {endpoint that point to server}
     * @param  {object} data     {data object with method and params}
     * @param  {any} callback {callback function}
     * @return {any} {callback function execution}
     */
    value: function sendAsyncServer(endpoint, data, callback) {
      this.providerCheck();
      this.scillaProvider.sendServer(endpoint, data,
      /*#__PURE__*/
      function () {
        var _ref5 = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee5(err, result) {
          var errors, promiseResult;
          return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (!(err || result.error)) {
                    _context5.next = 3;
                    break;
                  }

                  errors = err || result.error;
                  return _context5.abrupt("return", callback(errors));

                case 3:
                  _context5.next = 5;
                  return result;

                case 5:
                  promiseResult = _context5.sent;
                  callback(null, promiseResult);

                case 7:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        return function (_x8, _x9) {
          return _ref5.apply(this, arguments);
        };
      }());
    }
    /**
     * @function {sendBatchServer}
     * @param  {string} endpoint {endpoint that point to server}
     * @param  {object} data     {data object with method and params}
     * @param  {any} callback {callback function}
     * @return {any} {callback function execution}
     */

  }, {
    key: "sendBatchServer",
    value: function sendBatchServer(endpoint, data, callback) {
      this.providerCheck();
      this.scillaProvider.sendServer(endpoint, data,
      /*#__PURE__*/
      function () {
        var _ref6 = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee6(err, results) {
          var promiseResult;
          return _regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  if (!err) {
                    _context6.next = 2;
                    break;
                  }

                  return _context6.abrupt("return", callback(err));

                case 2:
                  _context6.next = 4;
                  return results;

                case 4:
                  promiseResult = _context6.sent;
                  callback(null, promiseResult);

                case 6:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        return function (_x10, _x11) {
          return _ref6.apply(this, arguments);
        };
      }());
    }
    /**
     * @function {setProvider}
     * @param  {Provider} provider {provider instance}
     * @return {Provider} {provider setter}
     */

  }, {
    key: "setProvider",
    value: function setProvider(provider) {
      this.provider = provider;
    }
    /**
     * @function {setScillaProvider}
     * @param  {Provider} provider {provider instance}
     * @return {Provider} {provider setter}
     */

  }, {
    key: "setScillaProvider",
    value: function setScillaProvider(provider) {
      this.scillaProvider = provider;
    }
    /**
     * @function {providerCheck}
     * @return {Error|null} {provider validator}
     */

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

exports.Messenger = Messanger;
exports.JsonRpc = JsonRpc;
