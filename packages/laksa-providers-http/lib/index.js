'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
require('core-js/modules/es6.function.name');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.regexp.to-string');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var axios = _interopDefault(require('axios'));

var HttpProvider = function HttpProvider(url, timeout, user, password, headers) {
  var _this = this;

  _classCallCheck(this, HttpProvider);

  _defineProperty(this, "instance", function () {
    var request = axios.create();

    if (_this.user && _this.password) {
      var AUTH_TOKEN = "Basic ".concat(Buffer.from("".concat(_this.user, ":").concat(_this.password)).toString('base64'));
      request.defaults.headers.common.Authorization = AUTH_TOKEN;
    }

    request.defaults.headers.post['Content-Type'] = 'application/json';

    if (_this.headers) {
      _this.headers.forEach(function (header) {
        request.defaults.headers.post[header.name] = header.value;
      });
    }

    if (_this.timeout) {
      request.defaults.timeout = _this.timeout;
    }

    return request;
  });

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

  _defineProperty(this, "sendAsync", function (payload, callback) {
    _this.requestFunc({
      payload: payload,
      callback: callback
    });
  });

  _defineProperty(this, "sendAsyncServer", function (endpoint, payload, callback) {
    _this.requestFunc({
      endpoint: endpoint,
      payload: payload,
      callback: callback
    });
  });

  _defineProperty(this, "requestFunc", function (_ref3) {
    var endpoint = _ref3.endpoint,
        payload = _ref3.payload,
        callback = _ref3.callback;
    var dest = endpoint !== null && endpoint !== undefined ? "".concat(_this.url).concat(endpoint) : _this.url;
    return _this.request.post(dest, JSON.stringify(payload)).then(function (response) {
      var data = response.data,
          status = response.status;

      if (data.result && status === 200) {
        if (callback === undefined) {
          return data.result;
        } else {
          callback(null, data.result);
        }
      }
    }).catch(function (err) {
      if (callback === undefined) {
        return err;
      } else {
        callback(err);
      }
    });
  });

  this.url = url || 'http://localhost:4200';
  this.timeout = timeout || 0;
  this.user = user || null;
  this.password = password || null;
  this.headers = headers;
  this.request = this.instance();
};

module.exports = HttpProvider;
