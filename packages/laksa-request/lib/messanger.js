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

var _laksaShared = require("laksa-shared");

var _jsonRpc = _interopRequireDefault(require("./jsonRpc"));

var Messanger = function Messanger(_provider) {
  var _this = this;

  (0, _classCallCheck2.default)(this, Messanger);
  (0, _defineProperty2.default)(this, "send",
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(data) {
      var payload, result;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (_this.provider) {
                _context.next = 3;
                break;
              }

              console.error((0, _laksaShared.InvalidProvider)());
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
  (0, _defineProperty2.default)(this, "sendAsync", function (data, callback) {
    if (!_this.provider) {
      console.error((0, _laksaShared.InvalidProvider)());
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
  (0, _defineProperty2.default)(this, "sendBatch", function (data, callback) {
    if (!_this.provider) {
      console.error((0, _laksaShared.InvalidProvider)());
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
  (0, _defineProperty2.default)(this, "sendServer",
  /*#__PURE__*/
  function () {
    var _ref2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2(endpoint, data) {
      var result;
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (_this.provider) {
                _context2.next = 3;
                break;
              }

              console.error((0, _laksaShared.InvalidProvider)());
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
  (0, _defineProperty2.default)(this, "sendAsyncServer", function (endpoint, data, callback) {
    if (!_this.provider) {
      console.error((0, _laksaShared.InvalidProvider)());
      return null;
    } // const payload = this.JsonRpc.toPayload(data.method, data.params)


    _this.provider.sendAsyncServer(endpoint, data, function (err, result) {
      if (err) {
        return callback(err);
      }

      callback(null, result);
    });
  });
  (0, _defineProperty2.default)(this, "sendBatchServer", function (data, callback) {
    if (!_this.provider) {
      console.error((0, _laksaShared.InvalidProvider)());
      return null;
    } // const payload = this.JsonRpc.toBatchPayload(data)


    _this.provider.sendAsync(data, function (err, results) {
      if (err) {
        return callback(err);
      }

      callback(err, results);
    });
  });
  (0, _defineProperty2.default)(this, "setProvider", function (provider) {
    _this.provider = provider;
  });
  this.provider = _provider;
  this.JsonRpc = new _jsonRpc.default();
};

var _default = Messanger;
exports.default = _default;
module.exports = exports.default;