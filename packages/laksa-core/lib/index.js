"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var util = _interopRequireWildcard(require("laksa-utils"));

var _laksaRequest = require("laksa-request");

var _laksaZil = _interopRequireDefault(require("laksa-zil"));

var _config = _interopRequireDefault(require("./config"));

//
//
//  Copyright
//
//
//
var Laksa = function Laksa(args) {
  var _this = this;

  (0, _classCallCheck2.default)(this, Laksa);
  (0, _defineProperty2.default)(this, "providers", {
    HttpProvider: _laksaRequest.HttpProvider
  });
  (0, _defineProperty2.default)(this, "config", _config.default);
  (0, _defineProperty2.default)(this, "isConnected",
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var result;
    return _regenerator.default.wrap(function _callee$(_context) {
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
  (0, _defineProperty2.default)(this, "getLibraryVersion", function () {
    return _this.config.version;
  });
  (0, _defineProperty2.default)(this, "getDefaultProviderUrl", function () {
    return _this.config.defaultProviderUrl;
  });
  (0, _defineProperty2.default)(this, "getDefaultAccount", function () {
    return _this.config.defaultAccount;
  });
  (0, _defineProperty2.default)(this, "getDefaultBlock", function () {
    return _this.config.defaultBlock;
  });
  (0, _defineProperty2.default)(this, "getProvider", function () {
    return _this.currentProvider;
  });
  (0, _defineProperty2.default)(this, "setProvider", function (provider) {
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