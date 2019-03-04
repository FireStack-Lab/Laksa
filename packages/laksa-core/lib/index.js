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
var laksaCoreTransaction = require('laksa-core-transaction');
var laksaProvidersHttp = require('laksa-providers-http');
var laksaAccount = require('laksa-account');
var laksaCoreContract = require('laksa-core-contract');
var laksaBlockchain = require('laksa-blockchain');
var laksaWallet = require('laksa-wallet');

var version = "0.0.120";

var config = {
  version: version,
  Default: {
    CHAIN_ID: 3,
    Network_ID: 'Default',
    nodeProviderUrl: 'http://localhost:4200'
  },
  Staging: {
    CHAIN_ID: 63,
    Network_ID: 'Staging',
    nodeProviderUrl: 'https://staging-api.aws.z7a.xyz'
  },
  DevNet: {
    CHAIN_ID: 333,
    Network_ID: 'DevNet',
    nodeProviderUrl: 'https://dev-api.zilliqa.com'
  },
  TestNet: {
    CHAIN_ID: 2,
    Network_ID: 'TestNet',
    nodeProviderUrl: 'https://api.zilliqa.com'
  },
  MainNet: {
    CHAIN_ID: 1,
    Network_ID: 'MainNet',
    nodeProviderUrl: 'https://api.zilliqa.com'
  }
};

var Laksa =
/*#__PURE__*/
function () {
  function Laksa(args) {
    var _this = this;

    _classCallCheck(this, Laksa);

    _defineProperty(this, "Modules", {
      Account: laksaAccount.Account,
      BlockChain: laksaBlockchain.BlockChain,
      Contracts: laksaCoreContract.Contracts,
      Contract: laksaCoreContract.Contract,
      HttpProvider: laksaProvidersHttp.HttpProvider,
      Messenger: laksaCoreMessenger.Messenger,
      Transaction: laksaCoreTransaction.Transaction,
      Transactions: laksaCoreTransaction.Transactions,
      Wallet: laksaWallet.Wallet
    });

    _defineProperty(this, "setProvider", function (provider) {
      var providerSetter = {};

      if (util.isUrl(provider)) {
        providerSetter.url = provider;
      } else if (util.isObject(provider) && util.isUrl(provider.url)) {
        providerSetter = {
          url: provider.url,
          options: provider.options
        };
      } else {
        throw new Error('provider should be HttpProvider or url string');
      }

      _this.setNodeProvider(providerSetter);

      _this.setScillaProvider(providerSetter);

      return true;
    });

    var url = (args && util.isUrl(args) ? args : undefined) || config.Default.nodeProviderUrl;
    this.util = _objectSpread({}, util, core);
    this.currentProvider = {
      node: new laksaProvidersHttp.HttpProvider(url),
      scilla: new laksaProvidersHttp.HttpProvider(url)
    };
    this.config = config;
    this.messenger = new laksaCoreMessenger.Messenger(this.currentProvider.node, this.config);
    this.wallet = new laksaWallet.Wallet(this.messenger);
    this.transactions = new laksaCoreTransaction.Transactions(this.messenger, this.wallet);
    this.contracts = new laksaCoreContract.Contracts(this.messenger, this.wallet);
    this.zil = new laksaBlockchain.BlockChain(this.messenger, this.wallet);
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
    value: function setNodeProvider(_ref) {
      var url = _ref.url,
          options = _ref.options;
      var newProvider = new laksaProvidersHttp.HttpProvider(url, options);
      this.currentProvider = _objectSpread({}, this.currentProvider, {
        node: newProvider
      });
      this.messenger.setProvider(newProvider);
    }
  }, {
    key: "setScillaProvider",
    value: function setScillaProvider(_ref2) {
      var url = _ref2.url,
          options = _ref2.options;
      var newProvider = new laksaProvidersHttp.HttpProvider(url, options);
      this.currentProvider = _objectSpread({}, this.currentProvider, {
        scilla: newProvider
      });
      this.messenger.setScillaProvider(newProvider);
    }
  }, {
    key: "register",
    value: function register(_ref3) {
      var name = _ref3.name,
          pkg = _ref3.pkg;
      var pkgObject = {
        get: pkg,
        enumerable: true
      };
      Object.defineProperty(this, name, pkgObject);
    }
  }, {
    key: "getNetworkSetting",
    value: function getNetworkSetting() {
      var _this$config = this.config,
          TestNet = _this$config.TestNet,
          MainNet = _this$config.MainNet,
          Default = _this$config.Default,
          Staging = _this$config.Staging,
          DevNet = _this$config.DevNet;
      return {
        TestNet: TestNet,
        MainNet: MainNet,
        Default: Default,
        DevNet: DevNet,
        Staging: Staging
      };
    }
  }, {
    key: "setNetworkID",
    value: function setNetworkID(networkId) {
      this.messenger.setNetworkID(networkId);
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
