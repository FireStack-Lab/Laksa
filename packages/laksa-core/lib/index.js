/**
 * This source code is being disclosed to you solely for the purpose of your participation in
 * testing Zilliqa and Laksa. You may view, compile and run the code for that purpose and pursuant to
 * the protocols and algorithms that are programmed into, and intended by, the code. You may
 * not do anything else with the code without express permission from Zilliqa Research Pte. Ltd.,
 * including modifying or publishing the code (or any part of it), and developing or forming
 * another public or private blockchain network. This source code is provided ‘as is’ and no
 * warranties are given as to title or non-infringement, merchantability or fitness for purpose
 * and, to the extent permitted by law, all liability for your use of the code is disclaimed.
 * Some programs in this code are governed by the GNU General Public License v3.0 (available at
 * https://www.gnu.org/licenses/gpl-3.0.en.html) (‘GPLv3’). The programs that are governed by
 * GPLv3.0 are those programs that are located in the folders src/depends and tests/depends
 * and which include a reference to GPLv3 in their program files.
 */

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

var version = "0.1.1";

var config = {
  version: version,
  Default: {
    CHAIN_ID: 0,
    Network_ID: 'Default',
    nodeProviderUrl: 'http://localhost:4201'
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

/**
 * @class Laksa
 * @param  {String}  url - Url string to initializing Laksa
 * @return {Laksa} Laksa instance
 */

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
      /**
       * @function version
       * @memberof Laksa
       * @description get library version
       * @return {String} library version
       */

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
    /**
     * @var {Object} util
     * @memberof Laksa.prototype
     * @description util
     */

    this.util = _objectSpread({}, util, core);
    /**
     * @var {Object} currentProvider
     * @memberof Laksa.prototype
     * @description signer
     */

    this.currentProvider = {
      node: new laksaProvidersHttp.HttpProvider(url),
      scilla: new laksaProvidersHttp.HttpProvider(url)
      /**
       * @var {Object} config
       * @memberof Laksa.prototype
       * @description config
       */

    };
    this.config = config;
    /**
     * @var {Messenger} messenger
     * @memberof Laksa.prototype
     * @description messenger
     */

    this.messenger = new laksaCoreMessenger.Messenger(this.currentProvider.node, this.config);
    /**
     * @var {Wallet} wallet
     * @memberof Laksa.prototype
     * @description wallet
     */

    this.wallet = new laksaWallet.Wallet(this.messenger);
    /**
     * @var {Transactions} transactions
     * @memberof Laksa.prototype
     * @description transactions
     */

    this.transactions = new laksaCoreTransaction.Transactions(this.messenger, this.wallet);
    /**
     * @var {Contracts} contracts
     * @memberof Laksa.prototype
     * @description contracts
     */

    this.contracts = new laksaCoreContract.Contracts(this.messenger, this.wallet);
    /**
     * @var {BlockChain} zil
     * @memberof Laksa.prototype
     * @description zil
     */

    this.zil = new laksaBlockchain.BlockChain(this.messenger, this.wallet);
  }
  /**
   * @var {Object} Modules
   * @memberof Laksa.prototype
   * @description Modules
   */


  _createClass(Laksa, [{
    key: "connection",

    /**
     * @function connection
     * @memberof Laksa
     * @param {?Function} callback - callback function
     * @description check connection status
     * @return {Promise<any>} connection status
     */
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

      function connection(_x) {
        return _connection.apply(this, arguments);
      }

      return connection;
    }()
    /**
     * @function setProvider
     * @memberof Laksa.prototype
     * @param {HttpProvider} provider - HttpProvider
     * @description provider setter
     * @return {Boolean} if provider is set, return true
     */

  }, {
    key: "getProvider",

    /**
     * @function getProvider
     * @memberof Laksa
     * @description provider getter
     * @return {Object} currentProvider with nodeProvider and scillaProvider
     */
    value: function getProvider() {
      return this.currentProvider;
    }
    /**
     * @function getLibraryVersion
     * @memberof Laksa
     * @description version getter
     * @return {String} version string
     */

  }, {
    key: "getLibraryVersion",
    value: function getLibraryVersion() {
      return this.version;
    }
    /**
     * @function getDefaultAccount
     * @memberof Laksa
     * @description get wallet's default Account or config default Account
     * @return {Account} Account instance
     */

  }, {
    key: "getDefaultAccount",
    value: function getDefaultAccount() {
      if (this.wallet.defaultAccount) {
        return this.wallet.defaultAccount;
      }

      return this.config.defaultAccount;
    }
    /**
     * @function setNodeProvider
     * @memberof Laksa
     * @description set provider to nodeProvider
     * @param {Object} providerObject
     * @param {String} providerObject.url - url String
     * @param {Object} providerObject.options - provider options
     */

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
    /**
     * @function setScillaProvider
     * @memberof Laksa
     * @description set provider to scillaProvider
     * @param {Object} providerObject
     * @param {String} providerObject.url - url String
     * @param {Object} providerObject.options - provider options
     */

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
    /**
     * @function register
     * @memberof Laksa
     * @description register a Module attach to Laksa
     * @param {Object} moduleObject
     * @param {String} moduleObject.name - Module name
     * @param {any} moduleObject.pkg - Module instance
     */

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
    /**
     * @function getNetworkSetting
     * @memberof Laksa
     * @description get config's network settings
     * @return {Object}
     */

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
    /**
     * @function setNetworkID
     * @memberof Laksa
     * @description set network Id to messenger
     * @param {String} networkId
     * @return {Object}
     */

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
    /**
     * @function isConnected
     * @memberof Laksa
     * @description check connection status
     * @return {any} connection status
     */

  }, {
    key: "isConnected",
    get: function get() {
      return this.connection;
    }
  }]);

  return Laksa;
}();

module.exports = Laksa;
