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
   * @function generateAccountObject
   * @description generate Account object
   * @param  {String} privateKey - privateKey String
   * @return {Object} Account object
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
   * @description create an account
   * @return {Object} account object
   */


  const createAccount = () => {
    const privateKey = laksaCoreCrypto.generatePrivateKey();
    return generateAccountObject(privateKey);
  };
  /**
   * @function importAccount
   * @description import privatekey and generate an account object
   * @param  {String} privateKey - privatekey string
   * @return {Object} account object
   */

  const importAccount = privateKey => {
    return generateAccountObject(privateKey);
  };
  /**
   * @function encryptAccount
   * @description encrypt Account
   * @param  {Account} accountObject - account instance
   * @param  {String} password      - password string
   * @param  {Object} options       - encryption options
   * @return {Object} encrypted account object
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
   * @description decrypt an account object
   * @param  {Account} accountObject - encrypted account object
   * @param  {String} password      -password string
   * @return {Object} decrypted account object
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
   * @description sign a transaction providing privatekey and transaction object
   * @param  {String} privateKey        - privatekey String
   * @param  {Transaction} txnDetails  - transaction object
   * @return {Transaction} signed transaction
   */

  const signTransaction = (privateKey, txnDetails) => {
    const pubKey = laksaCoreCrypto.getPubKeyFromPrivateKey(privateKey);
    const txn = {
      version: txnDetails.version,
      nonce: txnDetails.nonce,
      toAddr: txnDetails.toAddr,
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

  /**
   * @class Account
   * @param  {Messenger}  messenger - messsenger instance
   * @return {Account} Account instance
   */

  class Account extends laksaShared.Core {
    constructor(messenger) {
      super(messenger);
      delete this.signer;
      /**
       * @var {String} privateKey
       * @memberof Account.prototype
       * @description privateKey of Account
       */

      this.privateKey = '';
      /**
       * @var {String} publicKey
       * @memberof Account.prototype
       * @description publicKey of Account
       */

      this.publicKey = '';
      /**
       * @var {String} address
       * @memberof Account.prototype
       * @description address of Account
       */

      this.address = '';
      /**
       * @var {String} balance
       * @memberof Account.prototype
       * @description balance of Account
       */

      this.balance = '0';
      /**
       * @var {Number} privateKey
       * @memberof Account.prototype
       * @description nonce of Account
       */

      this.nonce = 0;
    }
    /**
     * @function createAccount
     * @description create new Account instance
     * @memberof Account
     * @return {Account} create a new Account
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
     * @function importAccount
     * @description import private key string and return an Account instance
     * @memberof Account
     * @param  {String} privateKey - privatekey string
     * @return {Account} create a new Account
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
     * @function encrypt
     * @memberof Account
     * @description encrypt an account providing password and encrypt options
     * @param  {String} password - password string
     * @param  {Object} options  - options object for encryption
     * @return {Promise<Account>} encrypt an account
     */


    async encrypt(password, options = {
      level: 1024
    }) {
      const encryptedAccount = await encryptAccount(this, password, options);
      return Object.assign(this, encryptedAccount);
    } // sub object

    /**
     * @function decrypt
     * @memberof Account
     * @description decrypt an account providing password
     * @param  {String} password - password string
     * @return {Promise<Object>} account object
     */


    async decrypt(password) {
      const that = this;
      const decrypted = await decryptAccount(that, password);
      delete this.crypto;
      return Object.assign(this, decrypted);
    }
    /**
     * @function toFile
     * @memberof Account
     * @description encrypt an account and return as jsonString
     * @param  {String} password - password string
     * @param  {Object} options  - encryption options
     * @return {Promise<String>} encrypted jsonString
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
     * @function fromFile
     * @memberof Account
     * @description Decrypt a keystore jsonString and generate an account.
     * @param  {String} keyStore - keystore jsonString
     * @param  {String} password - password string
     * @return {Promise<Account>} Account
     */


    async fromFile(keyStore, password) {
      const keyStoreObject = JSON.parse(keyStore);
      const decrypted = await decryptAccount(keyStoreObject, password);

      if (decrypted) {
        return this.importAccount(decrypted.privateKey);
      } else throw new Error('cannot import file');
    }
    /**
     * @function signTransactionWithPassword
     * @memberof Account
     * @description  sign transaction object with password
     * @param  {Transaction} txnObj - transaction object
     * @param  {String} password  - password string
     * @return {Promise<Object>} signed transaction object
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
    /**
     * @function getBalance
     * @memberof Account
     * @description  get balance of current Account
     * @return {Promise<Object>} signed transaction object
     */


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
    /**
     * @function updateBalance
     * @memberof Account
     * @description  update balance and nonce of current account
     * @return {Promise<Account>} return current Account instance
     */


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

    get checksumAddress() {
      return laksaCoreCrypto.getAddress(this.address, undefined, laksaCoreCrypto.AddressType.checkSum);
    }

    get bech32() {
      return laksaCoreCrypto.getAddress(this.address, undefined, laksaCoreCrypto.AddressType.bech32);
    }

    get base58() {
      return laksaCoreCrypto.getAddress(this.address, undefined, laksaCoreCrypto.AddressType.base58);
    }

    get bytes20Hex() {
      return laksaCoreCrypto.getAddress(this.address, undefined, laksaCoreCrypto.AddressType.bytes20Hex);
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
