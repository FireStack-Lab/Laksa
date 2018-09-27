'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var util = require('laksa-utils');
var core = require('laksa-core-crypto');
var laksaCoreMessenger = require('laksa-core-messenger');
var HttpProvider = _interopDefault(require('laksa-providers-http'));
var Zil = _interopDefault(require('laksa-zil'));

var version = "0.0.41";

var config = {
  version: version,
  defaultProviderUrl: 'http://localhost:4200',
  defaultBlock: 'latest',
  defaultAccount: undefined
};

var Laksa = function Laksa(args) {
  var _this = this;

  _classCallCheck(this, Laksa);

  _defineProperty(this, "providers", {
    HttpProvider: HttpProvider
  });

  _defineProperty(this, "config", config);

  _defineProperty(this, "isConnected",
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(callback) {
      var result;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.zil.isConnected();

            case 2:
              result = _context.sent;
              _context.prev = 3;
              return _context.abrupt("return", callback === undefined ? !(result instanceof Error) : callback(null, true));

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
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

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
    _this.currentProvider = new HttpProvider(provider);

    _this.messenger.setProvider(_this.currentProvider);
  });

  var url = args || config.defaultNodeUrl;
  this.util = _objectSpread({}, util, core);
  this.currentProvider = new HttpProvider(url);
  this.messenger = new laksaCoreMessenger.Messenger(this.currentProvider);
  this.zil = new Zil(this);
};

module.exports = Laksa;
