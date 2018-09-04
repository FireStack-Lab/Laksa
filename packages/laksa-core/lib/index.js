"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var util = _interopRequireWildcard(require("laksa-utils"));

var _laksaRequest = require("laksa-request");

var _laksaZil = _interopRequireDefault(require("laksa-zil"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Laksa = function Laksa(args) {
  var _this = this;

  _classCallCheck(this, Laksa);

  _defineProperty(this, "providers", {
    HttpProvider: _laksaRequest.HttpProvider
  });

  _defineProperty(this, "config", _config.default);

  _defineProperty(this, "isConnected",
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _this.zil.isConnected();

          case 2:
            result = _context.sent;
            _context.prev = 3;
            return _context.abrupt("return", !(result instanceof Error));

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", false);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 7]]);
  })));

  _defineProperty(this, "getLibraryVersion", function () {
    return _this.config.version;
  });

  _defineProperty(this, "getDefaultProviderUrl", function () {
    return _this.config.defaultProviderUrl;
  });

  _defineProperty(this, "getDefaultAccount", function () {
    return _this.config.defaultAccount;
  });

  _defineProperty(this, "getDefaultBlock", function () {
    return _this.config.defaultBlock;
  });

  _defineProperty(this, "getProvider", function () {
    return _this.currentProvider;
  });

  _defineProperty(this, "setProvider", function (provider) {
    _this.currentProvider = new _laksaRequest.HttpProvider(provider);

    _this.messanger.setProvider(_this.currentProvider);
  });

  // validateArgs(args, {}, { nodeUrl: [util.isUrl] })
  var url = args || _config.default.defaultNodeUrl; //

  this.util = util; //

  this.currentProvider = new _laksaRequest.HttpProvider(url);
  this.messanger = new _laksaRequest.Messanger(this.currentProvider); //

  this.zil = new _laksaZil.default(this);
};

var _default = Laksa;
exports.default = _default;
module.exports = exports.default;