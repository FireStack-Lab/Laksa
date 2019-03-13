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

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.object.assign');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var laksaUtils = require('laksa-utils');
var laksaCoreCrypto = require('laksa-core-crypto');
var laksaExtendKeystore = require('laksa-extend-keystore');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var laksaShared = require('laksa-shared');

var ENCRYPTED = 'ENCRYPTED';

/**
 * @function generateAccountObject
 * @description generate Account object
 * @param  {String} privateKey - privateKey String
 * @return {Object} Account object
 */

function generateAccountObject(privateKey) {
  if (!laksaUtils.isPrivateKey(privateKey)) {
    throw new Error("private key is not correct:".concat(privateKey));
  }

  var address = laksaCoreCrypto.getAddressFromPrivateKey(privateKey);
  var publicKey = laksaCoreCrypto.getPubKeyFromPrivateKey(privateKey);
  return {
    privateKey: privateKey,
    address: address,
    publicKey: publicKey
  };
}
/**
 * @function createAccount
 * @description create an account
 * @return {Object} account object
 */


var createAccount = function createAccount() {
  var privateKey = laksaCoreCrypto.generatePrivateKey();
  return generateAccountObject(privateKey);
};
/**
 * @function importAccount
 * @description import privatekey and generate an account object
 * @param  {String} privateKey - privatekey string
 * @return {Object} account object
 */

var importAccount = function importAccount(privateKey) {
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

var encryptAccount =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(accountObject, password) {
    var options,
        encrypted,
        encryptedObj,
        _args = arguments;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {
              level: 1024
            };
            laksaUtils.validateArgs(accountObject, {
              privateKey: [laksaUtils.isPrivateKey]
            });

            if (laksaUtils.isString(password)) {
              _context.next = 4;
              break;
            }

            throw new Error('password is not found');

          case 4:
            _context.next = 6;
            return laksaExtendKeystore.encrypt(accountObject.privateKey, password, options);

          case 6:
            encrypted = _context.sent;
            encryptedObj = _objectSpread({}, accountObject, {
              privateKey: ENCRYPTED
            }, encrypted);
            return _context.abrupt("return", encryptedObj);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function encryptAccount(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @function decryptAccount
 * @description decrypt an account object
 * @param  {Account} accountObject - encrypted account object
 * @param  {String} password      -password string
 * @return {Object} decrypted account object
 */

var decryptAccount =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2(accountObject, password) {
    var newObject, decrypted, decryptedObj;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            laksaUtils.validateArgs(accountObject, {
              crypto: [laksaUtils.isObject]
            });

            if (laksaUtils.isString(password)) {
              _context2.next = 3;
              break;
            }

            throw new Error('password is not found');

          case 3:
            newObject = Object.assign({}, accountObject);
            delete newObject.crypto;
            _context2.next = 7;
            return laksaExtendKeystore.decrypt(accountObject, password);

          case 7:
            decrypted = _context2.sent;
            decryptedObj = _objectSpread({}, newObject, {
              privateKey: decrypted
            });
            return _context2.abrupt("return", decryptedObj);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function decryptAccount(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @function signTransaction
 * @description sign a transaction providing privatekey and transaction object
 * @param  {String} privateKey        - privatekey String
 * @param  {Transaction} txnDetails  - transaction object
 * @return {Transaction} signed transaction
 */

var signTransaction = function signTransaction(privateKey, txnDetails) {
  var pubKey = laksaCoreCrypto.getPubKeyFromPrivateKey(privateKey);
  var txn = {
    version: txnDetails.version,
    nonce: txnDetails.nonce,
    toAddr: txnDetails.toAddr,
    amount: txnDetails.amount,
    pubKey: pubKey,
    gasPrice: txnDetails.gasPrice,
    gasLimit: txnDetails.gasLimit,
    code: txnDetails.code || '',
    data: txnDetails.data || ''
  };
  var encodedTx = laksaCoreCrypto.encodeTransactionProto(txn);
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

var Account =
/*#__PURE__*/
function (_Core) {
  _inherits(Account, _Core);

  function Account(messenger) {
    var _this;

    _classCallCheck(this, Account);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Account).call(this, messenger));
    delete _this.signer;
    /**
     * @var {String} privateKey
     * @memberof Account.prototype
     * @description privateKey of Account
     */

    _this.privateKey = '';
    /**
     * @var {String} publicKey
     * @memberof Account.prototype
     * @description publicKey of Account
     */

    _this.publicKey = '';
    /**
     * @var {String} address
     * @memberof Account.prototype
     * @description address of Account
     */

    _this.address = '';
    /**
     * @var {String} balance
     * @memberof Account.prototype
     * @description balance of Account
     */

    _this.balance = '0';
    /**
     * @var {Number} privateKey
     * @memberof Account.prototype
     * @description nonce of Account
     */

    _this.nonce = 0;
    return _this;
  }
  /**
   * @function createAccount
   * @description create new Account instance
   * @memberof Account
   * @return {Account} create a new Account
   */


  _createClass(Account, [{
    key: "createAccount",
    value: function createAccount$$1() {
      var accountObject = createAccount();

      var privateKey = accountObject.privateKey,
          publicKey = accountObject.publicKey,
          address = accountObject.address;
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

  }, {
    key: "importAccount",
    value: function importAccount$$1(privateKey) {
      var accountObject = importAccount(privateKey);

      var publicKey = accountObject.publicKey,
          address = accountObject.address;
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

  }, {
    key: "encrypt",
    value: function () {
      var _encrypt = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(password) {
        var options,
            encryptedAccount,
            _args = arguments;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {
                  level: 1024
                };
                _context.next = 3;
                return encryptAccount(this, password, options);

              case 3:
                encryptedAccount = _context.sent;
                return _context.abrupt("return", Object.assign(this, encryptedAccount));

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function encrypt(_x) {
        return _encrypt.apply(this, arguments);
      }

      return encrypt;
    }() // sub object

    /**
     * @function decrypt
     * @memberof Account
     * @description decrypt an account providing password
     * @param  {String} password - password string
     * @return {Promise<Object>} account object
     */

  }, {
    key: "decrypt",
    value: function () {
      var _decrypt = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(password) {
        var that, decrypted;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                that = this;
                _context2.next = 3;
                return decryptAccount(that, password);

              case 3:
                decrypted = _context2.sent;
                delete this.crypto;
                return _context2.abrupt("return", Object.assign(this, decrypted));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function decrypt(_x2) {
        return _decrypt.apply(this, arguments);
      }

      return decrypt;
    }()
    /**
     * @function toFile
     * @memberof Account
     * @description encrypt an account and return as jsonString
     * @param  {String} password - password string
     * @param  {Object} options  - encryption options
     * @return {Promise<String>} encrypted jsonString
     */

  }, {
    key: "toFile",
    value: function () {
      var _toFile = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(password) {
        var options,
            privateKey,
            address,
            id,
            index,
            crypto,
            version,
            publicKey,
            encrypted,
            _args3 = arguments;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {
                  level: 1024
                };
                privateKey = this.privateKey, address = this.address, id = this.id, index = this.index, crypto = this.crypto, version = this.version, publicKey = this.publicKey;

                if (!(privateKey === ENCRYPTED)) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt("return", JSON.stringify({
                  address: address,
                  privateKey: privateKey,
                  publicKey: publicKey,
                  id: id,
                  index: index,
                  crypto: crypto,
                  version: version
                }));

              case 4:
                _context3.next = 6;
                return this.encrypt(password, options);

              case 6:
                encrypted = _context3.sent;
                return _context3.abrupt("return", JSON.stringify({
                  address: encrypted.address,
                  privateKey: encrypted.privateKey,
                  publicKey: encrypted.publicKey,
                  id: encrypted.id,
                  index: encrypted.index,
                  crypto: encrypted.crypto,
                  version: encrypted.version
                }));

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function toFile(_x3) {
        return _toFile.apply(this, arguments);
      }

      return toFile;
    }()
    /**
     * @function fromFile
     * @memberof Account
     * @description Decrypt a keystore jsonString and generate an account.
     * @param  {String} keyStore - keystore jsonString
     * @param  {String} password - password string
     * @return {Promise<Account>} Account
     */

  }, {
    key: "fromFile",
    value: function () {
      var _fromFile = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(keyStore, password) {
        var keyStoreObject, decrypted;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                keyStoreObject = JSON.parse(keyStore);
                _context4.next = 3;
                return decryptAccount(keyStoreObject, password);

              case 3:
                decrypted = _context4.sent;

                if (!decrypted) {
                  _context4.next = 8;
                  break;
                }

                return _context4.abrupt("return", this.importAccount(decrypted.privateKey));

              case 8:
                throw new Error('cannot import file');

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fromFile(_x4, _x5) {
        return _fromFile.apply(this, arguments);
      }

      return fromFile;
    }()
    /**
     * @function signTransactionWithPassword
     * @memberof Account
     * @description  sign transaction object with password
     * @param  {Transaction} txnObj - transaction object
     * @param  {String} password  - password string
     * @return {Promise<Object>} signed transaction object
     */

  }, {
    key: "signTransaction",
    value: function () {
      var _signTransaction2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee5(txnObj, password) {
        var signed, nonEncryptSigned;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(this.privateKey === ENCRYPTED)) {
                  _context5.next = 11;
                  break;
                }

                _context5.next = 3;
                return this.decrypt(password);

              case 3:
                _context5.next = 5;
                return this.updateBalance();

              case 5:
                signed = signTransaction(this.privateKey, _objectSpread({}, txnObj.txParams, {
                  nonce: this.nonce + 1
                }));
                _context5.next = 8;
                return this.encrypt(password);

              case 8:
                return _context5.abrupt("return", txnObj.map(function (obj) {
                  return _objectSpread({}, obj, signed);
                }));

              case 11:
                _context5.next = 13;
                return this.updateBalance();

              case 13:
                nonEncryptSigned = signTransaction(this.privateKey, _objectSpread({}, txnObj.txParams, {
                  nonce: this.nonce + 1
                }));
                return _context5.abrupt("return", txnObj.map(function (obj) {
                  return _objectSpread({}, obj, nonEncryptSigned);
                }));

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function signTransaction$$1(_x6, _x7) {
        return _signTransaction2.apply(this, arguments);
      }

      return signTransaction$$1;
    }()
    /**
     * @function getBalance
     * @memberof Account
     * @description  get balance of current Account
     * @return {Promise<Object>} signed transaction object
     */

  }, {
    key: "getBalance",
    value: function () {
      var _getBalance = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee6() {
        var balanceObject, balance, nonce;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.messenger.send('GetBalance', this.address);

              case 3:
                balanceObject = _context6.sent;
                balance = balanceObject.balance, nonce = balanceObject.nonce;

                if (!laksaUtils.isInt(nonce)) {
                  _context6.next = 9;
                  break;
                }

                return _context6.abrupt("return", {
                  balance: balance,
                  nonce: nonce
                });

              case 9:
                throw new Error('can not get nonce');

              case 10:
                _context6.next = 15;
                break;

              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6["catch"](0);
                throw _context6.t0;

              case 15:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 12]]);
      }));

      function getBalance() {
        return _getBalance.apply(this, arguments);
      }

      return getBalance;
    }()
    /**
     * @function updateBalance
     * @memberof Account
     * @description  update balance and nonce of current account
     * @return {Promise<Account>} return current Account instance
     */

  }, {
    key: "updateBalance",
    value: function () {
      var _updateBalance = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee7() {
        var _ref, balance, nonce;

        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.getBalance();

              case 3:
                _ref = _context7.sent;
                balance = _ref.balance;
                nonce = _ref.nonce;
                this.balance = balance;
                this.nonce = nonce;
                return _context7.abrupt("return", this);

              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7["catch"](0);
                throw _context7.t0;

              case 14:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 11]]);
      }));

      function updateBalance() {
        return _updateBalance.apply(this, arguments);
      }

      return updateBalance;
    }()
  }]);

  return Account;
}(laksaShared.Core);

exports.Account = Account;
exports.ENCRYPTED = ENCRYPTED;
exports.createAccount = createAccount;
exports.importAccount = importAccount;
exports.encryptAccount = encryptAccount;
exports.decryptAccount = decryptAccount;
exports.signTransaction = signTransaction;
