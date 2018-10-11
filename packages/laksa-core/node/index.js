(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('laksa-utils'), require('laksa-core-crypto'), require('laksa-core-messenger'), require('laksa-core-transaction'), require('laksa-providers-http'), require('laksa-account'), require('laksa-contracts'), require('laksa-wallet'), require('laksa-zil')) :
  typeof define === 'function' && define.amd ? define(['laksa-utils', 'laksa-core-crypto', 'laksa-core-messenger', 'laksa-core-transaction', 'laksa-providers-http', 'laksa-account', 'laksa-contracts', 'laksa-wallet', 'laksa-zil'], factory) :
  (global.Laksa = factory(global.util,global.core,global.laksaCoreMessenger,global.Transaction,global.HttpProvider,global.laksaAccount,global.Contracts,global.laksaWallet,global.Zil));
}(this, (function (util,core,laksaCoreMessenger,Transaction,HttpProvider,laksaAccount,Contracts,laksaWallet,Zil) { 'use strict';

  Transaction = Transaction && Transaction.hasOwnProperty('default') ? Transaction['default'] : Transaction;
  HttpProvider = HttpProvider && HttpProvider.hasOwnProperty('default') ? HttpProvider['default'] : HttpProvider;
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

  var version = "0.0.48";

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
        HttpProvider,
        Messenger: laksaCoreMessenger.Messenger,
        Transaction,
        Wallet: laksaWallet.Wallet,
        Zil
      });

      _defineProperty(this, "setProvider", provider => {
        this.setNodeProvider(provider);
        this.setScillaProvider(provider);
        return true;
      });

      const url = args || config.defaultNodeUrl;
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

    setNodeProvider(provider) {
      const newProvider = new HttpProvider(provider);
      this.currentProvider = _objectSpread({}, this.currentProvider, {
        node: newProvider
      });
      this.messenger.setProvider(newProvider);
    }

    setScillaProvider(provider) {
      const newProvider = new HttpProvider(provider);
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
