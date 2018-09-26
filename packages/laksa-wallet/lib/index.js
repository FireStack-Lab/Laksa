'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.to-string');
var laksaUtils = require('laksa-utils');
var laksaCoreCrypto = require('laksa-core-crypto');
var uuid = _interopDefault(require('uuid'));
var CryptoJS = _interopDefault(require('crypto-js'));
require('core-js/modules/es6.object.assign');
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
require('core-js/modules/es6.array.sort');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));

var encrypt = function encrypt(privateKey, password) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!laksaUtils.isPrivateKey) throw new Error('Invalid PrivateKey');
  if (!laksaUtils.isString(password)) throw new Error('no password found');
  var iv = options.iv || laksaCoreCrypto.randomBytes(16);
  var salt = options.salt || laksaCoreCrypto.randomBytes(32);
  var kdfparams = {
    dklen: options.dklen || 32,
    salt: salt.toString('hex'),
    c: options.c || 262144,
    prf: 'hmac-sha256'
  };
  var derivedKey = CryptoJS.PBKDF2(password, CryptoJS.enc.Utf8.parse(kdfparams.salt), {
    keySize: 256 / kdfparams.dklen,
    iterations: kdfparams.c
  }); // password should be replaced to derivedKey

  var ciphertext = CryptoJS.AES.encrypt(privateKey, derivedKey.toString().slice(0, 16), {
    iv: CryptoJS.enc.Hex.parse(iv.toString('hex')),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  var macBuffer = Buffer.concat([Buffer.from(derivedKey.toString().slice(16, 32), 'hex'), Buffer.from(ciphertext.toString(), 'hex')]);
  var mac = CryptoJS.SHA3(macBuffer.toString());
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
      kdfparams: kdfparams,
      mac: mac.toString()
    }
  };
};
var decrypt = function decrypt(keyStore, password) {
  if (!laksaUtils.isString(password)) throw new Error('no password found');
  var data = keyStore.crypto.ciphertext;
  var derivedKey = CryptoJS.PBKDF2(password, CryptoJS.enc.Utf8.parse(keyStore.crypto.kdfparams.salt), {
    keySize: 256 / 32,
    iterations: keyStore.crypto.kdfparams.c
  });
  var macBuffer = Buffer.concat([Buffer.from(derivedKey.toString().slice(16, 32), 'hex'), Buffer.from(keyStore.crypto.ciphertext.toString(), 'hex')]);
  var macString = CryptoJS.SHA3(macBuffer.toString()).toString();

  if (macString !== keyStore.crypto.mac) {
    throw Error('password may be wrong');
  }

  var decrypted = CryptoJS.AES.decrypt(data, derivedKey.toString().slice(0, 16), {
    iv: CryptoJS.enc.Hex.parse(keyStore.crypto.cipherparams.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

var ENCRYPTED = Symbol('ENCRYPTED');

function generateAccountObject(privateKey) {
  if (!laksaUtils.isPrivateKey(privateKey)) throw new Error('private key is not correct');
  var address = laksaCoreCrypto.getAddressFromPrivateKey(privateKey);
  var publicKey = laksaCoreCrypto.getPubKeyFromPrivateKey(privateKey);
  var accountObject = {}; // set accountObject

  if (laksaUtils.isPubkey(publicKey) && laksaUtils.isPrivateKey(privateKey) && laksaUtils.isAddress(address)) {
    accountObject = {
      privateKey: privateKey,
      address: address,
      publicKey: publicKey // push account object to accountArray

    };
    return accountObject;
  }

  throw new Error('account generate failure');
}
/**
 * create an raw accountObject
 * @return {[type]} [description]
 */


var createAccount = function createAccount() {
  var privateKey = laksaCoreCrypto.generatePrivateKey();

  try {
    return generateAccountObject(privateKey);
  } catch (e) {
    return e;
  }
};
var importAccount = function importAccount(privateKey) {
  try {
    return generateAccountObject(privateKey);
  } catch (e) {
    return e;
  }
};
var encryptAccount = function encryptAccount(accountObject, password) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
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
var decryptAccount = function decryptAccount(accountObject, password) {
  if (!laksaUtils.isString(password)) throw new Error('password is not found');
  laksaUtils.validateArgs(accountObject, {
    address: [laksaUtils.isAddress],
    crypto: [laksaUtils.isObject],
    publicKey: [laksaUtils.isPubkey]
  });

  try {
    var newObject = Object.assign({}, accountObject);
    delete newObject.crypto;
    return _objectSpread({}, newObject, {
      privateKey: decrypt(accountObject, password)
    });
  } catch (e) {
    return e;
  }
};

var encryptedBy = {
  ACCOUNT: Symbol('account'),
  WALLET: Symbol('wallet')
};
var _accounts = [];

var Wallet =
/*#__PURE__*/
function () {
  function Wallet() {
    var _this = this;

    _classCallCheck(this, Wallet);

    _defineProperty(this, "updateLength", function () {
      _this.length = _this.getIndexKeys().length;
    });

    _defineProperty(this, "getIndexKeys", function () {
      var isCorrectKeys = function isCorrectKeys(n) {
        return /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20;
      };

      return Object.keys(_accounts).filter(isCorrectKeys);
    });

    _defineProperty(this, "getCurrentMaxIndex", function () {
      var diff = function diff(a, b) {
        return b - a;
      }; // const sorted = R.sort(diff, keyList)


      var sorted = _this.getIndexKeys().sort(diff);

      return sorted[0] === undefined ? -1 : parseInt(sorted[0], 10);
    });

    _defineProperty(this, "addAccount", function (accountObject) {
      if (!laksaUtils.isObject(accountObject)) throw new Error('account Object is not correct');
      var newAccountObject = Object.assign({}, accountObject, {
        createTime: new Date(),
        index: _this.getCurrentMaxIndex() + 1
      });
      var objectKey = newAccountObject.address;
      var newIndex = newAccountObject.index;
      _accounts[objectKey] = newAccountObject;
      _accounts[newIndex] = objectKey;

      _this.updateLength();

      return _objectSpread({}, newAccountObject);
    });

    _defineProperty(this, "createAccount", function () {
      var accountObject = createAccount();
      return _this.addAccount(accountObject);
    });

    _defineProperty(this, "createBatchAccounts", function (number) {
      if (!laksaUtils.isNumber(number) || laksaUtils.isNumber(number) && number === 0) throw new Error('number has to be >0 Number');
      var Batch = [];

      for (var i = 0; i < number; i += 1) {
        Batch.push(_this.createAccount());
      }

      return Batch;
    });

    _defineProperty(this, "importAccountFromPrivateKey", function (privateKey) {
      var accountObject = importAccount(privateKey);
      return _this.addAccount(accountObject);
    });

    _defineProperty(this, "importAccountsFromPrivateKeyList", function (privateKeyList) {
      if (!laksaUtils.isArray(privateKeyList)) throw new Error('privateKeyList has to be Array<String>');
      var Imported = [];

      for (var i = 0; i < privateKeyList.length; i += 1) {
        Imported.push(_this.importAccountFromPrivateKey(privateKeyList[i]));
      }

      return Imported;
    });

    _defineProperty(this, "removeOneAccountByAddress", function (address) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');

      var _this$getAccountByAdd = _this.getAccountByAddress(address),
          index = _this$getAccountByAdd.index;

      if (index !== undefined) {
        delete _accounts[index];
        delete _accounts[address];

        _this.updateLength();
      }
    });

    _defineProperty(this, "removeOneAccountByIndex", function (index) {
      if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');

      var addressRef = _this.getAccountByIndex(index);

      if (addressRef !== undefined && addressRef.address) {
        _this.removeOneAccountByAddress(addressRef.address);
      }
    });

    _defineProperty(this, "getAccountByAddress", function (address) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
      return _accounts[address];
    });

    _defineProperty(this, "getAccountByIndex", function (index) {
      if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');
      var address = _accounts[index];

      if (address !== undefined) {
        return _this.getAccountByAddress(address);
      } else return undefined;
    });

    _defineProperty(this, "getWalletAddresses", function () {
      return _this.getIndexKeys().map(function (index) {
        var _this$getAccountByInd = _this.getAccountByIndex(parseInt(index, 10)),
            address = _this$getAccountByInd.address;

        return address;
      });
    });

    _defineProperty(this, "getWalletPublicKeys", function () {
      return _this.getIndexKeys().map(function (index) {
        var _this$getAccountByInd2 = _this.getAccountByIndex(parseInt(index, 10)),
            publicKey = _this$getAccountByInd2.publicKey;

        return publicKey;
      });
    });

    _defineProperty(this, "getWalletPrivateKeys", function () {
      return _this.getIndexKeys().map(function (index) {
        var _this$getAccountByInd3 = _this.getAccountByIndex(parseInt(index, 10)),
            privateKey = _this$getAccountByInd3.privateKey;

        return privateKey;
      });
    });

    _defineProperty(this, "updateAccountByAddress", function (address, newObject) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
      if (!laksaUtils.isObject(newObject)) throw new Error('new account Object is not correct');
      var newAccountObject = Object.assign({}, newObject, {
        updatedTime: new Date()
      });
      _accounts[address] = newAccountObject;
      return true;
    });

    _defineProperty(this, "cleanAllAccounts", function () {
      _this.getIndexKeys().forEach(function (index) {
        return _this.removeOneAccountByIndex(parseInt(index, 10));
      });

      return true;
    });

    _defineProperty(this, "encryptAllAccounts", function (password, level) {
      _this.getIndexKeys().forEach(function (index) {
        var _this$getAccountByInd4 = _this.getAccountByIndex(parseInt(index, 10)),
            address = _this$getAccountByInd4.address;

        _this.encryptAccountByAddress(address, password, level, encryptedBy.WALLET);
      });

      return true;
    });

    _defineProperty(this, "decryptAllAccounts", function (password) {
      _this.getIndexKeys().forEach(function (index) {
        var accountObject = _this.getAccountByIndex(parseInt(index, 10));

        var address = accountObject.address,
            LastEncryptedBy = accountObject.LastEncryptedBy;

        if (LastEncryptedBy === encryptedBy.WALLET) {
          _this.decryptAccountByAddress(address, password, encryptedBy.WALLET);
        } else {
          console.error("address ".concat(address, " is protected by account psw"));
          console.error('use /decryptAccountByAddress/ instead');
        }
      });

      return true;
    });

    _defineProperty(this, "encryptAccountByAddress", function (address, password, level, by) {
      var accountObject = _this.getAccountByAddress(address);

      if (accountObject !== undefined) {
        var privateKey = accountObject.privateKey,
            crypto = accountObject.crypto;

        if (privateKey !== undefined && privateKey !== ENCRYPTED && crypto === undefined) {
          var encryptedObject = encryptAccount(accountObject, password, level);
          return _this.updateAccountByAddress(address, Object.assign({}, encryptedObject, {
            LastEncryptedBy: by || encryptedBy.ACCOUNT
          }));
        }
      }

      return false;
    });

    _defineProperty(this, "decryptAccountByAddress", function (address, password, by) {
      var accountObject = _this.getAccountByAddress(address);

      if (accountObject !== undefined) {
        var privateKey = accountObject.privateKey,
            crypto = accountObject.crypto;

        if (privateKey !== undefined && privateKey === ENCRYPTED && laksaUtils.isObject(crypto)) {
          var decryptedObject = decryptAccount(accountObject, password);
          return _this.updateAccountByAddress(address, Object.assign({}, decryptedObject, {
            LastEncryptedBy: by || encryptedBy.ACCOUNT
          }));
        }
      }

      return false;
    });

    this.length = 0;
  }

  _createClass(Wallet, [{
    key: "accounts",
    get: function get() {
      return _accounts;
    },
    set: function set(value) {
      if (value !== undefined) {
        throw new Error('you cant set accounts directly, use internal functions');
      }
    }
    /**
     * [updateLength description]
     * @return {[type]} [description]
     */

  }]);

  return Wallet;
}();

exports.Wallet = Wallet;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.createAccount = createAccount;
exports.importAccount = importAccount;
exports.encryptAccount = encryptAccount;
exports.decryptAccount = decryptAccount;
exports.ENCRYPTED = ENCRYPTED;
