(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('laksa-core-crypto'), require('laksa-extend-keystore'), require('laksa-shared')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'laksa-core-crypto', 'laksa-extend-keystore', 'laksa-shared'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.laksaCoreCrypto,global.laksaExtendKeystore,global.laksaShared));
}(this, (function (exports,laksaUtils,laksaCoreCrypto,laksaExtendKeystore,laksaShared) { 'use strict';

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

  const ENCRYPTED = 'ENCRYPTED';

  /**
   * gernerate account object
   * @function generateAccountObject
   * @param  {string} privateKey {description}
   * @return {Account} {Account object}
   */

  function generateAccountObject(privateKey) {
    if (!laksaUtils.isPrivateKey(privateKey)) {
      throw new Error(`private key is not correct:${privateKey}`);
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
    const privateKey = laksaCoreCrypto.generatePrivateKey();
    return generateAccountObject(privateKey);
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
      privateKey: [laksaUtils.isPrivateKey]
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
      crypto: [laksaUtils.isObject]
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

  const signTransaction = (privateKey, txnDetails) => {
    const pubKey = laksaCoreCrypto.getPubKeyFromPrivateKey(privateKey);
    const txn = {
      version: txnDetails.version,
      nonce: txnDetails.nonce,
      toAddr: txnDetails.toAddr.toLowerCase(),
      amount: txnDetails.amount,
      pubKey,
      gasPrice: txnDetails.gasPrice,
      gasLimit: txnDetails.gasLimit,
      code: txnDetails.code || '',
      data: txnDetails.data || ''
    };
    const encodedTx = laksaCoreCrypto.encodeTransactionProto(txn);
    txn.signature = laksaCoreCrypto.sign(encodedTx, privateKey, pubKey);

    if (laksaCoreCrypto.schnorr.verify(encodedTx, new laksaCoreCrypto.Signature({
      r: new laksaUtils.BN(txn.signature.slice(0, 64), 16),
      s: new laksaUtils.BN(txn.signature.slice(64), 16)
    }), Buffer.from(pubKey, 'hex'))) {
      return txn;
    } else {
      throw new Error('Signature verify failure');
    }
  };

  class Account extends laksaShared.Core {
    constructor(messenger) {
      super(messenger);
      delete this.signer;
      this.privateKey = '';
      this.publicKey = '';
      this.address = '';
      this.balance = '0';
      this.nonce = 0;
    }
    /**
     * @function {createAccount}
     * @return {Account} {account object}
     */


    createAccount() {
      const accountObject = createAccount();
      const {
        privateKey,
        publicKey,
        address
      } = accountObject;
      this.privateKey = privateKey;
      this.publicKey = publicKey;
      this.address = address;
      return this;
    }
    /**
     * @function {importAccount}
     * @param  {PrivateKey} privateKey {privatekey string}
     * @return {Account} {account object}
     */


    importAccount(privateKey) {
      const accountObject = importAccount(privateKey);
      const {
        publicKey,
        address
      } = accountObject;
      this.privateKey = privateKey;
      this.publicKey = publicKey;
      this.address = address;
      if (this.crypto) delete this.crypto;
      return this;
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
     * @function {toFile}
     * @param  {string} password {description}
     * @param  {object} options  {description}
     * @return {string} {description}
     */


    async toFile(password, options = {
      level: 1024
    }) {
      const {
        privateKey,
        address,
        id,
        index,
        crypto,
        version,
        publicKey
      } = this;

      if (privateKey === ENCRYPTED) {
        return JSON.stringify({
          address,
          privateKey,
          publicKey,
          id,
          index,
          crypto,
          version
        });
      }

      const encrypted = await this.encrypt(password, options);
      return JSON.stringify({
        address: encrypted.address,
        privateKey: encrypted.privateKey,
        publicKey: encrypted.publicKey,
        id: encrypted.id,
        index: encrypted.index,
        crypto: encrypted.crypto,
        version: encrypted.version
      });
    }
    /**
     * @function {fromFile}
     * @param  {object} keyStore {description}
     * @param  {string} password {description}
     * @return {Account} {description}
     */


    async fromFile(keyStore, password) {
      const keyStoreObject = JSON.parse(keyStore);
      const decrypted = await decryptAccount(keyStoreObject, password);

      if (decrypted) {
        return this.importAccount(decrypted.privateKey);
      } else throw new Error('cannot import file');
    }
    /**
     * @function {signTransactionWithPassword} {sign plain object with password}
     * @param  {Transaction} txnObj {transaction object}
     * @param  {string} password          {password string}
     * @return {object} {signed transaction object}
     */


    async signTransaction(txnObj, password) {
      if (this.privateKey === ENCRYPTED) {
        await this.decrypt(password);
        await this.updateBalance();
        const signed = signTransaction(this.privateKey, _objectSpread({}, txnObj.txParams, {
          nonce: this.nonce + 1
        }));
        await this.encrypt(password);
        return txnObj.map(obj => {
          return _objectSpread({}, obj, signed);
        });
      } else {
        await this.updateBalance();
        const nonEncryptSigned = signTransaction(this.privateKey, _objectSpread({}, txnObj.txParams, {
          nonce: this.nonce + 1
        }));
        return txnObj.map(obj => {
          return _objectSpread({}, obj, nonEncryptSigned);
        });
      }
    }

    async getBalance() {
      try {
        const balanceObject = await this.messenger.send('GetBalance', this.address);
        const {
          balance,
          nonce
        } = balanceObject;

        if (laksaUtils.isInt(nonce)) {
          return {
            balance,
            nonce
          };
        } else {
          throw new Error('can not get nonce');
        }
      } catch (error) {
        throw error;
      }
    }

    async updateBalance() {
      try {
        const {
          balance,
          nonce
        } = await this.getBalance();
        this.balance = balance;
        this.nonce = nonce;
        return this;
      } catch (error) {
        throw error;
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
