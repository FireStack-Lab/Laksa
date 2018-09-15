(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('bip39'), require('hdkey'), require('laksa-wallet')) :
  typeof define === 'function' && define.amd ? define(['exports', 'bip39', 'hdkey', 'laksa-wallet'], factory) :
  (factory((global.Laksa = {}),global.bip,global.npmhdkeyobject,global.Wallet));
}(this, (function (exports,bip,npmhdkeyobject,Wallet) { 'use strict';

  npmhdkeyobject = npmhdkeyobject && npmhdkeyobject.hasOwnProperty('default') ? npmhdkeyobject['default'] : npmhdkeyobject;
  Wallet = Wallet && Wallet.hasOwnProperty('default') ? Wallet['default'] : Wallet;

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

  const getAvailableWordLists = () => {
    return bip.wordlists;
  };
  const generateMnemonic = language => {
    const languageToMnemonic = language || 'EN';
    const wordlists = getAvailableWordLists();

    if (Object.keys(wordlists).find(k => k === languageToMnemonic)) {
      return bip.generateMnemonic(undefined, undefined, wordlists[languageToMnemonic]);
    }

    throw new Error(`Mnemonics language '${language}' is not supported.`);
  };
  const mnemonicToSeed = (mnemonic, language, password) => {
    const languageToMnemonic = language || 'EN';
    const wordlists = getAvailableWordLists();

    if (bip.validateMnemonic(mnemonic, wordlists[languageToMnemonic])) {
      return bip.mnemonicToSeed(mnemonic, password);
    }

    throw new Error('Invalid Mnemonic.');
  };

  class HDKey {
    constructor() {
      _defineProperty(this, "fromHDKey", npmhdkey => {
        const ret = new HDKey();
        ret.npmhdkey = npmhdkey;
        return ret;
      });

      _defineProperty(this, "fromMasterSeed", seedBuffer => {
        return this.fromHDKey(npmhdkeyobject.fromMasterSeed(seedBuffer));
      });

      _defineProperty(this, "npmhdkey", void 0);

      _defineProperty(this, "derivePath", path => {
        return this.fromHDKey(this.npmhdkey.derive(path));
      });

      _defineProperty(this, "deriveChild", index => {
        return this.fromHDKey(this.npmhdkey.deriveChild(index));
      });

      _defineProperty(this, "getPrivateKey", () => {
        return this.npmhdkey._privateKey;
      });

      _defineProperty(this, "getPrivateKeyString", () => {
        return this.npmhdkey._privateKey.toString('hex');
      });
    }

  }

  class HDWallet extends Wallet {
    constructor(props, mnemonics, language) {
      super(props);

      _defineProperty(this, "network", {
        HDCoinValue: 1
      });

      _defineProperty(this, "HDRootKey", void 0);

      _defineProperty(this, "getCurrentNetworkPathString", () => {
        return `m/44'/${this.network.HDCoinValue}'/0'/0`;
      });

      _defineProperty(this, "createHDRoot", () => {
        const hdkey = this.hdkey.fromMasterSeed(this.seed);
        const HDRootKey = hdkey.derivePath(this.getCurrentNetworkPathString());
        this.HDRootKey = HDRootKey;
      });

      _defineProperty(this, "createRootAccount", () => {
        if (this.HDRootKey !== undefined) {
          const privateKey = this.HDRootKey.getPrivateKeyString(); // from laksa-wallet class

          this.importAccountFromPrivateKey(privateKey);
        }
      });

      this.mnemonicslang = language || 'EN';
      this.mnemonics = mnemonics || generateMnemonic(this.mnemonicslang);
      this.seed = mnemonicToSeed(this.mnemonics, this.mnemonicslang);
      this.hdkey = new HDKey();
    }

  }

  exports.HDWallet = HDWallet;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
