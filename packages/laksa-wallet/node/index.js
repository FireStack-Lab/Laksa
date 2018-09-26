(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('laksa-core-crypto'), require('uuid'), require('crypto-js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'laksa-core-crypto', 'uuid', 'crypto-js'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.laksaCoreCrypto,global.uuid,global.CryptoJS));
}(this, (function (exports,laksaUtils,laksaCoreCrypto,uuid,CryptoJS) { 'use strict';

  uuid = uuid && uuid.hasOwnProperty('default') ? uuid['default'] : uuid;
  CryptoJS = CryptoJS && CryptoJS.hasOwnProperty('default') ? CryptoJS['default'] : CryptoJS;

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

  const encrypt = (privateKey, password, options = {}) => {
    if (!laksaUtils.isPrivateKey) throw new Error('Invalid PrivateKey');
    if (!laksaUtils.isString(password)) throw new Error('no password found');
    const iv = options.iv || laksaCoreCrypto.randomBytes(16);
    const salt = options.salt || laksaCoreCrypto.randomBytes(32);
    const kdfparams = {
      dklen: options.dklen || 32,
      salt: salt.toString('hex'),
      c: options.c || 262144,
      prf: 'hmac-sha256'
    };
    const derivedKey = CryptoJS.PBKDF2(password, CryptoJS.enc.Utf8.parse(kdfparams.salt), {
      keySize: 256 / kdfparams.dklen,
      iterations: kdfparams.c
    }); // password should be replaced to derivedKey

    const ciphertext = CryptoJS.AES.encrypt(privateKey, derivedKey.toString().slice(0, 16), {
      iv: CryptoJS.enc.Hex.parse(iv.toString('hex')),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const macBuffer = Buffer.concat([Buffer.from(derivedKey.toString().slice(16, 32), 'hex'), Buffer.from(ciphertext.toString(), 'hex')]);
    const mac = CryptoJS.SHA3(macBuffer.toString());
    return {
      version: 3,
      id: uuid.v4({
        random: laksaCoreCrypto.randomBytes(16)
      }),
      crypto: {
        ciphertext: ciphertext.toString(),
        cipherparams: {
          iv: iv.toString('hex')
        },
        cipher: 'aes-128-ctr',
        kdf: 'pbkdf2',
        kdfparams,
        mac: mac.toString()
      }
    };
  };
  const decrypt = (keyStore, password) => {
    if (!laksaUtils.isString(password)) throw new Error('no password found');
    const data = keyStore.crypto.ciphertext;
    const derivedKey = CryptoJS.PBKDF2(password, CryptoJS.enc.Utf8.parse(keyStore.crypto.kdfparams.salt), {
      keySize: 256 / 32,
      iterations: keyStore.crypto.kdfparams.c
    });
    const macBuffer = Buffer.concat([Buffer.from(derivedKey.toString().slice(16, 32), 'hex'), Buffer.from(keyStore.crypto.ciphertext.toString(), 'hex')]);
    const macString = CryptoJS.SHA3(macBuffer.toString()).toString();

    if (macString !== keyStore.crypto.mac) {
      throw Error('password may be wrong');
    }

    const decrypted = CryptoJS.AES.decrypt(data, derivedKey.toString().slice(0, 16), {
      iv: CryptoJS.enc.Hex.parse(keyStore.crypto.cipherparams.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

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
  const encryptAccount = (accountObject, password, level = 1000) => {
    if (!laksaUtils.isString(password)) throw new Error('password is not found');
    laksaUtils.validateArgs(accountObject, {
      address: [laksaUtils.isAddress],
      privateKey: [laksaUtils.isPrivateKey],
      publicKey: [laksaUtils.isPubkey]
    });

    try {
      return _objectSpread({}, accountObject, {
        privateKey: ENCRYPTED
      }, encrypt(accountObject.privateKey, password, {
        c: level
      }));
    } catch (e) {
      return e;
    }
  };
  const decryptAccount = (accountObject, password) => {
    if (!laksaUtils.isString(password)) throw new Error('password is not found');
    laksaUtils.validateArgs(accountObject, {
      address: [laksaUtils.isAddress],
      crypto: [laksaUtils.isObject],
      publicKey: [laksaUtils.isPubkey]
    });

    try {
      const newObject = Object.assign({}, accountObject);
      delete newObject.crypto;
      return _objectSpread({}, newObject, {
        privateKey: decrypt(accountObject, password)
      });
    } catch (e) {
      return e;
    }
  };

  const encryptedBy = {
    ACCOUNT: Symbol('account'),
    WALLET: Symbol('wallet')
  };

  class Wallet {
    constructor() {
      _defineProperty(this, "updateLength", () => {
        this.length = this.getIndexKeys().length;
      });

      _defineProperty(this, "getIndexKeys", () => {
        const isCorrectKeys = n => /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20;

        return Object.keys(this.accounts).filter(isCorrectKeys);
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
        this.accounts[objectKey] = newAccountObject;
        this.accounts[newIndex] = objectKey;
        this.updateLength();
        return _objectSpread({}, newAccountObject);
      });

      _defineProperty(this, "createAccount", () => {
        const accountObject = createAccount();
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
        const accountObject = importAccount(privateKey);
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
          delete this.accounts[index];
          delete this.accounts[address];
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
        return this.accounts[address];
      });

      _defineProperty(this, "getAccountByIndex", index => {
        if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');
        const address = this.accounts[index];

        if (address !== undefined) {
          return this.getAccountByAddress(address);
        } else return undefined;
      });

      _defineProperty(this, "getWalletAddresses", () => {
        return this.getIndexKeys().map(index => {
          const {
            address
          } = this.getAccountByIndex(parseInt(index, 10));
          return address;
        });
      });

      _defineProperty(this, "getWalletPublicKeys", () => {
        return this.getIndexKeys().map(index => {
          const {
            publicKey
          } = this.getAccountByIndex(parseInt(index, 10));
          return publicKey;
        });
      });

      _defineProperty(this, "getWalletPrivateKeys", () => {
        return this.getIndexKeys().map(index => {
          const {
            privateKey
          } = this.getAccountByIndex(parseInt(index, 10));
          return privateKey;
        });
      });

      _defineProperty(this, "updateAccountByAddress", (address, newObject) => {
        if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
        if (!laksaUtils.isObject(newObject)) throw new Error('new account Object is not correct');
        const newAccountObject = Object.assign({}, newObject, {
          updatedTime: new Date()
        });
        this.accounts[address] = newAccountObject;
        return true;
      });

      _defineProperty(this, "cleanAllAccounts", () => {
        this.getIndexKeys().forEach(index => this.removeOneAccountByIndex(parseInt(index, 10)));
        return true;
      });

      _defineProperty(this, "encryptAllAccounts", (password, level) => {
        this.getIndexKeys().forEach(index => {
          const {
            address
          } = this.getAccountByIndex(parseInt(index, 10));
          this.encryptAccountByAddress(address, password, level, encryptedBy.WALLET);
        });
        return true;
      });

      _defineProperty(this, "decryptAllAccounts", password => {
        this.getIndexKeys().forEach(index => {
          const accountObject = this.getAccountByIndex(parseInt(index, 10));
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
        });
        return true;
      });

      _defineProperty(this, "encryptAccountByAddress", (address, password, level, by) => {
        const accountObject = this.getAccountByAddress(address);

        if (accountObject !== undefined) {
          const {
            privateKey,
            crypto
          } = accountObject;

          if (privateKey !== undefined && privateKey !== ENCRYPTED && crypto === undefined) {
            const encryptedObject = encryptAccount(accountObject, password, level);
            return this.updateAccountByAddress(address, Object.assign({}, encryptedObject, {
              LastEncryptedBy: by || encryptedBy.ACCOUNT
            }));
          }
        }

        return false;
      });

      _defineProperty(this, "decryptAccountByAddress", (address, password, by) => {
        const accountObject = this.getAccountByAddress(address);

        if (accountObject !== undefined) {
          const {
            privateKey,
            crypto
          } = accountObject;

          if (privateKey !== undefined && privateKey === ENCRYPTED && laksaUtils.isObject(crypto)) {
            const decryptedObject = decryptAccount(accountObject, password);
            return this.updateAccountByAddress(address, Object.assign({}, decryptedObject, {
              LastEncryptedBy: by || encryptedBy.ACCOUNT
            }));
          }
        }

        return false;
      });

      this.length = 0;
      this.accounts = [];
    }
    /**
     * [updateLength description]
     * @return {[type]} [description]
     */


  }

  exports.Wallet = Wallet;
  exports.encrypt = encrypt;
  exports.decrypt = decrypt;
  exports.createAccount = createAccount;
  exports.importAccount = importAccount;
  exports.encryptAccount = encryptAccount;
  exports.decryptAccount = decryptAccount;
  exports.ENCRYPTED = ENCRYPTED;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
