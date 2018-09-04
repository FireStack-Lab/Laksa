"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _axios = _interopRequireDefault(require("axios"));

// import errors from 'errors'
var HttpProvider = function HttpProvider(url, timeout, user, password, headers) {
  var _this = this;

  (0, _classCallCheck2.default)(this, HttpProvider);
  (0, _defineProperty2.default)(this, "instance", function () {
    var request = _axios.default.create();

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
  (0, _defineProperty2.default)(this, "send",
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(payload) {
      var result;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.instance().post(_this.url, JSON.stringify(payload)).then(function (response) {
                var data = response.data,
                    status = response.status;

                if (data.result && status === 200) {
                  return data.result;
                }
              }).catch(function (err) {
                return err;
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
  (0, _defineProperty2.default)(this, "sendServer",
  /*#__PURE__*/
  function () {
    var _ref2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2(endpoint, payload) {
      var result;
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this.instance().post("".concat(_this.url).concat(endpoint), JSON.stringify(payload)).then(function (response) {
                var data = response.data,
                    status = response.status;

                if (data.result && status === 200) {
                  return data.result;
                }
              }).catch(function (err) {
                return err;
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
  (0, _defineProperty2.default)(this, "sendAsync", function (payload, callback) {
    // const request = this.instance()
    // console.log(JSON.stringify(payload))
    _this.instance().post(_this.url, JSON.stringify(payload)).then(function (response) {
      var data = response.data,
          status = response.status;

      if (data.result && status === 200) {
        callback(null, data.result);
      }
    }).catch(function (err) {
      return callback(err);
    });
  });
  (0, _defineProperty2.default)(this, "sendAsyncServer", function (endpoint, payload, callback) {
    // const request = this.instance()
    // console.log(JSON.stringify(payload))
    _this.instance().post("".concat(_this.url).concat(endpoint), JSON.stringify(payload)).then(function (response) {
      var data = response.data,
          status = response.status;

      if (data.result && status === 200) {
        callback(null, data.result);
      }
    }).catch(function (err) {
      return callback(err);
    });
  });
  this.url = url || 'http://localhost:4200';
  this.timeout = timeout || 0;
  this.user = user || null;
  this.password = password || null;
  this.headers = headers;
  this.axios = this.instance();
};

var _default = HttpProvider;
exports.default = _default;
module.exports = exports.default;