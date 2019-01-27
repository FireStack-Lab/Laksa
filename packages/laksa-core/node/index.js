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

  var version = "0.0.115";

  var config = {
    version,
    Default: {
      CHAIN_ID: 3,
      Network_ID: 'TestNet',
      nodeProviderUrl: 'http://localhost:4200'
    },
    Staging: {
      CHAIN_ID: 63,
      Network_ID: 'TestNet',
      nodeProviderUrl: 'https://staging-api.aws.z7a.xyz'
    },
    TestNet: {
      CHAIN_ID: 2,
      Network_ID: 'TestNet',
      nodeProviderUrl: 'https://api.zilliqa.com' // Mainnet

    },
    MainNet: {
      CHAIN_ID: 1,
      Network_ID: 'MainNet',
      nodeProviderUrl: 'https://mainnet.zilliqa.com'
    }
  };

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

    get version() {
      return config.version;
    }

    get isConnected() {
      return this.connection;
    } // library method


    async connection(callback) {
      const result = await this.zil.isConnected();

      try {
        return callback === undefined ? !(result instanceof Error) : callback(null, true);
      } catch (e) {
        return false;
      }
    }

    getProvider() {
      return this.currentProvider;
    }

    getLibraryVersion() {
      return this.version;
    }

    getDefaultAccount() {
      if (this.wallet.defaultAccount) {
        return this.wallet.defaultAccount;
      }

      return this.config.defaultAccount;
    }

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

    getNetworkSetting() {
      const {
        TestNet,
        MainNet,
        Default,
        Staging
      } = this.config;
      return {
        TestNet,
        MainNet,
        Default,
        Staging
      };
    }

  }

  return Laksa;

})));
