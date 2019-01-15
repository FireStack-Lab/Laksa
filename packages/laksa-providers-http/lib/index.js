'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var fetch = _interopDefault(require('cross-fetch'));
require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/es6.object.assign');
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
var _slicedToArray = _interopDefault(require('@babel/runtime/helpers/slicedToArray'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var laksaCoreProvider = require('laksa-core-provider');

var fetchRPC = {
  requestHandler: function requestHandler(request, headers) {
    return fetch(request.url, {
      method: request.options && request.options.method ? request.options.method : 'POST',
      cache: 'no-cache',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(request.payload),
      headers: _objectSpread({}, headers, request.options && request.options.headers ? request.options.headers : {})
    });
  },
  responseHandler: function responseHandler(response, request, handler) {
    return response.json().then(function (body) {
      return _objectSpread({}, body, {
        req: request
      });
    }).then(handler);
  }
};

var defaultOptions = {
  method: 'POST',
  timeout: laksaCoreProvider.DEFAULT_TIMEOUT,
  headers: laksaCoreProvider.DEFAULT_HEADERS,
  user: null,
  password: null
};

var HttpProvider =
/*#__PURE__*/
function (_BaseProvider) {
  _inherits(HttpProvider, _BaseProvider);

  function HttpProvider(url, options, fetcher) {
    var _this;

    _classCallCheck(this, HttpProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HttpProvider).call(this));
    _this.url = url || 'http://localhost:4200';
    _this.fetcher = fetcher || fetchRPC;

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


  _createClass(HttpProvider, [{
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
      return laksaCoreProvider.performRPC(req, resMiddleware, this.fetcher);
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
  }, {
    key: "subscribe",
    value: function subscribe() {
      throw new Error('HTTPProvider does not support subscriptions.');
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe() {
      throw new Error('HTTPProvider does not support subscriptions.');
    }
  }]);

  return HttpProvider;
}(laksaCoreProvider.BaseProvider);

exports.HttpProvider = HttpProvider;
