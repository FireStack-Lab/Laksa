'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.function.name');
require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.map');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var axios = _interopDefault(require('axios'));
var Mitt = _interopDefault(require('mitt'));
require('core-js/modules/es6.object.assign');
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
var _slicedToArray = _interopDefault(require('@babel/runtime/helpers/slicedToArray'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var laksaCoreProvider = require('laksa-core-provider');

var AxiosProvider =
/*#__PURE__*/
function () {
  function AxiosProvider(url, timeout, user, password, headers) {
    var _this = this;

    _classCallCheck(this, AxiosProvider);

    _defineProperty(this, "subscribers", new Map());

    _defineProperty(this, "send",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(payload) {
        var result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.requestFunc({
                  payload: payload
                });

              case 2:
                result = _context.sent;
                return _context.abrupt("return", result);

              case 4:
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

    _defineProperty(this, "sendServer",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(endpoint, payload) {
        var result;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this.requestFunc({
                  endpoint: endpoint,
                  payload: payload
                });

              case 2:
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 4:
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

    _defineProperty(this, "subscribe", function (event, subscriber) {
      var subToken = Symbol('subToken');

      _this.subscribers.set(subToken, subscriber);

      return subToken;
    });

    _defineProperty(this, "unsubscribe", function (token) {
      if (_this.subscribers.has(token)) {
        _this.subscribers.delete(token);
      }
    });

    this.url = url || 'http://localhost:4200';
    this.timeout = timeout || 0;
    this.user = user || null;
    this.password = password || null;
    this.headers = headers;
    this.request = this.instance();
    this.broadcaster = new Mitt();
  }

  _createClass(AxiosProvider, [{
    key: "instance",
    value: function instance() {
      var request = axios.create();

      if (this.user && this.password) {
        var AUTH_TOKEN = "Basic ".concat(Buffer.from("".concat(this.user, ":").concat(this.password)).toString('base64'));
        request.defaults.headers.common.Authorization = AUTH_TOKEN;
      }

      request.defaults.headers.post['Content-Type'] = 'application/json';

      if (this.headers) {
        this.headers.forEach(function (header) {
          request.defaults.headers.post[header.name] = header.value;
        });
      }

      if (this.timeout) {
        request.defaults.timeout = this.timeout;
      }

      return request;
    }
  }, {
    key: "sendAsync",
    value: function sendAsync(payload, callback) {
      this.requestFunc({
        payload: payload,
        callback: callback
      });
    }
  }, {
    key: "sendAsyncServer",
    value: function sendAsyncServer(endpoint, payload, callback) {
      this.requestFunc({
        endpoint: endpoint,
        payload: payload,
        callback: callback
      });
    }
  }, {
    key: "requestFunc",
    value: function requestFunc(_ref3) {
      var endpoint = _ref3.endpoint,
          payload = _ref3.payload,
          callback = _ref3.callback;
      var dest = endpoint !== null && endpoint !== undefined ? "".concat(this.url).concat(endpoint) : this.url;
      return this.request.post(dest, JSON.stringify(payload)).then(function (response) {
        var data = response.data,
            status = response.status;

        if (data && status >= 200 && status < 400) {
          if (callback === undefined) {
            return data;
          } else {
            callback(null, data);
          }
        }
      }).catch(function (err) {
        if (callback === undefined) {
          return err;
        } else {
          callback(err);
        }
      });
    }
  }]);

  return AxiosProvider;
}();

var defaultOptions = {
  method: 'POST',
  timeout: 120000,
  user: null,
  password: null,
  headers: {
    'Content-Type': 'application/json'
  }
};

var ProtobufProvider =
/*#__PURE__*/
function (_BaseProvider) {
  _inherits(ProtobufProvider, _BaseProvider);

  function ProtobufProvider(url, options) {
    var _this;

    _classCallCheck(this, ProtobufProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProtobufProvider).call(this));
    _this.url = url || 'http://localhost:4200';

    if (options) {
      _this.options = {
        method: options.method || defaultOptions.method,
        timeout: options.timeout || defaultOptions.timeout,
        user: options.user || defaultOptions.user,
        password: options.password || defaultOptions.password,
        headers: options.headers || defaultOptions.headers
      };
    } else {
      _this.options = defaultOptions;
    }

    return _this;
  }
  /**
   * @function {send}
   * @param  {object} payload  {payload object}
   * @param  {function} callback {callback function}
   * @return {function} {to requestFunc}
   */


  _createClass(ProtobufProvider, [{
    key: "send",
    value: function send(payload, callback) {
      return this.requestFunc({
        payload: payload,
        callback: callback
      });
    }
    /**
     * @function {sendServer}
     * @param  {string} endpoint {endpoint to the server}
     * @param  {object} payload  {payload object}
     * @param  {function} callback {callback function}
     * @return {function} {to requestFunc}
     */

  }, {
    key: "sendServer",
    value: function sendServer(endpoint, payload, callback) {
      return this.requestFunc({
        endpoint: endpoint,
        payload: payload,
        callback: callback
      });
    }
    /**
     * @function {requestFunc}
     * @param  {string} endpoint {endpoint to the server}
     * @param  {object} payload  {payload object}
     * @param  {function} callback {callback function}
     * @return {function} {performRPC call from laksa-core-provider}
     */

  }, {
    key: "requestFunc",
    value: function requestFunc(_ref) {
      var _this2 = this;

      var endpoint = _ref.endpoint,
          payload = _ref.payload,
          callback = _ref.callback;

      var _this$getMiddleware = this.getMiddleware(payload.method),
          _this$getMiddleware2 = _slicedToArray(_this$getMiddleware, 2),
          tReq = _this$getMiddleware2[0],
          tRes = _this$getMiddleware2[1];

      var reqMiddleware = laksaCoreProvider.composeMiddleware.apply(void 0, _toConsumableArray(tReq).concat([function (obj) {
        return _this2.optionsHandler(obj);
      }, function (obj) {
        return _this2.endpointHandler(obj, endpoint);
      }, this.payloadHandler]));
      var resMiddleware = laksaCoreProvider.composeMiddleware.apply(void 0, [function (data) {
        return _this2.callbackHandler(data, callback);
      }].concat(_toConsumableArray(tRes)));
      var req = reqMiddleware(payload);
      return laksaCoreProvider.performRPC(req, resMiddleware);
    }
    /**
     * @function {payloadHandler}
     * @param  {object} payload {payload object}
     * @return {object} {to payload object}
     */

  }, {
    key: "payloadHandler",
    value: function payloadHandler(payload) {
      return {
        payload: payload
      };
    }
    /**
     * @function {endpointHandler}
     * @param  {object} obj      {payload object}
     * @param  {string} endpoint {add the endpoint to payload object}
     * @return {object} {assign a new object}
     */

  }, {
    key: "endpointHandler",
    value: function endpointHandler(obj, endpoint) {
      return Object.assign({}, obj, {
        url: endpoint !== null && endpoint !== undefined ? "".concat(this.url).concat(endpoint) : this.url
      });
    }
    /**
     * @function {optionsHandler}
     * @param  {object} obj {options object}
     * @return {object} {assign a new option object}
     */

  }, {
    key: "optionsHandler",
    value: function optionsHandler(obj) {
      if (this.options.user && this.options.password) {
        var AUTH_TOKEN = "Basic ".concat(Buffer.from("".concat(this.options.user, ":").concat(this.options.password)).toString('base64'));
        this.options.headers.Authorization = AUTH_TOKEN;
      }

      return Object.assign({}, obj, {
        options: this.options
      });
    }
    /**
     * @function {callbackHandler}
     * @param  {object} data {from server}
     * @param  {function} cb   {callback function}
     * @return {object|function} {return object or callback function}
     */

  }, {
    key: "callbackHandler",
    value: function callbackHandler(data, cb) {
      if (cb) {
        cb(null, data);
      }

      return data;
    }
  }]);

  return ProtobufProvider;
}(laksaCoreProvider.BaseProvider);

exports.AxiosProvider = AxiosProvider;
exports.ProtobufProvider = ProtobufProvider;
