'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.function.name');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var util = require('laksa-utils');
var core = require('laksa-core-crypto');
var laksaCoreMessenger = require('laksa-core-messenger');
var Transaction = _interopDefault(require('laksa-core-transaction'));
var HttpProvider = _interopDefault(require('laksa-providers-http'));
var laksaAccount = require('laksa-account');
var Contracts = _interopDefault(require('laksa-contracts'));
var laksaWallet = require('laksa-wallet');
var Zil = _interopDefault(require('laksa-zil'));

var version = "0.0.48";

var config = {
  version: version,
  defaultProviderUrl: 'http://localhost:4200',
  defaultBlock: 'latest',
  defaultAccount: undefined
};

var Laksa =
/*#__PURE__*/
function () {
  function Laksa(args) {
    var _this = this;

    _classCallCheck(this, Laksa);

    _defineProperty(this, "methods", {
      Account: laksaAccount.Account,
      Contracts: Contracts,
      HttpProvider: HttpProvider,
      Messenger: laksaCoreMessenger.Messenger,
      Transaction: Transaction,
      Wallet: laksaWallet.Wallet,
      Zil: Zil
    });

    _defineProperty(this, "setProvider", function (provider) {
      _this.setNodeProvider(provider);

      _this.setScillaProvider(provider);
    });

    var url = args || config.defaultNodeUrl;
    this.util = _objectSpread({}, util, core);
    this.currentProvider = {
      node: new HttpProvider(url),
      scilla: new HttpProvider(url)
    };
    this.messenger = new laksaCoreMessenger.Messenger(this.currentProvider.node);
    this.zil = new Zil(this.messenger);
    this.wallet = new laksaWallet.Wallet(this.messenger);
    this.contracts = new Contracts(this.messenger, this.wallet);
  }

  _createClass(Laksa, [{
    key: "connection",
    // library method
    value: function () {
      var _connection = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(callback) {
        var result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.zil.isConnected();

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

      return function connection(_x) {
        return _connection.apply(this, arguments);
      };
    }()
  }, {
    key: "getProvider",
    value: function getProvider() {
      return this.currentProvider;
    }
  }, {
    key: "getLibraryVersion",
    value: function getLibraryVersion() {
      return this.version;
    }
  }, {
    key: "getDefaultAccount",
    value: function getDefaultAccount() {
      if (this.wallet.defaultAccount) {
        return this.wallet.defaultAccount;
      }

      return this.config.defaultAccount;
    }
  }, {
    key: "setNodeProvider",
    value: function setNodeProvider(provider) {
      var newProvider = new HttpProvider(provider);
      this.currentProvider = _objectSpread({}, this.currentProvider, {
        node: newProvider
      });
      this.messenger.setProvider(newProvider);
    }
  }, {
    key: "setScillaProvider",
    value: function setScillaProvider(provider) {
      var newProvider = new HttpProvider(provider);
      this.currentProvider = _objectSpread({}, this.currentProvider, {
        scilla: newProvider
      });
      this.messenger.setScillaProvider(newProvider);
    }
  }, {
    key: "register",
    value: function register(_ref) {
      var name = _ref.name,
          pkg = _ref.pkg;
      var pkgObject = {
        get: pkg,
        enumerable: true
      };
      Object.defineProperty(this, name, pkgObject);
    }
  }, {
    key: "version",
    get: function get() {
      return config.version;
    }
  }, {
    key: "isConnected",
    get: function get() {
      return this.connection;
    }
  }]);

  return Laksa;
}();

module.exports = Laksa;
