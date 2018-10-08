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

  const ENCRYPTED = Symbol('ENCRYPTED');
  const encryptedBy = {
    ACCOUNT: Symbol('account'),
    WALLET: Symbol('wallet')
  };

  let _accounts = immutable.Map({
    accounts: immutable.List([])
  });

  class Wallet {
    constructor() {
      _defineProperty(this, "updateLength", () => {
        this.length = this.getIndexKeys().length;
      });

      _defineProperty(this, "getIndexKeys", () => {
        const isCorrectKeys = n => /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20;

        const arrays = _accounts.get('accounts').toArray();

        return Object.keys(arrays).filter(isCorrectKeys);
      });

      _defineProperty(this, "getCurrentMaxIndex", () => {
        const diff = (a, b) => {
          return b - a;
        }; // const sorted = R.sort(diff, keyList)


        const sorted = this.getIndexKeys().sort(diff);
        return sorted[0] === undefined ? -1 : parseInt(sorted[0], 10);
      });

      _defineProperty(this, "addAccount", accountObject => {
        if (!laksaUtils.isObject(accountObject)) throw new Error('account Object is not correct');
        const newAccountObject = Object.assign({}, accountObject, {
          createTime: new Date(),
          index: this.getCurrentMaxIndex() + 1
        });
        const objectKey = newAccountObject.address;
        const newIndex = newAccountObject.index;

        let newArrays = _accounts.get('accounts');

        newArrays = newArrays.set(newIndex, objectKey);
        _accounts = _accounts.set(objectKey, newAccountObject);
        _accounts = _accounts.set('accounts', immutable.List(newArrays)); // _accounts = _accounts.concat(newArrays)

        this.updateLength();
        return _objectSpread({}, newAccountObject);
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

      _defineProperty(this, "importAccountsFromPrivateKeyList", privateKeyList => {
        if (!laksaUtils.isArray(privateKeyList)) throw new Error('privateKeyList has to be Array<String>');
        const Imported = [];

        for (let i = 0; i < privateKeyList.length; i += 1) {
          Imported.push(this.importAccountFromPrivateKey(privateKeyList[i]));
        }

        return Imported;
      });

      _defineProperty(this, "removeOneAccountByAddress", address => {
        if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
        const {
          index
        } = this.getAccountByAddress(address);

        if (index !== undefined) {
          const currentArray = _accounts.get('accounts').toArray();

          delete currentArray[index];
          _accounts = _accounts.set('accounts', immutable.List(currentArray));
          _accounts = _accounts.delete(address);
          this.updateLength();
        }
      });

      _defineProperty(this, "removeOneAccountByIndex", index => {
        if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');
        const addressRef = this.getAccountByIndex(index);

        if (addressRef !== undefined && addressRef.address) {
          this.removeOneAccountByAddress(addressRef.address);
        }
      });

      _defineProperty(this, "getAccountByAddress", address => {
        if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
        return _accounts.get(address);
      });

      _defineProperty(this, "getAccountByIndex", index => {
        if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');

        const address = _accounts.get('accounts').get(index);

        if (address !== undefined) {
          return this.getAccountByAddress(address);
        } else return undefined;
      });

      _defineProperty(this, "getWalletAddresses", () => {
        return this.getIndexKeys().map(index => {
          const accountFound = this.getAccountByIndex(parseInt(index, 10));

          if (accountFound) {
            return accountFound.address;
          }

          return false;
        }).filter(d => !!d);
      });

      _defineProperty(this, "getWalletPublicKeys", () => {
        return this.getIndexKeys().map(index => {
          const accountFound = this.getAccountByIndex(parseInt(index, 10));

          if (accountFound) {
            return accountFound.publicKey;
          }

          return false;
        }).filter(d => !!d);
      });

      _defineProperty(this, "getWalletPrivateKeys", () => {
        return this.getIndexKeys().map(index => {
          const accountFound = this.getAccountByIndex(parseInt(index, 10));

          if (accountFound) {
            return accountFound.privateKey;
          }

          return false;
        }).filter(d => !!d);
      });

      _defineProperty(this, "getWalletAccounts", () => {
        return this.getIndexKeys().map(index => {
          const accountFound = this.getAccountByIndex(parseInt(index, 10));
          return accountFound || false;
        }).filter(d => !!d);
      });

      _defineProperty(this, "updateAccountByAddress", (address, newObject) => {
        if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
        if (!laksaUtils.isObject(newObject)) throw new Error('new account Object is not correct');
        const newAccountObject = Object.assign({}, newObject, {
          updatedTime: new Date()
        });
        _accounts = _accounts.update(address, () => newAccountObject);
        return true;
      });

      _defineProperty(this, "cleanAllAccounts", () => {
        this.getIndexKeys().forEach(index => this.removeOneAccountByIndex(parseInt(index, 10)));
        return true;
      });

      _defineProperty(this, "encryptAllAccounts", (password, level) => {
        this.getIndexKeys().forEach(index => {
          const accountObject = this.getAccountByIndex(parseInt(index, 10));

          if (accountObject) {
            const {
              address
            } = accountObject;
            this.encryptAccountByAddress(address, password, level, encryptedBy.WALLET);
          }
        });
        return true;
      });

      _defineProperty(this, "decryptAllAccounts", password => {
        this.getIndexKeys().forEach(index => {
          const accountObject = this.getAccountByIndex(parseInt(index, 10));

          if (accountObject) {
            const {
              address,
              LastEncryptedBy
            } = accountObject;

            if (LastEncryptedBy === encryptedBy.WALLET) {
              this.decryptAccountByAddress(address, password, encryptedBy.WALLET);
            } else {
              console.error(`address ${address} is protected by account psw`);
              console.error('use /decryptAccountByAddress/ instead');
            }
          }
        });
        return true;
      });

      _defineProperty(this, "encryptAccountByAddress", async (address, password, level, by) => {
        const accountObject = this.getAccountByAddress(address);

        if (accountObject !== undefined) {
          const {
            privateKey,
            crypto
          } = accountObject;

          if (privateKey !== undefined && privateKey !== ENCRYPTED && crypto === undefined) {
            const encryptedObject = await accountObject.encrypt(password, level);
            return this.updateAccountByAddress(address, Object.assign({}, encryptedObject, {
              LastEncryptedBy: by || encryptedBy.ACCOUNT
            }));
          }
        }

        return false;
      });

      _defineProperty(this, "decryptAccountByAddress", async (address, password, by) => {
        const accountObject = this.getAccountByAddress(address);

        if (accountObject !== undefined) {
          const {
            privateKey,
            crypto
          } = accountObject;

          if (privateKey !== undefined && privateKey === ENCRYPTED && laksaUtils.isObject(crypto)) {
            const decryptedObject = await accountObject.decrypt(password);
            return this.updateAccountByAddress(address, Object.assign({}, decryptedObject, {
              LastEncryptedBy: by || encryptedBy.ACCOUNT
            }));
          }
        }

        return false;
      });

      this.length = 0;
    }

    get accounts() {
      return _accounts.get('accounts').toArray();
    }

    set accounts(value) {
      if (value !== undefined) {
        throw new Error('you should not set "accounts" directly, use internal functions');
      }
    }
    /**
     * [updateLength description]
     * @return {[type]} [description]
     */


  }

  exports.Wallet = Wallet;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
