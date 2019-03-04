(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('immutable'), require('bip39'), require('hdkey'), require('laksa-account')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'immutable', 'bip39', 'hdkey', 'laksa-account'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.immutable,global.bip39,global.hdkey,global.account));
}(this, (function (exports,laksaUtils,immutable,bip39,hdkey,account) { 'use strict';

  bip39 = bip39 && bip39.hasOwnProperty('default') ? bip39['default'] : bip39;
  hdkey = hdkey && hdkey.hasOwnProperty('default') ? hdkey['default'] : hdkey;

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

  function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }

    return privateMap.get(receiver).value;
  }

  function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to set private field on non-instance");
    }

    var descriptor = privateMap.get(receiver);

    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
    return value;
  }

  const ENCRYPTED = 'ENCRYPTED';
  const encryptedBy = {
    ACCOUNT: 'account',
    WALLET: 'wallet'
  };

  class Wallet {
    constructor(messenger) {
      _defineProperty(this, "defaultAccount", void 0);

      _accounts2.set(this, {
        writable: true,
        value: immutable.Map({
          accounts: immutable.List([])
        })
      });

      _defineProperty(this, "createAccount", () => {
        const accountInstance = new account.Account(this.messenger);
        const accountObject = accountInstance.createAccount();
        return this.addAccount(accountObject);
      });

      _defineProperty(this, "createBatchAccounts", number => {
        if (!laksaUtils.isNumber(number) || laksaUtils.isNumber(number) && number === 0) throw new Error('number has to be >0 Number');
        const Batch = [];

        for (let i = 0; i < number; i += 1) {
          Batch.push(this.createAccount());
        }

        return Batch;
      });

      _defineProperty(this, "exportAccountByAddress", async (address, password, options = {
        level: 1024
      }) => {
        const accountToExport = this.getAccountByAddress(address);

        if (accountToExport) {
          const result = await accountToExport.toFile(password, options);
          return result;
        } else {
          return false;
        }
      });

      _defineProperty(this, "importAccountFromPrivateKey", privateKey => {
        const accountInstance = new account.Account(this.messenger);
        const accountObject = accountInstance.importAccount(privateKey);
        return this.addAccount(accountObject);
      });

      _defineProperty(this, "importAccountFromKeyStore", async (keyStore, password) => {
        const accountInstance = new account.Account(this.messenger);
        const accountObject = await accountInstance.fromFile(keyStore, password);
        return this.addAccount(accountObject);
      });

      _defineProperty(this, "removeOneAccountByAddress", address => {
        if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
        const addressRef = this.getAccountByAddress(address);

        if (addressRef !== undefined) {
          const currentArray = _classPrivateFieldGet(this, _accounts2).get('accounts').toArray();

          delete currentArray[addressRef.index];

          if (this.signer !== undefined && addressRef.address === this.signer.address) {
            this.signer = undefined;
            this.defaultAccount = undefined;
          }

          _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).set('accounts', immutable.List(currentArray)));

          _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).delete(address));

          this.updateLength();
        }

        this.updateLength();
      });

      _defineProperty(this, "getAccountByAddress", address => {
        if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
        return _classPrivateFieldGet(this, _accounts2).get(address);
      });

      _defineProperty(this, "getAccountByIndex", index => {
        if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');

        const address = _classPrivateFieldGet(this, _accounts2).get('accounts').get(index);

        if (address !== undefined) {
          return this.getAccountByAddress(address);
        } else return undefined;
      });

      _defineProperty(this, "getWalletAccounts", () => {
        return this.getIndexKeys().map(index => {
          const accountFound = this.getAccountByIndex(parseInt(index, 10));
          return accountFound || false;
        }).filter(d => !!d);
      });

      _defineProperty(this, "cleanAllAccounts", () => {
        this.getIndexKeys().forEach(index => this.removeOneAccountByIndex(parseInt(index, 10)));
        return true;
      });

      this.length = 0;
      this.messenger = messenger;
      this.signer = this.defaultAccount || undefined;
    }

    get accounts() {
      return _classPrivateFieldGet(this, _accounts2).get('accounts').toArray();
    }

    set accounts(value) {
      if (value !== undefined) {
        throw new Error('you should not set "accounts" directly, use internal functions');
      }
    }

    generateMnemonic() {
      return bip39.generateMnemonic();
    }

    importAccountFromMnemonic(phrase, index) {
      if (!this.isValidMnemonic(phrase)) {
        throw new Error(`Invalid mnemonic phrase: ${phrase}`);
      }

      const seed = bip39.mnemonicToSeed(phrase);
      const hdKey = hdkey.fromMasterSeed(seed);
      const childKey = hdKey.derive(`m/44'/313'/0'/0/${index}`);
      const privateKey = childKey.privateKey.toString('hex');
      return this.importAccountFromPrivateKey(privateKey);
    }

    isValidMnemonic(phrase) {
      if (phrase.trim().split(/\s+/g).length < 12) {
        return false;
      }

      return bip39.validateMnemonic(phrase);
    }

    defaultSetSigner() {
      if (this.getWalletAccounts().length === 1 && this.signer === undefined) {
        this.setSigner(this.getWalletAccounts()[0]);
      }
    }
    /**
     * @function {updateLength}
     * @return {number} {wallet account counts}
     */


    updateLength() {
      this.length = this.getIndexKeys().length;
    }
    /**
     * @function {getIndexKeys}
     * @return {Array<string>} {index keys to the wallet}
     */


    getIndexKeys() {
      const isCorrectKeys = n => /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20;

      const arrays = _classPrivateFieldGet(this, _accounts2).get('accounts').toArray();

      return Object.keys(arrays).filter(isCorrectKeys);
    }
    /**
     * @function {getCurrentMaxIndex}
     * @return {number} {max index to the wallet}
     */


    getCurrentMaxIndex() {
      const diff = (a, b) => {
        return b - a;
      }; // const sorted = R.sort(diff, keyList)


      const sorted = this.getIndexKeys().sort(diff);
      return sorted[0] === undefined ? -1 : parseInt(sorted[0], 10);
    }
    /**
     * @function {addAccount}
     * @param  {Account} accountObject {account object}
     * @return {Account} {account object}
     */


    addAccount(accountObject) {
      if (!laksaUtils.isObject(accountObject)) throw new Error('account Object is not correct');
      if (this.getAccountByAddress(accountObject.address)) return false;
      const newAccountObject = accountObject;
      newAccountObject.createTime = new Date();
      newAccountObject.index = this.getCurrentMaxIndex() + 1;
      const objectKey = newAccountObject.address;
      const newIndex = newAccountObject.index;

      let newArrays = _classPrivateFieldGet(this, _accounts2).get('accounts');

      newArrays = newArrays.set(newIndex, objectKey);

      _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).set(objectKey, newAccountObject));

      _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).set('accounts', immutable.List(newArrays))); // this.#_accounts = this.#_accounts.concat(newArrays)


      this.updateLength();
      this.defaultSetSigner();
      return newAccountObject;
    }
    /**
     * @function {createAccount}
     * @return {Account} {account object}
     */


    /**
     * @function {importAccountsFromPrivateKeyList}
     * @param  {Array<PrivateKey>} privateKeyList {list of private keys}
     * @return {Array<Account>} {array of accounts}
     */
    importAccountsFromPrivateKeyList(privateKeyList) {
      if (!laksaUtils.isArray(privateKeyList)) throw new Error('privateKeyList has to be Array<String>');
      const Imported = [];

      for (let i = 0; i < privateKeyList.length; i += 1) {
        Imported.push(this.importAccountFromPrivateKey(privateKeyList[i]));
      }

      return Imported;
    } //-------

    /**
     * @function {removeOneAccountByAddress}
     * @param  {Address} address {account address}
     * @return {undefined} {}
     */


    /**
     * @function {removeOneAccountByIndex}
     * @param  {number} index {index of account}
     * @return {undefined} {}
     */
    removeOneAccountByIndex(index) {
      if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');
      const addressRef = this.getAccountByIndex(index);

      if (addressRef !== undefined && addressRef.address) {
        this.removeOneAccountByAddress(addressRef.address);
      }
    } //---------

    /**
     * @function {getAccountByAddress}
     * @param  {Address} address {account address}
     * @return {Account} {account object}
     */


    /**
     * @function {getWalletAddresses}
     * @return {Array<Address>} {array of address}
     */
    getWalletAddresses() {
      return this.getIndexKeys().map(index => {
        const accountFound = this.getAccountByIndex(parseInt(index, 10));

        if (accountFound) {
          return accountFound.address;
        }

        return false;
      }).filter(d => !!d);
    }
    /**
     * @function {getWalletPublicKeys}
     * @return {Array<PublicKey>} {array of public Key}
     */


    getWalletPublicKeys() {
      return this.getIndexKeys().map(index => {
        const accountFound = this.getAccountByIndex(parseInt(index, 10));

        if (accountFound) {
          return accountFound.publicKey;
        }

        return false;
      }).filter(d => !!d);
    }
    /**
     * @function {getWalletPrivateKeys}
     * @return {Array<PrivateKey>} {array of private key}
     */


    getWalletPrivateKeys() {
      return this.getIndexKeys().map(index => {
        const accountFound = this.getAccountByIndex(parseInt(index, 10));

        if (accountFound) {
          return accountFound.privateKey;
        }

        return false;
      }).filter(d => !!d);
    }
    /**
     * @function getWalletAccounts
     * @return {Array<Account>} {array of account}
     */


    // -----------

    /**
     * @function {updateAccountByAddress}
     * @param  {Address} address   {account address}
     * @param  {Account} newObject {account object to be updated}
     * @return {boolean} {is successful}
     */
    updateAccountByAddress(address, newObject) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
      if (!laksaUtils.isObject(newObject)) throw new Error('new account Object is not correct');
      const newAccountObject = newObject;
      newAccountObject.updateTime = new Date();

      _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).update(address, () => newAccountObject));

      return true;
    } // -----------

    /**
     * @function {cleanAllAccountsw}
     * @return {boolean} {is successful}
     */


    // -----------

    /**
     * @function {encryptAllAccounts}
     * @param  {string} password {password}
     * @param  {object} options  {encryption options}
     * @return {type} {description}
     */
    async encryptAllAccounts(password, options) {
      const keys = this.getIndexKeys();
      const results = [];

      for (const index of keys) {
        const accountObject = this.getAccountByIndex(parseInt(index, 10));

        if (accountObject) {
          const {
            address
          } = accountObject;
          const things = this.encryptAccountByAddress(address, password, options, encryptedBy.WALLET);
          results.push(things);
        }
      }

      await Promise.all(results);
    }
    /**
     * @function {decryptAllAccounts}
     * @param  {string} password {decrypt password}
     * @return {type} {description}
     */


    async decryptAllAccounts(password) {
      const keys = this.getIndexKeys();
      const results = [];

      for (const index of keys) {
        const accountObject = this.getAccountByIndex(parseInt(index, 10));

        if (accountObject) {
          const {
            address,
            LastEncryptedBy
          } = accountObject;

          if (LastEncryptedBy === encryptedBy.WALLET) {
            const things = this.decryptAccountByAddress(address, password, encryptedBy.WALLET);
            results.push(things);
          }
        }
      }

      await Promise.all(results);
    }
    /**
     * @function {encryptAccountByAddress}
     * @param  {Address} address  {account address}
     * @param  {string} password {password string for encryption}
     * @param  {object} options  {encryption options}
     * @param  {Symbol} by       {Symbol that encrypted by}
     * @return {boolean} {status}
     */


    async encryptAccountByAddress(address, password, options, by) {
      const accountObject = this.getAccountByAddress(address);

      if (accountObject !== undefined) {
        const {
          crypto
        } = accountObject;

        if (crypto === undefined) {
          let encryptedObject = {};

          if (typeof accountObject.encrypt === 'function') {
            encryptedObject = await accountObject.encrypt(password, options);
          } else {
            const newAccount = new account.Account(this.messenger);
            const tempAccount = newAccount.importAccount(accountObject.privateKey);
            encryptedObject = await tempAccount.encrypt(password, options);
          }

          encryptedObject.LastEncryptedBy = by || encryptedBy.ACCOUNT;
          const updateStatus = this.updateAccountByAddress(address, encryptedObject);

          if (updateStatus === true) {
            return encryptedObject;
          } else return false;
        }
      }

      return false;
    }
    /**
     * @function {decryptAccountByAddress}
     * @param  {Address} address  {account address}
     * @param  {string} password {password string to decrypt}
     * @param  {Symbol} by       {Symbol that decrypted by}
     * @return {boolean} {status}
     */


    async decryptAccountByAddress(address, password, by) {
      const accountObject = this.getAccountByAddress(address);

      if (accountObject !== undefined) {
        const {
          crypto
        } = accountObject;

        if (laksaUtils.isObject(crypto)) {
          let decryptedObject = {};

          if (typeof accountObject.decrypt === 'function') {
            decryptedObject = await accountObject.decrypt(password);
          } else {
            const decryptedTempObject = await account.decryptAccount(accountObject, password);
            const newAccount = new account.Account(this.messenger);
            decryptedObject = newAccount.importAccount(decryptedTempObject.privateKey);
          }

          decryptedObject.LastEncryptedBy = by || encryptedBy.ACCOUNT;
          const updateStatus = this.updateAccountByAddress(address, decryptedObject);

          if (updateStatus === true) {
            return decryptedObject;
          } else return false;
        }
      }

      return false;
    }
    /**
     * @function {setSigner}
     * @param  {Account} obj {account object}
     * @return {Wallet} {wallet instance}
     */


    setSigner(obj) {
      if (laksaUtils.isString(obj)) {
        this.signer = this.getAccountByAddress(obj);
        this.defaultAccount = this.getAccountByAddress(obj);
      } else if (laksaUtils.isObject(obj) && laksaUtils.isAddress(obj.address)) {
        this.signer = this.getAccountByAddress(obj.address);
        this.defaultAccount = this.getAccountByAddress(obj.address);
      }

      return this;
    } // sign method for Transaction bytes

    /**
     * @function {sign}
     * @param  {Transaction} tx {transaction bytes}
     * @return {Transaction} {signed transaction object}
     */


    async sign(tx, {
      address,
      password
    }) {
      if (!this.signer && address === undefined) {
        throw new Error('This signer is not found or address is not defined');
      }

      try {
        const signerAccount = this.getAccountByAddress(address === undefined ? this.signer : address);
        const result = await signerAccount.signTransaction(tx, password);
        return result;
      } catch (err) {
        throw err;
      }
    }

  }

  var _accounts2 = new WeakMap();

  exports.Wallet = Wallet;
  exports.ENCRYPTED = ENCRYPTED;
  exports.encryptedBy = encryptedBy;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
