'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
require('core-js/modules/es6.object.assign');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var laksaUtils = require('laksa-utils');
var laksaCoreCrypto = require('laksa-core-crypto');
var laksaExtendKeystore = require('laksa-extend-keystore');

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


var _createAccount = function createAccount() {
  var privateKey = laksaCoreCrypto.generatePrivateKey();

  try {
    return generateAccountObject(privateKey);
  } catch (e) {
    return e;
  }
};

var _importAccount = function importAccount(privateKey) {
  try {
    return generateAccountObject(privateKey);
  } catch (e) {
    return e;
  }
};
var encryptAccount =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(accountObject, password) {
    var level,
        encrypted,
        encryptedObj,
        _args = arguments;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            level = _args.length > 2 && _args[2] !== undefined ? _args[2] : 1024;

            if (laksaUtils.isString(password)) {
              _context.next = 3;
              break;
            }

            throw new Error('password is not found');

          case 3:
            laksaUtils.validateArgs(accountObject, {
              address: [laksaUtils.isAddress],
              privateKey: [laksaUtils.isPrivateKey],
              publicKey: [laksaUtils.isPubkey]
            });
            _context.prev = 4;
            _context.next = 7;
            return laksaExtendKeystore.encrypt(accountObject.privateKey, password, {
              level: level
            });

          case 7:
            encrypted = _context.sent;
            encryptedObj = _objectSpread({}, accountObject, {
              privateKey: ENCRYPTED
            }, encrypted);
            return _context.abrupt("return", encryptedObj);

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](4);
            throw new Error(_context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 12]]);
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
            if (laksaUtils.isString(password)) {
              _context2.next = 2;
              break;
            }

            throw new Error('password is not found');

          case 2:
            laksaUtils.validateArgs(accountObject, {
              address: [laksaUtils.isAddress],
              crypto: [laksaUtils.isObject],
              publicKey: [laksaUtils.isPubkey]
            });
            _context2.prev = 3;
            newObject = Object.assign({}, accountObject);
            delete newObject.crypto;
            _context2.next = 8;
            return laksaExtendKeystore.decrypt(accountObject, password);

          case 8:
            decrypted = _context2.sent;
            decryptedObj = _objectSpread({}, newObject, {
              privateKey: decrypted
            });
            return _context2.abrupt("return", decryptedObj);

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](3);
            throw new Error(_context2.t0);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[3, 13]]);
  }));

  return function decryptAccount(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var _signTransaction = function signTransaction(privateKey, transactionObject) {
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
    value: function createAccount() {
      var accountObject = _createAccount();

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
    value: function importAccount(privateKey) {
      var accountObject = _importAccount(privateKey);

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
      _regeneratorRuntime.mark(function _callee3(password) {
        var level,
            encryptedAccount,
            _args3 = arguments;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                level = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 1024;
                _context3.next = 3;
                return encryptAccount(this, password, level);

              case 3:
                encryptedAccount = _context3.sent;
                return _context3.abrupt("return", Object.assign(this, encryptedAccount));

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function encrypt(_x5) {
        return _encrypt.apply(this, arguments);
      };
    }() // sub object

  }, {
    key: "decrypt",
    value: function () {
      var _decrypt = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(password) {
        var that, decrypted;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                that = this;
                _context4.next = 3;
                return decryptAccount(that, password);

              case 3:
                decrypted = _context4.sent;
                delete this.crypto;
                return _context4.abrupt("return", Object.assign(this, decrypted));

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function decrypt(_x6) {
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
    value: function signTransaction(transactionObject) {
      if (this.privateKey === ENCRYPTED) {
        throw new Error('This account is encrypted, please decrypt it first or use "signTransactionWithPassword"');
      }

      return _signTransaction(this.privateKey, transactionObject);
    } // sign plain object with password

  }, {
    key: "signTransactionWithPassword",
    value: function signTransactionWithPassword(transactionObject, password) {
      if (this.privateKey === ENCRYPTED) {
        var decrypted = this.decrypt(password);

        var signed = _signTransaction(decrypted.privateKey, transactionObject);

        Object.assign(this, encryptAccount(decrypted, password));
        return signed;
      }
    }
  }]);

  return Account;
}();

exports.createAccount = _createAccount;
exports.importAccount = _importAccount;
exports.encryptAccount = encryptAccount;
exports.decryptAccount = decryptAccount;
exports.signTransaction = _signTransaction;
exports.Account = Account;
