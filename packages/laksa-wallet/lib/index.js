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

require('core-js/modules/es6.weak-map');
require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
require('core-js/modules/es6.promise');
require('core-js/modules/es6.array.sort');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
require('core-js/modules/es6.regexp.split');
require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/web.dom.iterable');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _classPrivateFieldSet = _interopDefault(require('@babel/runtime/helpers/classPrivateFieldSet'));
var _classPrivateFieldGet = _interopDefault(require('@babel/runtime/helpers/classPrivateFieldGet'));
var laksaUtils = require('laksa-utils');
var immutable = require('immutable');
var bip39 = _interopDefault(require('bip39'));
var hdkey = _interopDefault(require('hdkey'));
var account = require('laksa-account');

var ENCRYPTED = 'ENCRYPTED';
var encryptedBy = {
  ACCOUNT: 'account',
  WALLET: 'wallet'
};

var Wallet =
/*#__PURE__*/
function () {
  function Wallet(messenger) {
    var _this = this;

    _classCallCheck(this, Wallet);

    _defineProperty(this, "defaultAccount", void 0);

    _accounts.set(this, {
      writable: true,
      value: immutable.Map({
        accounts: immutable.List([])
      })
    });

    _defineProperty(this, "createAccount", function () {
      var accountInstance = new account.Account(_this.messenger);
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

    _defineProperty(this, "exportAccountByAddress",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(address, password) {
        var options,
            accountToExport,
            result,
            _args = arguments;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {
                  level: 1024
                };
                accountToExport = _this.getAccountByAddress(address);

                if (!accountToExport) {
                  _context.next = 9;
                  break;
                }

                _context.next = 5;
                return accountToExport.toFile(password, options);

              case 5:
                result = _context.sent;
                return _context.abrupt("return", result);

              case 9:
                return _context.abrupt("return", false);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "importAccountFromPrivateKey", function (privateKey) {
      var accountInstance = new account.Account(_this.messenger);
      var accountObject = accountInstance.importAccount(privateKey);
      return _this.addAccount(accountObject);
    });

    _defineProperty(this, "importAccountFromKeyStore",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(keyStore, password) {
        var accountInstance, accountObject;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                accountInstance = new account.Account(_this.messenger);
                _context2.next = 3;
                return accountInstance.fromFile(keyStore, password);

              case 3:
                accountObject = _context2.sent;
                return _context2.abrupt("return", _this.addAccount(accountObject));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(this, "removeOneAccountByAddress", function (address) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');

      var addressRef = _this.getAccountByAddress(address);

      if (addressRef !== undefined) {
        var currentArray = _classPrivateFieldGet(_this, _accounts).get('accounts').toArray();

        delete currentArray[addressRef.index];

        if (_this.signer !== undefined && addressRef.address === _this.signer.address) {
          _this.signer = undefined;
          _this.defaultAccount = undefined;
        }

        _classPrivateFieldSet(_this, _accounts, _classPrivateFieldGet(_this, _accounts).set('accounts', immutable.List(currentArray)));

        _classPrivateFieldSet(_this, _accounts, _classPrivateFieldGet(_this, _accounts).delete(address));

        _this.updateLength();
      }

      _this.updateLength();
    });

    _defineProperty(this, "getAccountByAddress", function (address) {
      if (!laksaUtils.isAddress(address)) throw new Error('address is not correct');
      return _classPrivateFieldGet(_this, _accounts).get(address);
    });

    _defineProperty(this, "getAccountByIndex", function (index) {
      if (!laksaUtils.isNumber(index)) throw new Error('index is not correct');

      var address = _classPrivateFieldGet(_this, _accounts).get('accounts').get(index);

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
    key: "generateMnemonic",
    value: function generateMnemonic() {
      return bip39.generateMnemonic();
    }
  }, {
    key: "importAccountFromMnemonic",
    value: function importAccountFromMnemonic(phrase, index) {
      if (!this.isValidMnemonic(phrase)) {
        throw new Error("Invalid mnemonic phrase: ".concat(phrase));
      }

      var seed = bip39.mnemonicToSeed(phrase);
      var hdKey = hdkey.fromMasterSeed(seed);
      var childKey = hdKey.derive("m/44'/313'/0'/0/".concat(index));
      var privateKey = childKey.privateKey.toString('hex');
      return this.importAccountFromPrivateKey(privateKey);
    }
  }, {
    key: "isValidMnemonic",
    value: function isValidMnemonic(phrase) {
      if (phrase.trim().split(/\s+/g).length < 12) {
        return false;
      }

      return bip39.validateMnemonic(phrase);
    }
  }, {
    key: "defaultSetSigner",
    value: function defaultSetSigner() {
      if (this.getWalletAccounts().length === 1 && this.signer === undefined) {
        this.setSigner(this.getWalletAccounts()[0]);
      }
    }
    /**
     * @function {updateLength}
     * @return {number} {wallet account counts}
     */

  }, {
    key: "updateLength",
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

      var arrays = _classPrivateFieldGet(this, _accounts).get('accounts').toArray();

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
      if (this.getAccountByAddress(accountObject.address)) return false;
      var newAccountObject = accountObject;
      newAccountObject.createTime = new Date();
      newAccountObject.index = this.getCurrentMaxIndex() + 1;
      var objectKey = newAccountObject.address;
      var newIndex = newAccountObject.index;

      var newArrays = _classPrivateFieldGet(this, _accounts).get('accounts');

      newArrays = newArrays.set(newIndex, objectKey);

      _classPrivateFieldSet(this, _accounts, _classPrivateFieldGet(this, _accounts).set(objectKey, newAccountObject));

      _classPrivateFieldSet(this, _accounts, _classPrivateFieldGet(this, _accounts).set('accounts', immutable.List(newArrays))); // this.#_accounts = this.#_accounts.concat(newArrays)


      this.updateLength();
      this.defaultSetSigner();
      return newAccountObject;
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
      var newAccountObject = newObject;
      newAccountObject.updateTime = new Date();

      _classPrivateFieldSet(this, _accounts, _classPrivateFieldGet(this, _accounts).update(address, function () {
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
      _regeneratorRuntime.mark(function _callee3(password, options) {
        var keys, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, index, accountObject, address, things;

        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                keys = this.getIndexKeys();
                results = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 5;

                for (_iterator = keys[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  index = _step.value;
                  accountObject = this.getAccountByIndex(parseInt(index, 10));

                  if (accountObject) {
                    address = accountObject.address;
                    things = this.encryptAccountByAddress(address, password, options, encryptedBy.WALLET);
                    results.push(things);
                  }
                }

                _context3.next = 13;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](5);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 13:
                _context3.prev = 13;
                _context3.prev = 14;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 16:
                _context3.prev = 16;

                if (!_didIteratorError) {
                  _context3.next = 19;
                  break;
                }

                throw _iteratorError;

              case 19:
                return _context3.finish(16);

              case 20:
                return _context3.finish(13);

              case 21:
                _context3.next = 23;
                return Promise.all(results);

              case 23:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[5, 9, 13, 21], [14,, 16, 20]]);
      }));

      function encryptAllAccounts(_x5, _x6) {
        return _encryptAllAccounts.apply(this, arguments);
      }

      return encryptAllAccounts;
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
      _regeneratorRuntime.mark(function _callee4(password) {
        var keys, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, index, accountObject, address, LastEncryptedBy, things;

        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                keys = this.getIndexKeys();
                results = [];
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context4.prev = 5;

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

                _context4.next = 13;
                break;

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](5);
                _didIteratorError2 = true;
                _iteratorError2 = _context4.t0;

              case 13:
                _context4.prev = 13;
                _context4.prev = 14;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 16:
                _context4.prev = 16;

                if (!_didIteratorError2) {
                  _context4.next = 19;
                  break;
                }

                throw _iteratorError2;

              case 19:
                return _context4.finish(16);

              case 20:
                return _context4.finish(13);

              case 21:
                _context4.next = 23;
                return Promise.all(results);

              case 23:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[5, 9, 13, 21], [14,, 16, 20]]);
      }));

      function decryptAllAccounts(_x7) {
        return _decryptAllAccounts.apply(this, arguments);
      }

      return decryptAllAccounts;
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
      _regeneratorRuntime.mark(function _callee5(address, password, options, by) {
        var accountObject, crypto, encryptedObject, newAccount, tempAccount, updateStatus;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                accountObject = this.getAccountByAddress(address);

                if (!(accountObject !== undefined)) {
                  _context5.next = 23;
                  break;
                }

                crypto = accountObject.crypto;

                if (!(crypto === undefined)) {
                  _context5.next = 23;
                  break;
                }

                encryptedObject = {};

                if (!(typeof accountObject.encrypt === 'function')) {
                  _context5.next = 11;
                  break;
                }

                _context5.next = 8;
                return accountObject.encrypt(password, options);

              case 8:
                encryptedObject = _context5.sent;
                _context5.next = 16;
                break;

              case 11:
                newAccount = new account.Account(this.messenger);
                tempAccount = newAccount.importAccount(accountObject.privateKey);
                _context5.next = 15;
                return tempAccount.encrypt(password, options);

              case 15:
                encryptedObject = _context5.sent;

              case 16:
                encryptedObject.LastEncryptedBy = by || encryptedBy.ACCOUNT;
                updateStatus = this.updateAccountByAddress(address, encryptedObject);

                if (!(updateStatus === true)) {
                  _context5.next = 22;
                  break;
                }

                return _context5.abrupt("return", encryptedObject);

              case 22:
                return _context5.abrupt("return", false);

              case 23:
                return _context5.abrupt("return", false);

              case 24:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function encryptAccountByAddress(_x8, _x9, _x10, _x11) {
        return _encryptAccountByAddress.apply(this, arguments);
      }

      return encryptAccountByAddress;
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
      _regeneratorRuntime.mark(function _callee6(address, password, by) {
        var accountObject, crypto, decryptedObject, decryptedTempObject, newAccount, updateStatus;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                accountObject = this.getAccountByAddress(address);

                if (!(accountObject !== undefined)) {
                  _context6.next = 23;
                  break;
                }

                crypto = accountObject.crypto;

                if (!laksaUtils.isObject(crypto)) {
                  _context6.next = 23;
                  break;
                }

                decryptedObject = {};

                if (!(typeof accountObject.decrypt === 'function')) {
                  _context6.next = 11;
                  break;
                }

                _context6.next = 8;
                return accountObject.decrypt(password);

              case 8:
                decryptedObject = _context6.sent;
                _context6.next = 16;
                break;

              case 11:
                _context6.next = 13;
                return account.decryptAccount(accountObject, password);

              case 13:
                decryptedTempObject = _context6.sent;
                newAccount = new account.Account(this.messenger);
                decryptedObject = newAccount.importAccount(decryptedTempObject.privateKey);

              case 16:
                decryptedObject.LastEncryptedBy = by || encryptedBy.ACCOUNT;
                updateStatus = this.updateAccountByAddress(address, decryptedObject);

                if (!(updateStatus === true)) {
                  _context6.next = 22;
                  break;
                }

                return _context6.abrupt("return", decryptedObject);

              case 22:
                return _context6.abrupt("return", false);

              case 23:
                return _context6.abrupt("return", false);

              case 24:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function decryptAccountByAddress(_x12, _x13, _x14) {
        return _decryptAccountByAddress.apply(this, arguments);
      }

      return decryptAccountByAddress;
    }()
    /**
     * @function {setSigner}
     * @param  {Account} obj {account object}
     * @return {Wallet} {wallet instance}
     */

  }, {
    key: "setSigner",
    value: function setSigner(obj) {
      if (laksaUtils.isString(obj)) {
        this.signer = this.getAccountByAddress(obj);
        this.defaultAccount = this.getAccountByAddress(obj);
      } else if (laksaUtils.isObject(obj) && laksaUtils.isAddress(obj.address)) {
        this.signer = this.getAccountByAddress(obj.address);
        this.defaultAccount = this.getAccountByAddress(obj.address);
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
      _regeneratorRuntime.mark(function _callee7(tx, _ref3) {
        var address, password, signerAccount, result;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                address = _ref3.address, password = _ref3.password;

                if (!(!this.signer && address === undefined)) {
                  _context7.next = 3;
                  break;
                }

                throw new Error('This signer is not found or address is not defined');

              case 3:
                _context7.prev = 3;
                signerAccount = this.getAccountByAddress(address === undefined ? this.signer : address);
                _context7.next = 7;
                return signerAccount.signTransaction(tx, password);

              case 7:
                result = _context7.sent;
                return _context7.abrupt("return", result);

              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7["catch"](3);
                throw _context7.t0;

              case 14:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[3, 11]]);
      }));

      function sign(_x15, _x16) {
        return _sign.apply(this, arguments);
      }

      return sign;
    }()
  }, {
    key: "accounts",
    get: function get() {
      return _classPrivateFieldGet(this, _accounts).get('accounts').toArray();
    },
    set: function set(value) {
      if (value !== undefined) {
        throw new Error('you should not set "accounts" directly, use internal functions');
      }
    }
  }]);

  return Wallet;
}();

var _accounts = new WeakMap();

exports.Wallet = Wallet;
exports.ENCRYPTED = ENCRYPTED;
exports.encryptedBy = encryptedBy;
