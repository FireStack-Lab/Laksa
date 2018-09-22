(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('laksa-utils'), require('laksa-core-crypto'), require('laksa-wallet'), require('laksa-request'), require('laksa-zil')) :
  typeof define === 'function' && define.amd ? define(['laksa-utils', 'laksa-core-crypto', 'laksa-wallet', 'laksa-request', 'laksa-zil'], factory) :
  (global.Laksa = factory(global.util,global.core,global.wallet,global.laksaRequest,global.Zil));
}(this, (function (util,core,wallet,laksaRequest,Zil) { 'use strict';

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

  var config = {
    version: '0.0.1',
    defaultProviderUrl: 'http://localhost:4200',
    defaultBlock: 'latest',
    defaultAccount: undefined
  };

  const {
    Wallet
  } = wallet;

  class Laksa {
    constructor(args) {
      _defineProperty(this, "providers", {
        HttpProvider: laksaRequest.HttpProvider
      });

      _defineProperty(this, "config", config);

      _defineProperty(this, "isConnected", async callback => {
        const result = await this.zil.isConnected();

        try {
          return callback === undefined ? !(result instanceof Error) : callback(null, true);
        } catch (e) {
          return false;
        }
      });

      _defineProperty(this, "getLibraryVersion", () => this.config.version);

      _defineProperty(this, "getDefaultProviderUrl", () => this.config.defaultProviderUrl);

      _defineProperty(this, "getDefaultAccount", () => this.config.defaultAccount);

      _defineProperty(this, "getDefaultBlock", () => this.config.defaultBlock);

      _defineProperty(this, "getProvider", () => this.currentProvider);

      _defineProperty(this, "setProvider", provider => {
        this.currentProvider = new laksaRequest.HttpProvider(provider);
        this.messenger.setProvider(this.currentProvider);
      });

      const url = args || config.defaultNodeUrl;
      this.util = _objectSpread({}, util, core);
      this.currentProvider = new laksaRequest.HttpProvider(url);
      this.messenger = new laksaRequest.Messenger(this.currentProvider);
      this.zil = new Zil(this);
      this.wallet = new Wallet();
    }

  }

  return Laksa;

})));
