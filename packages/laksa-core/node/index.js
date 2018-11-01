(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('laksa-utils'), require('laksa-core-crypto'), require('laksa-core-messenger'), require('laksa-core-transaction'), require('laksa-providers-http'), require('laksa-account'), require('laksa-contracts'), require('laksa-wallet'), require('laksa-zil')) :
  typeof define === 'function' && define.amd ? define(['laksa-utils', 'laksa-core-crypto', 'laksa-core-messenger', 'laksa-core-transaction', 'laksa-providers-http', 'laksa-account', 'laksa-contracts', 'laksa-wallet', 'laksa-zil'], factory) :
  (global.Laksa = factory(global.util,global.core,global.laksaCoreMessenger,global.laksaCoreTransaction,global.laksaProvidersHttp,global.laksaAccount,global.Contracts,global.laksaWallet,global.Zil));
}(this, (function (util,core,laksaCoreMessenger,laksaCoreTransaction,laksaProvidersHttp,laksaAccount,Contracts,laksaWallet,Zil) { 'use strict';

  Contracts = Contracts && Contracts.hasOwnProperty('default') ? Contracts['default'] : Contracts;
  Zil = Zil && Zil.hasOwnProperty('default') ? Zil['default'] : Zil;

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

  var version = "0.0.50";

  var config = {
    version,
    defaultProviderUrl: 'http://localhost:4200',
    defaultBlock: 'latest',
    defaultAccount: undefined
  };

  class Laksa {
    constructor(args) {
      _defineProperty(this, "Modules", {
        Account: laksaAccount.Account,
        Contracts,
        HttpProvider: laksaProvidersHttp.ProtobufProvider,
        Messenger: laksaCoreMessenger.Messenger,
        Transaction: laksaCoreTransaction.Transaction,
        Wallet: laksaWallet.Wallet,
        Zil
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
          throw new Error('provider should be HttpProvider Module or url string');
        }

        this.setNodeProvider(providerSetter);
        this.setScillaProvider(providerSetter);
        return true;
      });

      const url = (args && util.isUrl(args) ? args : undefined) || config.defaultNodeUrl;
      this.util = _objectSpread({}, util, core);
      this.currentProvider = {
        node: new laksaProvidersHttp.ProtobufProvider(url),
        scilla: new laksaProvidersHttp.ProtobufProvider(url)
      };
      this.messenger = new laksaCoreMessenger.Messenger(this.currentProvider.node);
      this.zil = new Zil(this.messenger);
      this.wallet = new laksaWallet.Wallet(this.messenger);
      this.contracts = new Contracts(this.messenger, this.wallet);
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
      const newProvider = new laksaProvidersHttp.ProtobufProvider(url, options);
      this.currentProvider = _objectSpread({}, this.currentProvider, {
        node: newProvider
      });
      this.messenger.setProvider(newProvider);
    }

    setScillaProvider({
      url,
      options
    }) {
      const newProvider = new laksaProvidersHttp.ProtobufProvider(url, options);
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

  }

  return Laksa;

})));
