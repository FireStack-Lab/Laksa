'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
var laksaShared = require('laksa-shared');

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
    _regeneratorRuntime.mark(function _callee2(endpoint, payload) {
      var result;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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

var JsonRpc = function JsonRpc() {
  var _this = this;

  _classCallCheck(this, JsonRpc);

  _defineProperty(this, "toPayload", function (method, params) {
    if (!method) console.error('jsonrpc method should be specified!'); // advance message ID

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
              if (_this.provider) {
                _context.next = 3;
                break;
              }

              console.error(laksaShared.InvalidProvider());
              return _context.abrupt("return", null);

            case 3:
              payload = _this.JsonRpc.toPayload(data.method, data.params);
              _context.next = 6;
              return _this.provider.send(payload);

            case 6:
              result = _context.sent;
              return _context.abrupt("return", result);

            case 8:
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
    if (!_this.provider) {
      console.error(laksaShared.InvalidProvider());
      return null;
    }

    var payload = _this.JsonRpc.toPayload(data.method, data.params);

    _this.provider.sendAsync(payload, function (err, result) {
      if (err) {
        return callback(err);
      }

      callback(null, result);
    });
  });

  _defineProperty(this, "sendBatch", function (data, callback) {
    if (!_this.provider) {
      console.error(laksaShared.InvalidProvider());
      return null;
    }

    var payload = _this.JsonRpc.toBatchPayload(data);

    _this.provider.sendAsync(payload, function (err, results) {
      if (err) {
        return callback(err);
      }

      callback(err, results);
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
              if (_this.provider) {
                _context2.next = 3;
                break;
              }

              console.error(laksaShared.InvalidProvider());
              return _context2.abrupt("return", null);

            case 3:
              _context2.next = 5;
              return _this.provider.sendServer(endpoint, data);

            case 5:
              result = _context2.sent;
              return _context2.abrupt("return", result);

            case 7:
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
    if (!_this.provider) {
      console.error(laksaShared.InvalidProvider());
      return null;
    } // const payload = this.JsonRpc.toPayload(data.method, data.params)


    _this.provider.sendAsyncServer(endpoint, data, function (err, result) {
      if (err) {
        return callback(err);
      }

      callback(null, result);
    });
  });

  _defineProperty(this, "sendBatchServer", function (data, callback) {
    if (!_this.provider) {
      console.error(laksaShared.InvalidProvider());
      return null;
    } // const payload = this.JsonRpc.toBatchPayload(data)


    _this.provider.sendAsync(data, function (err, results) {
      if (err) {
        return callback(err);
      }

      callback(err, results);
    });
  });

  _defineProperty(this, "setProvider", function (provider) {
    _this.provider = provider;
  });

  this.provider = _provider;
  this.JsonRpc = new JsonRpc();
};

exports.HttpProvider = HttpProvider;
exports.JsonRpc = JsonRpc;
exports.Messenger = Messanger;
