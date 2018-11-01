(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('immutable'), require('laksa-account')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'immutable', 'laksa-account'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.immutable,global.account));
}(this, (function (exports,laksaUtils,immutable,account) { 'use strict';

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

  const encryptedBy = {
    ACCOUNT: Symbol('account'),
    WALLET: Symbol('wallet')
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
        const accountInstance = new account.Account();
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

      _defineProperty(this, "importAccountFromPrivateKey", privateKey => {
        const accountInstance = new account.Account();
        const accountObject = accountInstance.importAccount(privateKey);
        return this.addAccount(accountObject);
      });

      _defineProperty(this, "removeOneAccountByAddress", address => {
        if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
        const addressRef = this.getAccountByAddress(address);

        if (addressRef !== undefined) {
          const currentArray = _classPrivateFieldGet(this, _accounts2).get('accounts').toArray();

          delete currentArray[addressRef.index];

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
      const newAccountObject = Object.assign({}, accountObject, {
        createTime: new Date(),
        index: this.getCurrentMaxIndex() + 1
      });
      const objectKey = newAccountObject.address;
      const newIndex = newAccountObject.index;

      let newArrays = _classPrivateFieldGet(this, _accounts2).get('accounts');

      newArrays = newArrays.set(newIndex, objectKey);

      _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).set(objectKey, newAccountObject));

      _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).set('accounts', immutable.List(newArrays))); // this.#_accounts = this.#_accounts.concat(newArrays)


      this.updateLength();
      return _objectSpread({}, newAccountObject);
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
      const newAccountObject = Object.assign({}, newObject, {
        updatedTime: new Date()
      });

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
          privateKey,
          crypto
        } = accountObject;

        if (privateKey !== undefined && typeof privateKey !== 'symbol' && crypto === undefined) {
          const encryptedObject = await accountObject.encrypt(password, options);
          const updateStatus = this.updateAccountByAddress(address, Object.assign({}, encryptedObject, {
            LastEncryptedBy: by || encryptedBy.ACCOUNT
          }));

          if (updateStatus === true) {
            return this;
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
          privateKey,
          crypto
        } = accountObject;

        if (privateKey !== undefined && typeof privateKey === 'symbol' && laksaUtils.isObject(crypto)) {
          const decryptedObject = await accountObject.decrypt(password);
          const updateStatus = this.updateAccountByAddress(address, Object.assign({}, decryptedObject, {
            LastEncryptedBy: by || encryptedBy.ACCOUNT
          }));

          if (updateStatus === true) {
            return this;
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
      if (laksaUtils.isAddress(obj)) {
        this.signer = this.getAccountByAddress(obj);
        this.defaultAccount = this.getAccountByAddress(obj);
      } else if (laksaUtils.isAddress(obj.address)) {
        this.signer = this.getAccountByAddress(obj.address).address;
        this.defaultAccount = this.getAccountByAddress(obj.address).address;
      }

      return this;
    } // sign method for Transaction bytes

    /**
     * @function {sign}
     * @param  {Transaction} tx {transaction bytes}
     * @return {Transaction} {signed transaction object}
     */


    async sign(tx) {
      if (!this.signer) {
        throw new Error('This signer is not found');
      }

      try {
        const signerAccount = this.getAccountByAddress(this.signer);
        const balance = await this.messenger.send({
          method: 'GetBalance',
          params: [signerAccount.address]
        });

        if (typeof balance.nonce !== 'number') {
          throw new Error('Could not get nonce');
        }

        const withNonce = tx.map(txObj => {
          return _objectSpread({}, txObj, {
            nonce: balance.nonce + 1,
            pubKey: signerAccount.publicKey
          });
        });
        return withNonce.map(txObj => {
          // @ts-ignore
          return _objectSpread({}, txObj, {
            signature: signerAccount.sign(withNonce.bytes)
          });
        });
      } catch (err) {
        throw err;
      }
    }

  }

  var _accounts2 = new WeakMap();

  exports.Wallet = Wallet;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
