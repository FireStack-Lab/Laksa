"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import errors from 'errors'
var HttpProvider = function HttpProvider(url, timeout, user, password, headers) {
  var _this = this;

  _classCallCheck(this, HttpProvider);

  _defineProperty(this, "instance", function () {
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

  _defineProperty(this, "send",
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(payload) {
      var result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
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

  _defineProperty(this, "sendServer",
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(endpoint, payload) {
      var result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
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

  _defineProperty(this, "sendAsync", function (payload, callback) {
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

  _defineProperty(this, "sendAsyncServer", function (endpoint, payload, callback) {
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