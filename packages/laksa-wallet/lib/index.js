'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
require('core-js/modules/es6.weak-map');
var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('core-js/modules/es6.promise');
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

      var addressRef = _this.getAccountByAddress(address);

      if (addressRef !== undefined) {
        var currentArray = _classPrivateFieldGet(_this, _accounts2).get('accounts').toArray();

        delete currentArray[addressRef.index];

        _classPrivateFieldSet(_this, _accounts2, _classPrivateFieldGet(_this, _accounts2).set('accounts', immutable.List(currentArray)));

        _classPrivateFieldSet(_this, _accounts2, _classPrivateFieldGet(_this, _accounts2).delete(address));

        _this.updateLength();
      }

      _this.updateLength();
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
     * @function {updateLength}
     * @return {number} {wallet account counts}
     */
    value: function updateLength() {
      this.length = this.getIndexKeys().length;
    }
    /**
     * @function {getIndexKeys}
     * @return {Array<string>} {index keys to the wallet}
     */

  }, {
    key: "getIndexKeys",
    value: function getIndexKeys() {
      var isCorrectKeys = function isCorrectKeys(n) {
        return /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20;
      };

      var arrays = _classPrivateFieldGet(this, _accounts2).get('accounts').toArray();

      return Object.keys(arrays).filter(isCorrectKeys);
    }
    /**
     * @function {getCurrentMaxIndex}
     * @return {number} {max index to the wallet}
     */

  }, {
    key: "getCurrentMaxIndex",
    value: function getCurrentMaxIndex() {
      var diff = function diff(a, b) {
        return b - a;
      }; // const sorted = R.sort(diff, keyList)


      var sorted = this.getIndexKeys().sort(diff);
      return sorted[0] === undefined ? -1 : parseInt(sorted[0], 10);
    }
    /**
     * @function {addAccount}
     * @param  {Account} accountObject {account object}
     * @return {Account} {account object}
     */

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
    /**
     * @function {createAccount}
     * @return {Account} {account object}
     */

  }, {
    key: "importAccountsFromPrivateKeyList",

    /**
     * @function {importAccountsFromPrivateKeyList}
     * @param  {Array<PrivateKey>} privateKeyList {list of private keys}
     * @return {Array<Account>} {array of accounts}
     */
    value: function importAccountsFromPrivateKeyList(privateKeyList) {
      if (!laksaUtils.isArray(privateKeyList)) throw new Error('privateKeyList has to be Array<String>');
      var Imported = [];

      for (var i = 0; i < privateKeyList.length; i += 1) {
        Imported.push(this.importAccountFromPrivateKey(privateKeyList[i]));
      }

      return Imported;
    } //-------

    /**
     * @function {removeOneAccountByAddress}
     * @param  {Address} address {account address}
     * @return {undefined} {}
     */

  }, {
    key: "removeOneAccountByIndex",

    /**
     * @function {removeOneAccountByIndex}
     * @param  {number} index {index of account}
     * @return {undefined} {}
     */
    value: function removeOneAccountByIndex(index) {
      if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');
      var addressRef = this.getAccountByIndex(index);

      if (addressRef !== undefined && addressRef.address) {
        this.removeOneAccountByAddress(addressRef.address);
      }
    } //---------

    /**
     * @function {getAccountByAddress}
     * @param  {Address} address {account address}
     * @return {Account} {account object}
     */

  }, {
    key: "getWalletAddresses",

    /**
     * @function {getWalletAddresses}
     * @return {Array<Address>} {array of address}
     */
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
    /**
     * @function {getWalletPublicKeys}
     * @return {Array<PublicKey>} {array of public Key}
     */

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
    /**
     * @function {getWalletPrivateKeys}
     * @return {Array<PrivateKey>} {array of private key}
     */

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
    /**
     * @function getWalletAccounts
     * @return {Array<Account>} {array of account}
     */

  }, {
    key: "updateAccountByAddress",
    // -----------

    /**
     * @function {updateAccountByAddress}
     * @param  {Address} address   {account address}
     * @param  {Account} newObject {account object to be updated}
     * @return {boolean} {is successful}
     */
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

    /**
     * @function {cleanAllAccountsw}
     * @return {boolean} {is successful}
     */

  }, {
    key: "encryptAllAccounts",
    // -----------

    /**
     * @function {encryptAllAccounts}
     * @param  {string} password {password}
     * @param  {object} options  {encryption options}
     * @return {type} {description}
     */
    value: function () {
      var _encryptAllAccounts = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(password, options) {
        var keys, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, index, accountObject, address, things;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                keys = this.getIndexKeys();
                results = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 5;

                for (_iterator = keys[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  index = _step.value;
                  accountObject = this.getAccountByIndex(parseInt(index, 10));

                  if (accountObject) {
                    address = accountObject.address;
                    things = this.encryptAccountByAddress(address, password, options, encryptedBy.WALLET);
                    results.push(things);
                  }
                }

                _context.next = 13;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](5);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 13:
                _context.prev = 13;
                _context.prev = 14;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 16:
                _context.prev = 16;

                if (!_didIteratorError) {
                  _context.next = 19;
                  break;
                }

                throw _iteratorError;

              case 19:
                return _context.finish(16);

              case 20:
                return _context.finish(13);

              case 21:
                _context.next = 23;
                return Promise.all(results);

              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 9, 13, 21], [14,, 16, 20]]);
      }));

      return function encryptAllAccounts(_x, _x2) {
        return _encryptAllAccounts.apply(this, arguments);
      };
    }()
    /**
     * @function {decryptAllAccounts}
     * @param  {string} password {decrypt password}
     * @return {type} {description}
     */

  }, {
    key: "decryptAllAccounts",
    value: function () {
      var _decryptAllAccounts = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(password) {
        var keys, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, index, accountObject, address, LastEncryptedBy, things;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                keys = this.getIndexKeys();
                results = [];
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 5;

                for (_iterator2 = keys[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  index = _step2.value;
                  accountObject = this.getAccountByIndex(parseInt(index, 10));

                  if (accountObject) {
                    address = accountObject.address, LastEncryptedBy = accountObject.LastEncryptedBy;

                    if (LastEncryptedBy === encryptedBy.WALLET) {
                      things = this.decryptAccountByAddress(address, password, encryptedBy.WALLET);
                      results.push(things);
                    }
                  }
                }

                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](5);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 13:
                _context2.prev = 13;
                _context2.prev = 14;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 16:
                _context2.prev = 16;

                if (!_didIteratorError2) {
                  _context2.next = 19;
                  break;
                }

                throw _iteratorError2;

              case 19:
                return _context2.finish(16);

              case 20:
                return _context2.finish(13);

              case 21:
                _context2.next = 23;
                return Promise.all(results);

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[5, 9, 13, 21], [14,, 16, 20]]);
      }));

      return function decryptAllAccounts(_x3) {
        return _decryptAllAccounts.apply(this, arguments);
      };
    }()
    /**
     * @function {encryptAccountByAddress}
     * @param  {Address} address  {account address}
     * @param  {string} password {password string for encryption}
     * @param  {object} options  {encryption options}
     * @param  {Symbol} by       {Symbol that encrypted by}
     * @return {boolean} {status}
     */

  }, {
    key: "encryptAccountByAddress",
    value: function () {
      var _encryptAccountByAddress = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(address, password, options, by) {
        var accountObject, privateKey, crypto, encryptedObject, updateStatus;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                accountObject = this.getAccountByAddress(address);

                if (!(accountObject !== undefined)) {
                  _context3.next = 13;
                  break;
                }

                privateKey = accountObject.privateKey, crypto = accountObject.crypto;

                if (!(privateKey !== undefined && _typeof(privateKey) !== 'symbol' && crypto === undefined)) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 6;
                return accountObject.encrypt(password, options);

              case 6:
                encryptedObject = _context3.sent;
                updateStatus = this.updateAccountByAddress(address, Object.assign({}, encryptedObject, {
                  LastEncryptedBy: by || encryptedBy.ACCOUNT
                }));

                if (!(updateStatus === true)) {
                  _context3.next = 12;
                  break;
                }

                return _context3.abrupt("return", this);

              case 12:
                return _context3.abrupt("return", false);

              case 13:
                return _context3.abrupt("return", false);

              case 14:
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
    /**
     * @function {decryptAccountByAddress}
     * @param  {Address} address  {account address}
     * @param  {string} password {password string to decrypt}
     * @param  {Symbol} by       {Symbol that decrypted by}
     * @return {boolean} {status}
     */

  }, {
    key: "decryptAccountByAddress",
    value: function () {
      var _decryptAccountByAddress = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(address, password, by) {
        var accountObject, privateKey, crypto, decryptedObject, updateStatus;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                accountObject = this.getAccountByAddress(address);

                if (!(accountObject !== undefined)) {
                  _context4.next = 13;
                  break;
                }

                privateKey = accountObject.privateKey, crypto = accountObject.crypto;

                if (!(privateKey !== undefined && _typeof(privateKey) === 'symbol' && laksaUtils.isObject(crypto))) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 6;
                return accountObject.decrypt(password);

              case 6:
                decryptedObject = _context4.sent;
                updateStatus = this.updateAccountByAddress(address, Object.assign({}, decryptedObject, {
                  LastEncryptedBy: by || encryptedBy.ACCOUNT
                }));

                if (!(updateStatus === true)) {
                  _context4.next = 12;
                  break;
                }

                return _context4.abrupt("return", this);

              case 12:
                return _context4.abrupt("return", false);

              case 13:
                return _context4.abrupt("return", false);

              case 14:
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
    /**
     * @function {setSigner}
     * @param  {Account} obj {account object}
     * @return {Wallet} {wallet instance}
     */

  }, {
    key: "setSigner",
    value: function setSigner(obj) {
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
