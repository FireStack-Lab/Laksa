'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
require('core-js/modules/es6.weak-map');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('core-js/modules/es6.object.assign');
require('core-js/modules/es6.array.sort');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
require('core-js/modules/web.dom.iterable');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _classPrivateFieldSet = _interopDefault(require('@babel/runtime/helpers/classPrivateFieldSet'));
var _classPrivateFieldGet = _interopDefault(require('@babel/runtime/helpers/classPrivateFieldGet'));
var laksaUtils = require('laksa-utils');
var immutable = require('immutable');
var account = require('laksa-account');

var ENCRYPTED = Symbol('ENCRYPTED');
var encryptedBy = {
  ACCOUNT: Symbol('account'),
  WALLET: Symbol('wallet')
};

var Wallet =
/*#__PURE__*/
function () {
  function Wallet(messenger) {
    var _this = this;

    _classCallCheck(this, Wallet);

    _defineProperty(this, "defaultAccount", void 0);

    _accounts2.set(this, {
      writable: true,
      value: immutable.Map({
        accounts: immutable.List([])
      })
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

    _defineProperty(this, "removeOneAccountByAddress", function (address) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');

      var _this$getAccountByAdd = _this.getAccountByAddress(address),
          index = _this$getAccountByAdd.index;

      if (index !== undefined) {
        var currentArray = _classPrivateFieldGet(_this, _accounts2).get('accounts').toArray();

        delete currentArray[index];

        _classPrivateFieldSet(_this, _accounts2, _classPrivateFieldGet(_this, _accounts2).set('accounts', immutable.List(currentArray)));

        _classPrivateFieldSet(_this, _accounts2, _classPrivateFieldGet(_this, _accounts2).delete(address));

        _this.updateLength();
      }
    });

    _defineProperty(this, "getAccountByAddress", function (address) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
      return _classPrivateFieldGet(_this, _accounts2).get(address);
    });

    _defineProperty(this, "getAccountByIndex", function (index) {
      if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');

      var address = _classPrivateFieldGet(_this, _accounts2).get('accounts').get(index);

      if (address !== undefined) {
        return _this.getAccountByAddress(address);
      } else return undefined;
    });

    _defineProperty(this, "getWalletAccounts", function () {
      return _this.getIndexKeys().map(function (index) {
        var accountFound = _this.getAccountByIndex(parseInt(index, 10));

        return accountFound || false;
      }).filter(function (d) {
        return !!d;
      });
    });

    _defineProperty(this, "cleanAllAccounts", function () {
      _this.getIndexKeys().forEach(function (index) {
        return _this.removeOneAccountByIndex(parseInt(index, 10));
      });

      return true;
    });

    this.length = 0;
    this.messenger = messenger;
    this.signer = this.defaultAccount || undefined;
  }

  _createClass(Wallet, [{
    key: "updateLength",

    /**
     * [updateLength description]
     * @return {[type]} [description]
     */
    value: function updateLength() {
      this.length = this.getIndexKeys().length;
    }
  }, {
    key: "getIndexKeys",
    value: function getIndexKeys() {
      var isCorrectKeys = function isCorrectKeys(n) {
        return /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20;
      };

      var arrays = _classPrivateFieldGet(this, _accounts2).get('accounts').toArray();

      return Object.keys(arrays).filter(isCorrectKeys);
    }
  }, {
    key: "getCurrentMaxIndex",
    value: function getCurrentMaxIndex() {
      var diff = function diff(a, b) {
        return b - a;
      }; // const sorted = R.sort(diff, keyList)


      var sorted = this.getIndexKeys().sort(diff);
      return sorted[0] === undefined ? -1 : parseInt(sorted[0], 10);
    }
  }, {
    key: "addAccount",
    value: function addAccount(accountObject) {
      if (!laksaUtils.isObject(accountObject)) throw new Error('account Object is not correct');
      var newAccountObject = Object.assign({}, accountObject, {
        createTime: new Date(),
        index: this.getCurrentMaxIndex() + 1
      });
      var objectKey = newAccountObject.address;
      var newIndex = newAccountObject.index;

      var newArrays = _classPrivateFieldGet(this, _accounts2).get('accounts');

      newArrays = newArrays.set(newIndex, objectKey);

      _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).set(objectKey, newAccountObject));

      _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).set('accounts', immutable.List(newArrays))); // this.#_accounts = this.#_accounts.concat(newArrays)


      this.updateLength();
      return _objectSpread({}, newAccountObject);
    }
  }, {
    key: "importAccountsFromPrivateKeyList",
    value: function importAccountsFromPrivateKeyList(privateKeyList) {
      if (!laksaUtils.isArray(privateKeyList)) throw new Error('privateKeyList has to be Array<String>');
      var Imported = [];

      for (var i = 0; i < privateKeyList.length; i += 1) {
        Imported.push(this.importAccountFromPrivateKey(privateKeyList[i]));
      }

      return Imported;
    } //-------

  }, {
    key: "removeOneAccountByIndex",
    value: function removeOneAccountByIndex(index) {
      if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');
      var addressRef = this.getAccountByIndex(index);

      if (addressRef !== undefined && addressRef.address) {
        this.removeOneAccountByAddress(addressRef.address);
      }
    } //---------

  }, {
    key: "getWalletAddresses",
    value: function getWalletAddresses() {
      var _this2 = this;

      return this.getIndexKeys().map(function (index) {
        var accountFound = _this2.getAccountByIndex(parseInt(index, 10));

        if (accountFound) {
          return accountFound.address;
        }

        return false;
      }).filter(function (d) {
        return !!d;
      });
    }
  }, {
    key: "getWalletPublicKeys",
    value: function getWalletPublicKeys() {
      var _this3 = this;

      return this.getIndexKeys().map(function (index) {
        var accountFound = _this3.getAccountByIndex(parseInt(index, 10));

        if (accountFound) {
          return accountFound.publicKey;
        }

        return false;
      }).filter(function (d) {
        return !!d;
      });
    }
  }, {
    key: "getWalletPrivateKeys",
    value: function getWalletPrivateKeys() {
      var _this4 = this;

      return this.getIndexKeys().map(function (index) {
        var accountFound = _this4.getAccountByIndex(parseInt(index, 10));

        if (accountFound) {
          return accountFound.privateKey;
        }

        return false;
      }).filter(function (d) {
        return !!d;
      });
    }
  }, {
    key: "updateAccountByAddress",
    // -----------
    value: function updateAccountByAddress(address, newObject) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
      if (!laksaUtils.isObject(newObject)) throw new Error('new account Object is not correct');
      var newAccountObject = Object.assign({}, newObject, {
        updatedTime: new Date()
      });

      _classPrivateFieldSet(this, _accounts2, _classPrivateFieldGet(this, _accounts2).update(address, function () {
        return newAccountObject;
      }));

      return true;
    } // -----------

  }, {
    key: "encryptAllAccounts",
    // -----------
    value: function () {
      var _encryptAllAccounts = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(password, options) {
        var _this5 = this;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.getIndexKeys().forEach(function (index) {
                  var accountObject = _this5.getAccountByIndex(parseInt(index, 10));

                  if (accountObject) {
                    var address = accountObject.address;

                    _this5.encryptAccountByAddress(address, password, options, encryptedBy.WALLET);
                  }
                });
                return _context.abrupt("return", true);

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function encryptAllAccounts(_x, _x2) {
        return _encryptAllAccounts.apply(this, arguments);
      };
    }()
  }, {
    key: "decryptAllAccounts",
    value: function () {
      var _decryptAllAccounts = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(password) {
        var _this6 = this;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.getIndexKeys().forEach(function (index) {
                  var accountObject = _this6.getAccountByIndex(parseInt(index, 10));

                  if (accountObject) {
                    var address = accountObject.address,
                        LastEncryptedBy = accountObject.LastEncryptedBy;

                    if (LastEncryptedBy === encryptedBy.WALLET) {
                      _this6.decryptAccountByAddress(address, password, encryptedBy.WALLET);
                    } else {
                      console.error("address ".concat(address, " is protected by account psw"));
                      console.error('use /decryptAccountByAddress/ instead');
                    }
                  }
                });
                return _context2.abrupt("return", true);

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function decryptAllAccounts(_x3) {
        return _decryptAllAccounts.apply(this, arguments);
      };
    }()
  }, {
    key: "encryptAccountByAddress",
    value: function () {
      var _encryptAccountByAddress = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(address, password, options, by) {
        var accountObject, privateKey, crypto, encryptedObject;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                accountObject = this.getAccountByAddress(address);

                if (!(accountObject !== undefined)) {
                  _context3.next = 8;
                  break;
                }

                privateKey = accountObject.privateKey, crypto = accountObject.crypto;

                if (!(privateKey !== undefined && privateKey !== ENCRYPTED && crypto === undefined)) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 6;
                return accountObject.encrypt(password, options);

              case 6:
                encryptedObject = _context3.sent;
                return _context3.abrupt("return", this.updateAccountByAddress(address, Object.assign({}, encryptedObject, {
                  LastEncryptedBy: by || encryptedBy.ACCOUNT
                })));

              case 8:
                return _context3.abrupt("return", false);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function encryptAccountByAddress(_x4, _x5, _x6, _x7) {
        return _encryptAccountByAddress.apply(this, arguments);
      };
    }()
  }, {
    key: "decryptAccountByAddress",
    value: function () {
      var _decryptAccountByAddress = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(address, password, by) {
        var accountObject, privateKey, crypto, decryptedObject;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                accountObject = this.getAccountByAddress(address);

                if (!(accountObject !== undefined)) {
                  _context4.next = 8;
                  break;
                }

                privateKey = accountObject.privateKey, crypto = accountObject.crypto;

                if (!(privateKey !== undefined && privateKey === ENCRYPTED && laksaUtils.isObject(crypto))) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 6;
                return accountObject.decrypt(password);

              case 6:
                decryptedObject = _context4.sent;
                return _context4.abrupt("return", this.updateAccountByAddress(address, Object.assign({}, decryptedObject, {
                  LastEncryptedBy: by || encryptedBy.ACCOUNT
                })));

              case 8:
                return _context4.abrupt("return", false);

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function decryptAccountByAddress(_x8, _x9, _x10) {
        return _decryptAccountByAddress.apply(this, arguments);
      };
    }()
  }, {
    key: "setDefaultAccount",
    value: function setDefaultAccount(obj) {
      if (laksaUtils.isAddress(obj)) {
        this.defaultAccount = this.getAccountByAddress(obj);
      } else if (laksaUtils.isAddress(obj.address)) {
        this.defaultAccount = this.getAccountByAddress(obj.address).address;
      }

      return this;
    }
  }, {
    key: "setSigner",
    value: function setSigner(obj) {
      if (laksaUtils.isAddress(obj)) {
        this.signer = this.getAccountByAddress(obj);
      } else if (laksaUtils.isAddress(obj.address)) {
        this.signer = this.getAccountByAddress(obj.address).address;
      }

      return this;
    } // sign method for Transaction bytes

  }, {
    key: "sign",
    value: function () {
      var _sign = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee5(tx) {
        var signerAccount, balance, withNonce;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.signer) {
                  _context5.next = 2;
                  break;
                }

                throw new Error('This signer is not found');

              case 2:
                _context5.prev = 2;
                signerAccount = this.getAccountByAddress(this.signer);
                _context5.next = 6;
                return this.messenger.send({
                  method: 'GetBalance',
                  params: [signerAccount.address]
                });

              case 6:
                balance = _context5.sent;

                if (!(typeof balance.nonce !== 'number')) {
                  _context5.next = 9;
                  break;
                }

                throw new Error('Could not get nonce');

              case 9:
                withNonce = tx.map(function (txObj) {
                  return _objectSpread({}, txObj, {
                    nonce: balance.nonce + 1,
                    pubKey: signerAccount.publicKey
                  });
                });
                return _context5.abrupt("return", withNonce.map(function (txObj) {
                  // @ts-ignore
                  return _objectSpread({}, txObj, {
                    signature: signerAccount.sign(withNonce.bytes)
                  });
                }));

              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5["catch"](2);
                throw _context5.t0;

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 13]]);
      }));

      return function sign(_x11) {
        return _sign.apply(this, arguments);
      };
    }()
  }, {
    key: "accounts",
    get: function get() {
      return _classPrivateFieldGet(this, _accounts2).get('accounts').toArray();
    },
    set: function set(value) {
      if (value !== undefined) {
        throw new Error('you should not set "accounts" directly, use internal functions');
      }
    }
  }]);

  return Wallet;
}();

var _accounts2 = new WeakMap();

exports.Wallet = Wallet;
