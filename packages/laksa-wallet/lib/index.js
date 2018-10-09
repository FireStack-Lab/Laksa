'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('core-js/modules/es6.object.assign');
require('core-js/modules/es6.array.sort');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var laksaUtils = require('laksa-utils');
var immutable = require('immutable');
var account = require('laksa-account');

var ENCRYPTED = Symbol('ENCRYPTED');
var encryptedBy = {
  ACCOUNT: Symbol('account'),
  WALLET: Symbol('wallet')
};

var _accounts = immutable.Map({
  accounts: immutable.List([])
});

var Wallet =
/*#__PURE__*/
function () {
  function Wallet(messenger) {
    var _this = this;

    _classCallCheck(this, Wallet);

    _defineProperty(this, "updateLength", function () {
      _this.length = _this.getIndexKeys().length;
    });

    _defineProperty(this, "getIndexKeys", function () {
      var isCorrectKeys = function isCorrectKeys(n) {
        return /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20;
      };

      var arrays = _accounts.get('accounts').toArray();

      return Object.keys(arrays).filter(isCorrectKeys);
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

      var newArrays = _accounts.get('accounts');

      newArrays = newArrays.set(newIndex, objectKey);
      _accounts = _accounts.set(objectKey, newAccountObject);
      _accounts = _accounts.set('accounts', immutable.List(newArrays)); // _accounts = _accounts.concat(newArrays)

      _this.updateLength();

      return _objectSpread({}, newAccountObject);
    });

    _defineProperty(this, "createAccount", function () {
      var accountInstance = new account.Account();
      var accountObject = accountInstance.createAccount();
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
      var accountInstance = new account.Account();
      var accountObject = accountInstance.importAccount(privateKey);
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
        var currentArray = _accounts.get('accounts').toArray();

        delete currentArray[index];
        _accounts = _accounts.set('accounts', immutable.List(currentArray));
        _accounts = _accounts.delete(address);

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
      return _accounts.get(address);
    });

    _defineProperty(this, "getAccountByIndex", function (index) {
      if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');

      var address = _accounts.get('accounts').get(index);

      if (address !== undefined) {
        return _this.getAccountByAddress(address);
      } else return undefined;
    });

    _defineProperty(this, "getWalletAddresses", function () {
      return _this.getIndexKeys().map(function (index) {
        var accountFound = _this.getAccountByIndex(parseInt(index, 10));

        if (accountFound) {
          return accountFound.address;
        }

        return false;
      }).filter(function (d) {
        return !!d;
      });
    });

    _defineProperty(this, "getWalletPublicKeys", function () {
      return _this.getIndexKeys().map(function (index) {
        var accountFound = _this.getAccountByIndex(parseInt(index, 10));

        if (accountFound) {
          return accountFound.publicKey;
        }

        return false;
      }).filter(function (d) {
        return !!d;
      });
    });

    _defineProperty(this, "getWalletPrivateKeys", function () {
      return _this.getIndexKeys().map(function (index) {
        var accountFound = _this.getAccountByIndex(parseInt(index, 10));

        if (accountFound) {
          return accountFound.privateKey;
        }

        return false;
      }).filter(function (d) {
        return !!d;
      });
    });

    _defineProperty(this, "getWalletAccounts", function () {
      return _this.getIndexKeys().map(function (index) {
        var accountFound = _this.getAccountByIndex(parseInt(index, 10));

        return accountFound || false;
      }).filter(function (d) {
        return !!d;
      });
    });

    _defineProperty(this, "updateAccountByAddress", function (address, newObject) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
      if (!laksaUtils.isObject(newObject)) throw new Error('new account Object is not correct');
      var newAccountObject = Object.assign({}, newObject, {
        updatedTime: new Date()
      });
      _accounts = _accounts.update(address, function () {
        return newAccountObject;
      });
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
        var accountObject = _this.getAccountByIndex(parseInt(index, 10));

        if (accountObject) {
          var address = accountObject.address;

          _this.encryptAccountByAddress(address, password, level, encryptedBy.WALLET);
        }
      });

      return true;
    });

    _defineProperty(this, "decryptAllAccounts", function (password) {
      _this.getIndexKeys().forEach(function (index) {
        var accountObject = _this.getAccountByIndex(parseInt(index, 10));

        if (accountObject) {
          var address = accountObject.address,
              LastEncryptedBy = accountObject.LastEncryptedBy;

          if (LastEncryptedBy === encryptedBy.WALLET) {
            _this.decryptAccountByAddress(address, password, encryptedBy.WALLET);
          } else {
            console.error("address ".concat(address, " is protected by account psw"));
            console.error('use /decryptAccountByAddress/ instead');
          }
        }
      });

      return true;
    });

    _defineProperty(this, "encryptAccountByAddress",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(address, password, level, by) {
        var accountObject, privateKey, crypto, encryptedObject;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                accountObject = _this.getAccountByAddress(address);

                if (!(accountObject !== undefined)) {
                  _context.next = 8;
                  break;
                }

                privateKey = accountObject.privateKey, crypto = accountObject.crypto;

                if (!(privateKey !== undefined && privateKey !== ENCRYPTED && crypto === undefined)) {
                  _context.next = 8;
                  break;
                }

                _context.next = 6;
                return accountObject.encrypt(password, level);

              case 6:
                encryptedObject = _context.sent;
                return _context.abrupt("return", _this.updateAccountByAddress(address, Object.assign({}, encryptedObject, {
                  LastEncryptedBy: by || encryptedBy.ACCOUNT
                })));

              case 8:
                return _context.abrupt("return", false);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "decryptAccountByAddress",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(address, password, by) {
        var accountObject, privateKey, crypto, decryptedObject;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                accountObject = _this.getAccountByAddress(address);

                if (!(accountObject !== undefined)) {
                  _context2.next = 8;
                  break;
                }

                privateKey = accountObject.privateKey, crypto = accountObject.crypto;

                if (!(privateKey !== undefined && privateKey === ENCRYPTED && laksaUtils.isObject(crypto))) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 6;
                return accountObject.decrypt(password);

              case 6:
                decryptedObject = _context2.sent;
                return _context2.abrupt("return", _this.updateAccountByAddress(address, Object.assign({}, decryptedObject, {
                  LastEncryptedBy: by || encryptedBy.ACCOUNT
                })));

              case 8:
                return _context2.abrupt("return", false);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x5, _x6, _x7) {
        return _ref2.apply(this, arguments);
      };
    }());

    this.length = 0;
    this.messenger = messenger;
  }

  _createClass(Wallet, [{
    key: "accounts",
    get: function get() {
      return _accounts.get('accounts').toArray();
    },
    set: function set(value) {
      if (value !== undefined) {
        throw new Error('you should not set "accounts" directly, use internal functions');
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
