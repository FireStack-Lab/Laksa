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

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('laksa-utils'), require('laksa-core-crypto'), require('laksa-core-messenger'), require('laksa-core-transaction'), require('laksa-providers-http'), require('laksa-account'), require('laksa-core-contract'), require('laksa-blockchain'), require('laksa-wallet')) :
  typeof define === 'function' && define.amd ? define(['laksa-utils', 'laksa-core-crypto', 'laksa-core-messenger', 'laksa-core-transaction', 'laksa-providers-http', 'laksa-account', 'laksa-core-contract', 'laksa-blockchain', 'laksa-wallet'], factory) :
  (global.Laksa = factory(global.util,global.core,global.laksaCoreMessenger,global.laksaCoreTransaction,global.laksaProvidersHttp,global.laksaAccount,global.laksaCoreContract,global.laksaBlockchain,global.laksaWallet));
}(this, (function (util,core,laksaCoreMessenger,laksaCoreTransaction,laksaProvidersHttp,laksaAccount,laksaCoreContract,laksaBlockchain,laksaWallet) { 'use strict';

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

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var version = "0.1.1";

  var config = {
    version,
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

  class Laksa {
    constructor(args) {
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

      _defineProperty(this, "setProvider", provider => {
        let providerSetter = {};

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

        this.setNodeProvider(providerSetter);
        this.setScillaProvider(providerSetter);
        return true;
      });

      const url = (args && util.isUrl(args) ? args : undefined) || config.Default.nodeProviderUrl;
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


    get version() {
      return config.version;
    }
    /**
     * @function isConnected
     * @memberof Laksa
     * @description check connection status
     * @return {any} connection status
     */


    get isConnected() {
      return this.connection;
    }
    /**
     * @function connection
     * @memberof Laksa
     * @param {?Function} callback - callback function
     * @description check connection status
     * @return {Promise<any>} connection status
     */


    async connection(callback) {
      const result = await this.zil.isConnected();

      try {
        return callback === undefined ? !(result instanceof Error) : callback(null, true);
      } catch (e) {
        return false;
      }
    }
    /**
     * @function setProvider
     * @memberof Laksa.prototype
     * @param {HttpProvider} provider - HttpProvider
     * @description provider setter
     * @return {Boolean} if provider is set, return true
     */


    /**
     * @function getProvider
     * @memberof Laksa
     * @description provider getter
     * @return {Object} currentProvider with nodeProvider and scillaProvider
     */
    getProvider() {
      return this.currentProvider;
    }
    /**
     * @function getLibraryVersion
     * @memberof Laksa
     * @description version getter
     * @return {String} version string
     */


    getLibraryVersion() {
      return this.version;
    }
    /**
     * @function getDefaultAccount
     * @memberof Laksa
     * @description get wallet's default Account or config default Account
     * @return {Account} Account instance
     */


    getDefaultAccount() {
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


    setNodeProvider({
      url,
      options
    }) {
      const newProvider = new laksaProvidersHttp.HttpProvider(url, options);
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


    setScillaProvider({
      url,
      options
    }) {
      const newProvider = new laksaProvidersHttp.HttpProvider(url, options);
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


    register({
      name,
      pkg
    }) {
      const pkgObject = {
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


    getNetworkSetting() {
      const {
        TestNet,
        MainNet,
        Default,
        Staging,
        DevNet
      } = this.config;
      return {
        TestNet,
        MainNet,
        Default,
        DevNet,
        Staging
      };
    }
    /**
     * @function setNetworkID
     * @memberof Laksa
     * @description set network Id to messenger
     * @param {String} networkId
     * @return {Object}
     */


    setNetworkID(networkId) {
      this.messenger.setNetworkID(networkId);
    }

  }

  return Laksa;

})));
