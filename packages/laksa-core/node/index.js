'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var util = require('laksa-utils');
var laksaRequest = require('laksa-request');
var Zil = _interopDefault(require('laksa-zil'));

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

class Laksa {
  constructor(args) {
    _defineProperty(this, "providers", {
      HttpProvider: laksaRequest.HttpProvider
    });

    _defineProperty(this, "config", config);

    _defineProperty(this, "isConnected", async () => {
      const result = await this.zil.isConnected();

      try {
        return !(result instanceof Error);
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
      this.messanger.setProvider(this.currentProvider);
    });

    // validateArgs(args, {}, { nodeUrl: [util.isUrl] })
    const url = args || config.defaultNodeUrl; //

    this.util = util; //

    this.currentProvider = new laksaRequest.HttpProvider(url);
    this.messanger = new laksaRequest.Messanger(this.currentProvider); //

    this.zil = new Zil(this);
  }

}

module.exports = Laksa;
