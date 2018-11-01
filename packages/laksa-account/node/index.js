(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('laksa-core-crypto'), require('laksa-extend-keystore')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'laksa-core-crypto', 'laksa-extend-keystore'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.laksaCoreCrypto,global.laksaExtendKeystore));
}(this, (function (exports,laksaUtils,laksaCoreCrypto,laksaExtendKeystore) { 'use strict';

  const ENCRYPTED = Symbol('ENCRYPTED');

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

  /**
   * gernerate account object
   * @function generateAccountObject
   * @param  {string} privateKey {description}
   * @return {Account} {Account object}
   */

  function generateAccountObject(privateKey) {
    if (!laksaUtils.isPrivateKey(privateKey)) {
      throw new Error('private key is not correct');
    }

    const address = laksaCoreCrypto.getAddressFromPrivateKey(privateKey);
    const publicKey = laksaCoreCrypto.getPubKeyFromPrivateKey(privateKey);
    return {
      privateKey,
      address,
      publicKey
    };
  }
  /**
   * @function createAccount
   * @return {Account} {account object}
   */


  const createAccount = () => {
    return generateAccountObject(laksaCoreCrypto.generatePrivateKey());
  };
  /**
   * @function importAccount
   * @param  {PrivateKey} privateKey {privatekey string}
   * @return {Account} {account object}
   */

  const importAccount = privateKey => {
    return generateAccountObject(privateKey);
  };
  /**
   * @function encryptAccount
   * @param  {Account} accountObject {account object}
   * @param  {string} password      {password string}
   * @param  {object} options       {encryption options}
   * @return {Account} {encrypted account object}
   */

  const encryptAccount = async (accountObject, password, options = {
    level: 1024
  }) => {
    laksaUtils.validateArgs(accountObject, {
      address: [laksaUtils.isAddress],
      privateKey: [laksaUtils.isPrivateKey],
      publicKey: [laksaUtils.isPubkey]
    });

    if (!laksaUtils.isString(password)) {
      throw new Error('password is not found');
    }

    const encrypted = await laksaExtendKeystore.encrypt(accountObject.privateKey, password, options);

    const encryptedObj = _objectSpread({}, accountObject, {
      privateKey: ENCRYPTED
    }, encrypted);

    return encryptedObj;
  };
  /**
   * @function decryptAccount
   * @param  {Account} accountObject {encrypted account object}
   * @param  {string} password      {password string}
   * @return {Account} {decrypted account object}
   */

  const decryptAccount = async (accountObject, password) => {
    laksaUtils.validateArgs(accountObject, {
      address: [laksaUtils.isAddress],
      crypto: [laksaUtils.isObject],
      publicKey: [laksaUtils.isPubkey]
    });

    if (!laksaUtils.isString(password)) {
      throw new Error('password is not found');
    }

    const newObject = Object.assign({}, accountObject);
    delete newObject.crypto;
    const decrypted = await laksaExtendKeystore.decrypt(accountObject, password);

    const decryptedObj = _objectSpread({}, newObject, {
      privateKey: decrypted
    });

    return decryptedObj;
  };
  /**
   * @function signTransaction
   * @param  {PrivateKey} privateKey        {privatekey}
   * @param  {Transaction} transactionObject {transaction object}
   * @return {Transaction} {signed transaction}
   */

  const signTransaction = (privateKey, transactionObject) => {
    return laksaCoreCrypto.createTransactionJson(privateKey, transactionObject);
  };

  class Account {
    constructor(messenger) {
      this.messenger = messenger;
    }
    /**
     * @function {createAccount}
     * @return {Account} {account object}
     */


    createAccount() {
      const accountObject = createAccount();
      const newObject = new Account();
      return Object.assign({}, accountObject, {
        encrypt: newObject.encrypt,
        decrypt: newObject.decrypt,
        sign: newObject.sign,
        signTransaction: newObject.signTransaction,
        signTransactionWithPassword: newObject.signTransactionWithPassword
      });
    }
    /**
     * @function {importAccount}
     * @param  {PrivateKey} privateKey {privatekey string}
     * @return {Account} {account object}
     */


    importAccount(privateKey) {
      const accountObject = importAccount(privateKey);
      const newObject = new Account();
      return Object.assign({}, accountObject, {
        encrypt: newObject.encrypt,
        decrypt: newObject.decrypt,
        sign: newObject.sign,
        signTransaction: newObject.signTransaction,
        signTransactionWithPassword: newObject.signTransactionWithPassword
      });
    } // sub object

    /**
     * @function {encrypt}
     * @param  {string} password {password string}
     * @param  {object} options  {options object for encryption}
     * @return {Account} {account object}
     */


    async encrypt(password, options = {
      level: 1024
    }) {
      const encryptedAccount = await encryptAccount(this, password, options);
      return Object.assign(this, encryptedAccount);
    } // sub object

    /**
     * @function {decrypt}
     * @param  {string} password {password string}
     * @return {object} {account object}
     */


    async decrypt(password) {
      const that = this;
      const decrypted = await decryptAccount(that, password);
      delete this.crypto;
      return Object.assign(this, decrypted);
    }
    /**
     * @function {sign} {sign method for Transaction bytes}
     * @param  {Buffer} bytes {Buffer that waited for sign}
     * @return {object} {signed transaction object}
     */


    sign(bytes) {
      if (this.privateKey === ENCRYPTED) {
        throw new Error('This account is encrypted, please decrypt it first');
      }

      return laksaCoreCrypto.sign(bytes, this.privateKey, this.publicKey);
    }
    /**
     * @function {signTransaction} {sign plain object}
     * @param  {object} transactionObject {transaction object that prepared for sign}
     * @return {object} {signed transaction object}
     */


    signTransaction(transactionObject) {
      if (this.privateKey === ENCRYPTED) {
        throw new Error('This account is encrypted, please decrypt it first or use "signTransactionWithPassword"');
      }

      return signTransaction(this.privateKey, transactionObject);
    }
    /**
     * @function {signTransactionWithPassword} {sign plain object with password}
     * @param  {object} transactionObject {transaction object}
     * @param  {string} password          {password string}
     * @return {object} {signed transaction object}
     */


    async signTransactionWithPassword(transactionObject, password) {
      if (this.privateKey === ENCRYPTED) {
        const decrypted = await this.decrypt(password);
        const signed = signTransaction(decrypted.privateKey, transactionObject);
        const encryptAfterSign = await this.encrypt(password);
        Object.assign(this, encryptAfterSign);
        return signed;
      } else {
        const nonEncryptSigned = signTransaction(this.privateKey, transactionObject);
        Object.assign(this, nonEncryptSigned);
        return nonEncryptSigned;
      }
    }

  }

  exports.Account = Account;
  exports.ENCRYPTED = ENCRYPTED;
  exports.createAccount = createAccount;
  exports.importAccount = importAccount;
  exports.encryptAccount = encryptAccount;
  exports.decryptAccount = decryptAccount;
  exports.signTransaction = signTransaction;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
