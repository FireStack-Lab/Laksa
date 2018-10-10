(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('laksa-core-crypto'), require('laksa-extend-keystore')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'laksa-core-crypto', 'laksa-extend-keystore'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.laksaCoreCrypto,global.laksaExtendKeystore));
}(this, (function (exports,laksaUtils,laksaCoreCrypto,laksaExtendKeystore) { 'use strict';

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

  const ENCRYPTED = Symbol('ENCRYPTED');

  function generateAccountObject(privateKey) {
    if (!laksaUtils.isPrivateKey(privateKey)) throw new Error('private key is not correct');
    const address = laksaCoreCrypto.getAddressFromPrivateKey(privateKey);
    const publicKey = laksaCoreCrypto.getPubKeyFromPrivateKey(privateKey);
    let accountObject = {}; // set accountObject

    if (laksaUtils.isPubkey(publicKey) && laksaUtils.isPrivateKey(privateKey) && laksaUtils.isAddress(address)) {
      accountObject = {
        privateKey,
        address,
        publicKey // push account object to accountArray

      };
      return accountObject;
    }

    throw new Error('account generate failure');
  }
  /**
   * create an raw accountObject
   * @return {[type]} [description]
   */


  const createAccount = () => {
    const privateKey = laksaCoreCrypto.generatePrivateKey();

    try {
      return generateAccountObject(privateKey);
    } catch (e) {
      return e;
    }
  };
  const importAccount = privateKey => {
    try {
      return generateAccountObject(privateKey);
    } catch (e) {
      return e;
    }
  };
  const encryptAccount = async (accountObject, password, level = 1024) => {
    if (!laksaUtils.isString(password)) throw new Error('password is not found');
    laksaUtils.validateArgs(accountObject, {
      address: [laksaUtils.isAddress],
      privateKey: [laksaUtils.isPrivateKey],
      publicKey: [laksaUtils.isPubkey]
    });

    try {
      const encrypted = await laksaExtendKeystore.encrypt(accountObject.privateKey, password, {
        level
      });

      const encryptedObj = _objectSpread({}, accountObject, {
        privateKey: ENCRYPTED
      }, encrypted);

      return encryptedObj;
    } catch (e) {
      throw new Error(e);
    }
  };
  const decryptAccount = async (accountObject, password) => {
    if (!laksaUtils.isString(password)) throw new Error('password is not found');
    laksaUtils.validateArgs(accountObject, {
      address: [laksaUtils.isAddress],
      crypto: [laksaUtils.isObject],
      publicKey: [laksaUtils.isPubkey]
    });

    try {
      const newObject = Object.assign({}, accountObject);
      delete newObject.crypto;
      const decrypted = await laksaExtendKeystore.decrypt(accountObject, password);

      const decryptedObj = _objectSpread({}, newObject, {
        privateKey: decrypted
      });

      return decryptedObj;
    } catch (e) {
      throw new Error(e);
    }
  };
  const signTransaction = (privateKey, transactionObject) => {
    return laksaCoreCrypto.createTransactionJson(privateKey, transactionObject);
  };
  class Account {
    constructor(messenger) {
      _defineProperty(this, "createAccount", () => {
        const accountObject = createAccount();
        const newObject = new Account();
        return Object.assign({}, accountObject, {
          encrypt: newObject.encrypt,
          decrypt: newObject.decrypt,
          sign: newObject.sign,
          signTransaction: newObject.signTransaction,
          signTransactionWithPassword: newObject.signTransactionWithPassword
        });
      });

      _defineProperty(this, "importAccount", privateKey => {
        const accountObject = importAccount(privateKey);
        const newObject = new Account();
        return Object.assign({}, accountObject, {
          encrypt: newObject.encrypt,
          decrypt: newObject.decrypt,
          sign: newObject.sign,
          signTransaction: newObject.signTransaction,
          signTransactionWithPassword: newObject.signTransactionWithPassword
        });
      });

      this.messenger = messenger;
    } // prototype.createAccount


    // sub object
    async encrypt(password, level = 1024) {
      const encryptedAccount = await encryptAccount(this, password, level);
      return Object.assign(this, encryptedAccount);
    } // sub object


    async decrypt(password) {
      const that = this;
      const decrypted = await decryptAccount(that, password);
      delete this.crypto;
      return Object.assign(this, decrypted);
    } // sign method for Transaction bytes


    sign(bytes) {
      if (this.privateKey === ENCRYPTED) {
        throw new Error('This account is encrypted, please decrypt it first');
      }

      return laksaCoreCrypto.sign(bytes, this.privateKey, this.publicKey);
    } // sign plain object


    signTransaction(transactionObject) {
      if (this.privateKey === ENCRYPTED) {
        throw new Error('This account is encrypted, please decrypt it first or use "signTransactionWithPassword"');
      }

      return signTransaction(this.privateKey, transactionObject);
    } // sign plain object with password


    signTransactionWithPassword(transactionObject, password) {
      if (this.privateKey === ENCRYPTED) {
        const decrypted = this.decrypt(password);
        const signed = signTransaction(decrypted.privateKey, transactionObject);
        Object.assign(this, encryptAccount(decrypted, password));
        return signed;
      }
    }

  }

  exports.createAccount = createAccount;
  exports.importAccount = importAccount;
  exports.encryptAccount = encryptAccount;
  exports.decryptAccount = decryptAccount;
  exports.signTransaction = signTransaction;
  exports.Account = Account;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
