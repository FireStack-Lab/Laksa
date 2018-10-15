'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
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

var ENCRYPTED = Symbol('ENCRYPTED');

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

  var address = laksaCoreCrypto.getAddressFromPrivateKey(privateKey);
  var publicKey = laksaCoreCrypto.getPubKeyFromPrivateKey(privateKey);
  return {
    privateKey: privateKey,
    address: address,
    publicKey: publicKey
  };
}
/**
 * create an raw accountObject
 * @return {[type]} [description]
 */


var createAccount = function createAccount() {
  return generateAccountObject(laksaCoreCrypto.generatePrivateKey());
};
var importAccount = function importAccount(privateKey) {
  return generateAccountObject(privateKey);
};
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
              address: [laksaUtils.isAddress],
              privateKey: [laksaUtils.isPrivateKey],
              publicKey: [laksaUtils.isPubkey]
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
    }, _callee, this);
  }));

  return function encryptAccount(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
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
              address: [laksaUtils.isAddress],
              crypto: [laksaUtils.isObject],
              publicKey: [laksaUtils.isPubkey]
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
    }, _callee2, this);
  }));

  return function decryptAccount(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var signTransaction = function signTransaction(privateKey, transactionObject) {
  return laksaCoreCrypto.createTransactionJson(privateKey, transactionObject);
};

var Account =
/*#__PURE__*/
function () {
  function Account(messenger) {
    _classCallCheck(this, Account);

    this.messenger = messenger;
  } // prototype.createAccount


  _createClass(Account, [{
    key: "createAccount",
    value: function createAccount$$1() {
      var accountObject = createAccount();

      var newObject = new Account();
      return Object.assign({}, accountObject, {
        encrypt: newObject.encrypt,
        decrypt: newObject.decrypt,
        sign: newObject.sign,
        signTransaction: newObject.signTransaction,
        signTransactionWithPassword: newObject.signTransactionWithPassword
      });
    } // prototype.importAccount

  }, {
    key: "importAccount",
    value: function importAccount$$1(privateKey) {
      var accountObject = importAccount(privateKey);

      var newObject = new Account();
      return Object.assign({}, accountObject, {
        encrypt: newObject.encrypt,
        decrypt: newObject.decrypt,
        sign: newObject.sign,
        signTransaction: newObject.signTransaction,
        signTransactionWithPassword: newObject.signTransactionWithPassword
      });
    } // sub object

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

      return function encrypt(_x) {
        return _encrypt.apply(this, arguments);
      };
    }() // sub object

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

      return function decrypt(_x2) {
        return _decrypt.apply(this, arguments);
      };
    }() // sign method for Transaction bytes

  }, {
    key: "sign",
    value: function sign(bytes) {
      if (this.privateKey === ENCRYPTED) {
        throw new Error('This account is encrypted, please decrypt it first');
      }

      return laksaCoreCrypto.sign(bytes, this.privateKey, this.publicKey);
    } // sign plain object

  }, {
    key: "signTransaction",
    value: function signTransaction$$1(transactionObject) {
      if (this.privateKey === ENCRYPTED) {
        throw new Error('This account is encrypted, please decrypt it first or use "signTransactionWithPassword"');
      }

      return signTransaction(this.privateKey, transactionObject);
    } // sign plain object with password

  }, {
    key: "signTransactionWithPassword",
    value: function () {
      var _signTransactionWithPassword = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(transactionObject, password) {
        var decrypted, signed, encryptAfterSign, nonEncryptSigned;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this.privateKey === ENCRYPTED)) {
                  _context3.next = 12;
                  break;
                }

                _context3.next = 3;
                return this.decrypt(password);

              case 3:
                decrypted = _context3.sent;
                signed = signTransaction(decrypted.privateKey, transactionObject);
                _context3.next = 7;
                return this.encrypt(password);

              case 7:
                encryptAfterSign = _context3.sent;
                Object.assign(this, encryptAfterSign);
                return _context3.abrupt("return", signed);

              case 12:
                nonEncryptSigned = signTransaction(this.privateKey, transactionObject);
                Object.assign(this, nonEncryptSigned);
                return _context3.abrupt("return", nonEncryptSigned);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function signTransactionWithPassword(_x3, _x4) {
        return _signTransactionWithPassword.apply(this, arguments);
      };
    }()
  }]);

  return Account;
}();

exports.Account = Account;
exports.ENCRYPTED = ENCRYPTED;
exports.createAccount = createAccount;
exports.importAccount = importAccount;
exports.encryptAccount = encryptAccount;
exports.decryptAccount = decryptAccount;
exports.signTransaction = signTransaction;
