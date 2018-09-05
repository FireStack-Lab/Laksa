'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('regenerator-runtime/runtime');
var util = require('laksa-utils');
var laksaRequest = require('laksa-request');
var Zil = _interopDefault(require('laksa-zil'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var config = {
  version: '0.0.1',
  mode: 'sync',
  defaultProviderUrl: 'http://localhost:4200',
  defaultBlock: 'latest',
  defaultAccount: undefined
};

var Laksa = function Laksa(args) {
  var _this = this;

  _classCallCheck(this, Laksa);

  _defineProperty(this, "providers", {
    HttpProvider: laksaRequest.HttpProvider
  });

  _defineProperty(this, "config", config);

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
    _this.currentProvider = new laksaRequest.HttpProvider(provider);

    _this.messanger.setProvider(_this.currentProvider);
  });

  // validateArgs(args, {}, { nodeUrl: [util.isUrl] })
  var url = args || config.defaultNodeUrl; //

  this.util = util; //

  this.currentProvider = new laksaRequest.HttpProvider(url);
  this.messanger = new laksaRequest.Messanger(this.currentProvider); //

  this.zil = new Zil(this);
};

module.exports = Laksa;
