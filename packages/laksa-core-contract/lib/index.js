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

require('core-js/modules/es6.array.find');
require('core-js/modules/es6.regexp.match');
require('core-js/modules/es6.number.constructor');
var laksaUtils = require('laksa-utils');
require('core-js/modules/es6.function.name');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
require('core-js/modules/es6.object.assign');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.object.freeze');
require('core-js/modules/es6.regexp.replace');
require('core-js/modules/es6.string.repeat');
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('core-js/modules/es6.promise');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _applyDecoratedDescriptor = _interopDefault(require('@babel/runtime/helpers/applyDecoratedDescriptor'));
var laksaCoreTransaction = require('laksa-core-transaction');
var laksaShared = require('laksa-shared');
var _toArray = _interopDefault(require('@babel/runtime/helpers/toArray'));
require('core-js/modules/es6.regexp.to-string');
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var laksaCoreCrypto = require('laksa-core-crypto');

/**
 * @var {Object<String>} Matchers
 * @description Matchers object with multiple patterns
 */

var Matchers = {
  ByStrX: /^ByStr[0-9]+$/,
  String: /^String$/,
  Uint: /^Uint(32|64|128|256)$/,
  Int: /^Int(32|64|128|256)$/,
  BNum: /^BNum$/
  /**
   * @var {Array<Object>} validators
   * @description valitador objects
   */

};
var validators = [{
  type: 'ByStrX',
  match: function match(type) {
    return Matchers.ByStrX.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isByStrX.test(value);
  },
  transformer: function transformer(value) {
    return String(value);
  }
}, {
  type: 'UInt',
  match: function match(type) {
    return Matchers.Uint.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isUint.test(value);
  },
  transformer: function transformer(value) {
    return Number(value, 10);
  }
}, {
  type: 'Int',
  match: function match(type) {
    return Matchers.Int.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isInt.test(value);
  },
  transformer: function transformer(value) {
    return Number(value, 10);
  }
}, {
  type: 'BNum',
  match: function match(type) {
    return Matchers.BNum.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isBN.test(new laksaUtils.BN(value));
  },
  transformer: function transformer(value) {
    return Number(value, 10);
  }
}, {
  type: 'String',
  match: function match(type) {
    return Matchers.String.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isString.test(value);
  },
  transformer: function transformer(value) {
    return String(value);
  }
}];
/**
 * @function validate
 * @description validate param type and it's value
 * @param  {String} type  - param type
 * @param  {any} value - param value to validate
 * @return {Boolean} validate result
 */

var validate = function validate(type, value) {
  return validators.some(function (val) {
    return val.match(type) && val.validatorFn(value);
  });
};
/**
 * @function transform
 * @description transform a value to it's validator format
 * @param  {String} type  - param type
 * @param  {any} value - param value to validate
 * @return {any} transform result
 */

var transform = function transform(type, value) {
  if (validate(type, value)) {
    var found = validators.find(function (d) {
      return d.match(type);
    });
    return found.transformer(value);
  } else {
    throw new Error('Cannot transform');
  }
};

/**
 * @function getParamTypes
 * @description extract param types for abi object
 * @param  {Array<Object>} list {description}
 * @return {Array<Object>} {description}
 */
function getParamTypes(list) {
  var result = [];
  list.map(function (obj, index) {
    result[index] = obj.type;
    return false;
  });
  return result;
}
/**
 * @class ABI
 * @description ABI instance
 * @param  {Object} abi abi object
 * @return {ABI} ABI instance
 */


var ABI =
/*#__PURE__*/
function () {
  function ABI(abi) {
    _classCallCheck(this, ABI);

    /**
     * @var {Array} events
     * @memberof ABI
     * @description events
     */
    this.events = abi !== undefined ? abi.events : []; // Array<object>

    /**
     * @var {Array} fields
     * @memberof ABI
     * @description fields
     */

    this.fields = abi !== undefined ? abi.fields : []; // Array<object>

    /**
     * @var {String} name
     * @memberof ABI
     * @description name
     */

    this.name = abi !== undefined ? abi.name : ''; // string

    /**
     * @var {Array} params
     * @memberof ABI
     * @description params
     */

    this.params = abi !== undefined ? abi.params : []; // Array<object>

    /**
     * @var {Array} transitions
     * @memberof ABI
     * @description transitions
     */

    this.transitions = abi !== undefined ? abi.transitions : []; // Array<object>
  }
  /**
   * @function getName
   * @memberof ABI
   * @description name getter
   * @return {String} ABI.name
   */


  _createClass(ABI, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
    /**
     * @function getInitParams
     * @memberof ABI
     * @description params getter
     * @return {String} ABI.params
     */

  }, {
    key: "getInitParams",
    value: function getInitParams() {
      return this.params;
    }
    /**
     * @function getInitParamTypes
     * @memberof ABI
     * @description get param types array
     * @return {Array<Object>} param types
     */

  }, {
    key: "getInitParamTypes",
    value: function getInitParamTypes() {
      if (this.params.length > 0) {
        return getParamTypes(this.params);
      } else return [];
    }
    /**
     * @function getFields
     * @memberof ABI
     * @description fields getter
     * @return {Array} ABI.fields
     */

  }, {
    key: "getFields",
    value: function getFields() {
      return this.fields;
    }
    /**
     * @function getFieldsTypes
     * @memberof ABI
     * @description get fields types array
     * @return {Array<Object>} fields types
     */

  }, {
    key: "getFieldsTypes",
    value: function getFieldsTypes() {
      if (this.fields.length > 0) {
        return getParamTypes(this.fields);
      } else return [];
    }
    /**
     * @function getTransitions
     * @memberof ABI
     * @description transitions getter
     * @return {Array<Object>} ABI.transitions
     */

  }, {
    key: "getTransitions",
    value: function getTransitions() {
      return this.transitions;
    }
    /**
     * @function getTransitionsParamTypes
     * @memberof ABI
     * @description get transitions types array
     * @return {Array<Object>} transitions types
     */

  }, {
    key: "getTransitionsParamTypes",
    value: function getTransitionsParamTypes() {
      var returnArray = [];

      if (this.transitions.length > 0) {
        for (var i = 0; i < this.transitions.length; i += 1) {
          returnArray[i] = getParamTypes(this.transitions[i].params);
        }
      }

      return returnArray;
    }
    /**
     * @function getEvents
     * @memberof ABI
     * @description events getter
     * @return {Array<Object>} ABI.events
     */

  }, {
    key: "getEvents",
    value: function getEvents() {
      return this.events;
    }
  }]);

  return ABI;
}();

/**
 * @var {Object} ContractStatus
 * @description  immutable contract status
 */

var ContractStatus = Object.freeze({
  INITIALISED: 'initialised',
  TESTED: 'tested',
  ERROR: 'error',
  SIGNED: 'signed',
  SENT: 'sent',
  REJECTED: 'rejected',
  DEPLOYED: 'deployed'
});
/**
 * @function setParamValues
 * @description set param values
 * @param  {Array<Object>} rawParams - init params get from ABI
 * @param  {Array<Object>} newValues - init params set for ABI
 * @return {Array<objObjectect>} new array of params objects
 */

var setParamValues = function setParamValues(rawParams, newValues) {
  var newParams = [];
  rawParams.forEach(function (v, i) {
    if (!validate(v.type, newValues[i].value)) {
      throw new TypeError("Type validator failed,with <".concat(v.vname, ":").concat(v.type, ">"));
    } // FIXME:it may change cause local scilla runner return the `name` not `vname`
    // But when call or make transaction, remote node only accpet `vname`


    var newObj = Object.assign({}, v, {
      value: newValues[i].value,
      vname: v.name ? v.name : v.vname
    });

    if (newObj.name) {
      delete newObj.name;
    }

    newParams.push(newObj);
  });
  return newParams;
};

var _dec, _dec2, _dec3, _dec4, _class;
/**
 * @class Contract
 * @param  {Object}  params - contract params
 * @param  {Contracts} factory - contract factory
 * @param  {String} status -Contract status
 * @return {Contract} Contract instance
 */

var Contract = (_dec = laksaShared.assertObject({
  gasLimit: ['isLong', 'required'],
  gasPrice: ['isBN', 'required'],
  toDS: ['isBoolean', 'optional']
}), _dec2 = laksaShared.assertObject({
  transition: ['isString', 'required'],
  params: ['isArray', 'required'],
  amount: ['isBN', 'optional'],
  gasLimit: ['isLong', 'optional'],
  gasPrice: ['isBN', 'optional'],
  toDS: ['isBoolean', 'optional']
}), _dec3 = laksaShared.assertObject({
  gasLimit: ['isLong', 'required'],
  gasPrice: ['isBN', 'required'],
  toDS: ['isBoolean', 'optional']
}), _dec4 = laksaShared.assertObject({
  transition: ['isString', 'required'],
  params: ['isArray', 'required'],
  amount: ['isBN', 'required'],
  gasLimit: ['isLong', 'required'],
  gasPrice: ['isBN', 'required'],
  toDS: ['isBoolean', 'optional']
}), (_class =
/*#__PURE__*/
function () {
  function Contract(params, factory) {
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ContractStatus.INITIALISED;

    _classCallCheck(this, Contract);

    /**
     * @var {String} code
     * @memberof Contract.prototype
     * @description code
     */
    this.code = params.code || '';
    /**
     * @var {Array<Object>} init
     * @memberof Contract.prototype
     * @description init
     */

    this.init = params.init || [];
    /**
     * @var {Number} version
     * @memberof Contract.prototype
     * @description version
     */

    this.version = params.version || 0;
    /**
     * @var {String} ContractAddress
     * @memberof Contract.prototype
     * @description ContractAddress
     */

    this.ContractAddress = params.ContractAddress || undefined;
    /**
     * @var {Messenger} messenger
     * @memberof Contract.prototype
     * @description messenger
     */

    this.messenger = factory.messenger;
    /**
     * @var {Wallet} signer
     * @memberof Contract.prototype
     * @description signer
     */

    this.signer = factory.signer;
    /**
     * @var {String} status
     * @memberof Contract.prototype
     * @description status
     */

    this.status = status;
    /**
     * @var {Transaction|Object} transaction
     * @memberof Contract.prototype
     * @description transaction
     */

    this.transaction = {};
  }
  /**
   * @function isInitialised
   * @description return true if the contract has been initialised
   * @memberof Contract
   * @return {Boolean}
   */


  _createClass(Contract, [{
    key: "isInitialised",
    value: function isInitialised() {
      return this.status === ContractStatus.INITIALISED;
    }
    /**
     * @function isSigned
     * @description return true if the contract has been signed
     * @memberof Contract
     * @return {Boolean}
     */

  }, {
    key: "isSigned",
    value: function isSigned() {
      return this.status === ContractStatus.SIGNED;
    }
    /**
     * @function isSent
     * @description return true if the contract has been sent
     * @memberof Contract
     * @return {Boolean}
     */

  }, {
    key: "isSent",
    value: function isSent() {
      return this.status === ContractStatus.SENT;
    }
    /**
     * @function isDeployed
     * @description return true if the contract has been deployed
     * @memberof Contract
     * @return {Boolean}
     */

  }, {
    key: "isDeployed",
    value: function isDeployed() {
      return this.status === ContractStatus.DEPLOYED;
    }
    /**
     * @function isRejected
     * @description return true if the contract has been rejected
     * @memberof Contract
     * @return {Boolean}
     */

  }, {
    key: "isRejected",
    value: function isRejected() {
      return this.status === ContractStatus.REJECTED;
    }
    /**
     * @function deployPayload
     * @description return deploy payload
     * @memberof Contract
     * @return {Object} Deploy payload
     */

  }, {
    key: "setStatus",

    /**
     * @function setStatus
     * @description set Contract status
     * @memberof Contract
     * @param  {String} status - contract status during all life-time
     */
    value: function setStatus(status) {
      this.status = status;
    }
    /**
     * @function setInitParamsValues
     * @memberof Contract
     * @description set init params value and return Contract
     * @param  {Array<Object>} initParams    - init params get from ABI
     * @param  {Array<Object>} arrayOfValues - init params set for ABI
     * @return {Contract} - Contract instance
     */

  }, {
    key: "setInitParamsValues",
    value: function setInitParamsValues(initParams, arrayOfValues) {
      var result = setParamValues(initParams, arrayOfValues);
      this.init = result;
      return this;
    }
    /**
     * @function deploy
     * @memberof Contract
     * @description deploy Contract with a few parameters
     * @param {Object} deployObject
     * @param {Long} deployObject.gasLimit - gasLimit
     * @param {BN} deployObject.gasPrice -gasPrice
     * @param {?Boolean} deployObject.toDS - toDS
     * @param {?Account} deployObject.account - account to sign
     * @param {?String} deployObject.password - account's password if it's encrypted
     * @param {Number} deployObject.maxAttempts - max try when confirming transaction
     * @param {Number} deployObject.interval - retry interval
     * @return {Promise<Contract>} Contract with Contract Status
     */

  }, {
    key: "deploy",
    value: function () {
      var _deploy = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(_ref) {
        var _ref$gasLimit, gasLimit, _ref$gasPrice, gasPrice, _ref$account, account, password, _ref$maxAttempts, maxAttempts, _ref$interval, interval, _ref$toDS, toDS;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref$gasLimit = _ref.gasLimit, gasLimit = _ref$gasLimit === void 0 ? laksaUtils.Long.fromNumber(2500) : _ref$gasLimit, _ref$gasPrice = _ref.gasPrice, gasPrice = _ref$gasPrice === void 0 ? new laksaUtils.BN(100) : _ref$gasPrice, _ref$account = _ref.account, account = _ref$account === void 0 ? this.signer.signer : _ref$account, password = _ref.password, _ref$maxAttempts = _ref.maxAttempts, maxAttempts = _ref$maxAttempts === void 0 ? 20 : _ref$maxAttempts, _ref$interval = _ref.interval, interval = _ref$interval === void 0 ? 1000 : _ref$interval, _ref$toDS = _ref.toDS, toDS = _ref$toDS === void 0 ? false : _ref$toDS;

                if (!(!this.code || !this.init)) {
                  _context.next = 3;
                  break;
                }

                throw new Error('Cannot deploy without code or ABI.');

              case 3:
                _context.prev = 3;
                this.setDeployPayload({
                  gasLimit: gasLimit,
                  gasPrice: gasPrice,
                  toDS: toDS
                });
                _context.next = 7;
                return this.sendContract({
                  account: account,
                  password: password
                });

              case 7:
                _context.next = 9;
                return this.confirmTx(maxAttempts, interval);

              case 9:
                return _context.abrupt("return", this);

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](3);
                throw _context.t0;

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 12]]);
      }));

      function deploy(_x) {
        return _deploy.apply(this, arguments);
      }

      return deploy;
    }()
    /**
     * @function call
     * @memberof Contract
     * @description call a deployed contract with a set of parameters
     * @param {Object} callObject
     * @param {String} callObject.transition - transition name defined by smart contract
     * @param {Array<Object>} callObject.params -array of params send to transition
     * @param {?BN} callObject.amount - call amount
     * @param {?Boolean} callObject.toDS - toDS
     * @param {?Account} callObject.account - account to sign
     * @param {?String} callObject.password - account's password if it's encrypted
     * @param {Number} callObject.maxAttempts - max try when confirming transaction
     * @param {Number} callObject.interval - retry interval
     * @return {Promise<Contract>}
     */

  }, {
    key: "call",
    value: function () {
      var _call = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(_ref2) {
        var transition, params, _ref2$amount, amount, _ref2$gasLimit, gasLimit, _ref2$gasPrice, gasPrice, _ref2$account, account, password, _ref2$maxAttempts, maxAttempts, _ref2$interval, interval, _ref2$toDS, toDS;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                transition = _ref2.transition, params = _ref2.params, _ref2$amount = _ref2.amount, amount = _ref2$amount === void 0 ? new laksaUtils.BN(0) : _ref2$amount, _ref2$gasLimit = _ref2.gasLimit, gasLimit = _ref2$gasLimit === void 0 ? laksaUtils.Long.fromNumber(1000) : _ref2$gasLimit, _ref2$gasPrice = _ref2.gasPrice, gasPrice = _ref2$gasPrice === void 0 ? new laksaUtils.BN(100) : _ref2$gasPrice, _ref2$account = _ref2.account, account = _ref2$account === void 0 ? this.signer.signer : _ref2$account, password = _ref2.password, _ref2$maxAttempts = _ref2.maxAttempts, maxAttempts = _ref2$maxAttempts === void 0 ? 20 : _ref2$maxAttempts, _ref2$interval = _ref2.interval, interval = _ref2$interval === void 0 ? 1000 : _ref2$interval, _ref2$toDS = _ref2.toDS, toDS = _ref2$toDS === void 0 ? false : _ref2$toDS;

                if (this.ContractAddress) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", Promise.reject(Error('Contract has not been deployed!')));

              case 3:
                _context2.prev = 3;
                this.setCallPayload({
                  transition: transition,
                  params: params,
                  amount: amount,
                  gasLimit: gasLimit,
                  gasPrice: gasPrice,
                  toDS: toDS
                });
                _context2.next = 7;
                return this.sendContract({
                  account: account,
                  password: password
                });

              case 7:
                _context2.next = 9;
                return this.confirmTx(maxAttempts, interval);

              case 9:
                return _context2.abrupt("return", this);

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](3);
                throw _context2.t0;

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 12]]);
      }));

      function call(_x2) {
        return _call.apply(this, arguments);
      }

      return call;
    }()
    /**
     * @function sendContract
     * @memberof Contract
     * @description send contract with account and password
     * @param {Object} paramObject
     * @param {Account} paramObject.account - Account to sign
     * @param {String} paramObject.password - Account's password if it is encrypted
     * @return {Promise<Contract>} Contract instance
     */

  }, {
    key: "sendContract",
    value: function () {
      var _sendContract = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(_ref3) {
        var _ref3$account, account, password, _ref4, transaction, response;

        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _ref3$account = _ref3.account, account = _ref3$account === void 0 ? this.signer.signer : _ref3$account, password = _ref3.password;
                _context3.prev = 1;
                _context3.next = 4;
                return this.signTxn({
                  account: account,
                  password: password
                });

              case 4:
                _context3.next = 6;
                return this.transaction.sendTransaction();

              case 6:
                _ref4 = _context3.sent;
                transaction = _ref4.transaction;
                response = _ref4.response;
                this.ContractAddress = this.ContractAddress || response.ContractAddress;
                this.transaction = transaction.map(function (obj) {
                  return _objectSpread({}, obj, {
                    TranID: response.TranID
                  });
                });
                this.setStatus(ContractStatus.SENT);
                return _context3.abrupt("return", this);

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3["catch"](1);
                throw _context3.t0;

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 15]]);
      }));

      function sendContract(_x3) {
        return _sendContract.apply(this, arguments);
      }

      return sendContract;
    }()
    /**
     * @function signTxn
     * @memberof Contract
     * @description sign contract with account and password
     * @param {Object} paramObject
     * @param {Account} paramObject.account - Account to sign
     * @param {String} paramObject.password - Account's password if it is encrypted
     * @return {Promise<Contract>} Contract instance
     */

  }, {
    key: "signTxn",
    value: function () {
      var _signTxn = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(_ref5) {
        var _ref5$account, account, password;

        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _ref5$account = _ref5.account, account = _ref5$account === void 0 ? this.signer.signer : _ref5$account, password = _ref5.password;
                _context4.prev = 1;
                _context4.next = 4;
                return account.signTransaction(this.transaction, password);

              case 4:
                this.transaction = _context4.sent;
                this.setStatus(ContractStatus.SIGNED);
                return _context4.abrupt("return", this);

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](1);
                throw _context4.t0;

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 9]]);
      }));

      function signTxn(_x4) {
        return _signTxn.apply(this, arguments);
      }

      return signTxn;
    }()
    /**
     * @function confirmTx
     * @memberof Contract
     * @description confirm transaction with maxAttempts and intervel
     * @param {Number} maxAttempts - max tries
     * @param {Number} interval - try confirm intervally
     * @return {Promise<Contract>} Contract instance
     */

  }, {
    key: "confirmTx",
    value: function () {
      var _confirmTx = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee5() {
        var maxAttempts,
            interval,
            _args5 = arguments;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                maxAttempts = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : 20;
                interval = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 1000;
                _context5.prev = 2;
                _context5.next = 5;
                return this.transaction.confirm(this.transaction.TranID, maxAttempts, interval);

              case 5:
                if (!(!this.transaction.receipt || !this.transaction.receipt.success)) {
                  _context5.next = 8;
                  break;
                }

                this.setStatus(ContractStatus.REJECTED);
                return _context5.abrupt("return", this);

              case 8:
                this.setStatus(ContractStatus.DEPLOYED);
                return _context5.abrupt("return", this);

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](2);
                throw _context5.t0;

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 12]]);
      }));

      function confirmTx() {
        return _confirmTx.apply(this, arguments);
      }

      return confirmTx;
    }()
    /**
     * @function getState
     * @memberof Contract
     * @description get smart contract state
     * @return {Object} - RPC response
     */

  }, {
    key: "getState",
    value: function () {
      var _getState = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee6() {
        var response;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(this.status !== ContractStatus.DEPLOYED)) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt("return", Promise.resolve([]));

              case 2:
                _context6.next = 4;
                return this.messenger.send('GetSmartContractState', this.ContractAddress);

              case 4:
                response = _context6.sent;
                return _context6.abrupt("return", response);

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getState() {
        return _getState.apply(this, arguments);
      }

      return getState;
    }()
    /**
     * @function setDeployPayload
     * @memberof Contract
     * @description set deploy payload
     * @param {Object} deployObject
     * @param {Long} deployObject.gasLimit - gas limit
     * @param {BN} deployObject.gasPrice - gas price
     * @param {Boolean} deployObject.toDS - if send to shard
     * @return {Contract} Contract instance
     */

  }, {
    key: "setDeployPayload",
    value: function setDeployPayload(_ref6) {
      var gasPrice = _ref6.gasPrice,
          gasLimit = _ref6.gasLimit,
          toDS = _ref6.toDS;
      this.transaction = new laksaCoreTransaction.Transaction(_objectSpread({}, this.deployPayload, {
        gasPrice: gasPrice,
        gasLimit: gasLimit
      }), this.messenger, laksaCoreTransaction.TxStatus.Initialised, toDS);
      return this;
    }
    /**
     * @function setCallPayload
     * @memberof Contract
     * @description set call contract payload
     * @param {Object} callObject
     * @param {String} callObject.transition - transition name defined by smart contract
     * @param {Array<Object>} callObject.params -array of params send to transition
     * @param {?BN} callObject.amount - call amount
     * @param {Long} callObject.gasLimit - gas limit
     * @param {BN} callObject.gasPrice - gas price
     * @param {Boolean} callObject.toDS - if send to shard
     * @return {Contract} Contract instance
     */

  }, {
    key: "setCallPayload",
    value: function setCallPayload(_ref7) {
      var transition = _ref7.transition,
          params = _ref7.params,
          amount = _ref7.amount,
          gasLimit = _ref7.gasLimit,
          gasPrice = _ref7.gasPrice,
          toDS = _ref7.toDS;
      var msg = {
        _tag: transition,
        // TODO: this should be string, but is not yet supported by lookup.
        params: params
      };
      this.transaction = new laksaCoreTransaction.Transaction(_objectSpread({}, this.callPayload, {
        amount: amount,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        data: JSON.stringify(msg)
      }), this.messenger, laksaCoreTransaction.TxStatus.Initialised, toDS);
      return this;
    }
  }, {
    key: "deployPayload",
    get: function get() {
      return {
        version: this.version < 65535 ? this.messenger.setTransactionVersion(this.version, this.messenger.Network_ID) : this.version,
        amount: new laksaUtils.BN(0),
        toAddr: String(0).repeat(40),
        code: this.code,
        data: JSON.stringify(this.init).replace(/\\"/g, '"')
      };
    }
    /**
     * @function callPayload
     * @description return deploy payload
     * @memberof Contract
     * @return {Object} call payload
     */

  }, {
    key: "callPayload",
    get: function get() {
      return {
        version: this.version < 65535 ? this.messenger.setTransactionVersion(this.version, this.messenger.Network_ID) : this.version,
        toAddr: this.ContractAddress
      };
    }
  }]);

  return Contract;
}(), (_applyDecoratedDescriptor(_class.prototype, "deploy", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "deploy"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "call", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "call"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setDeployPayload", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "setDeployPayload"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setCallPayload", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "setCallPayload"), _class.prototype)), _class));

var _dec$1, _dec2$1, _class$1;
var TestScilla = (_dec$1 = laksaShared.assertObject({
  code: ['isString', 'required']
}), _dec2$1 = laksaShared.assertObject({
  code: ['isString', 'required']
}), (_class$1 =
/*#__PURE__*/
function (_Contract) {
  _inherits(TestScilla, _Contract);

  /**
   * @var {Array<Object>}blockchain
   * @memberof TestScilla.prototype
   * @description Create a Contract
   */
  function TestScilla() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TestScilla);

    for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TestScilla)).call.apply(_getPrototypeOf2, [this].concat(props)));

    _defineProperty(_assertThisInitialized(_this), "blockchain", []);

    return _this;
  }
  /**
   * @function testCall
   * @memberof TestScilla
   * @description a Test Contract instance
   * @param  {BN} gasLimit - gasLimit for test call to scilla-runner
   * @return {TestScilla} raw Contract object
   */


  _createClass(TestScilla, [{
    key: "testCall",
    value: function () {
      var _testCall = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(gasLimit) {
        var callContractJson, result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                callContractJson = {
                  code: this.code,
                  init: JSON.stringify(this.init),
                  blockchain: JSON.stringify(this.blockchain),
                  gaslimit: JSON.stringify(gasLimit) // the endpoint for sendServer has been set to scillaProvider

                };
                _context.next = 4;
                return this.messenger.sendServer('/contract/call', callContractJson);

              case 4:
                result = _context.sent;

                if (result.result) {
                  this.setStatus(ContractStatus.TESTED);
                } else {
                  this.setStatus(ContractStatus.ERROR);
                }

                return _context.abrupt("return", this);

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                throw _context.t0;

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function testCall(_x) {
        return _testCall.apply(this, arguments);
      }

      return testCall;
    }()
    /**
     * @function getABI
     * @memberof TestScilla
     * @description get ABI from scilla runner
     * @param  {Object} params
     * @param  {String} params.code - code string
     * @return {Object} RPC result
     */

  }, {
    key: "getABI",
    value: function () {
      var _getABI = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(_ref) {
        var code, result;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                code = _ref.code;
                _context2.prev = 1;
                _context2.next = 4;
                return this.messenger.sendServer('/contract/check', {
                  code: code
                });

              case 4:
                result = _context2.sent;

                if (!(result.result && result.message !== undefined)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", JSON.parse(result.message));

              case 7:
                _context2.next = 12;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](1);
                throw _context2.t0;

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 9]]);
      }));

      function getABI(_x2) {
        return _getABI.apply(this, arguments);
      }

      return getABI;
    }()
    /**
     * @function decodeABI
     * @description decode ABI from scilla runner
     * @param  {Object} paramObject
     * @param  {String} paramObject.code - scilla code string
     * @return {TestScilla} test contract
     */

  }, {
    key: "decodeABI",
    value: function () {
      var _decodeABI = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(_ref2) {
        var code, abiObj;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                code = _ref2.code;
                _context3.prev = 1;
                this.setCode(code);
                _context3.next = 5;
                return this.getABI({
                  code: code
                });

              case 5:
                abiObj = _context3.sent;
                this.setABI(abiObj);
                return _context3.abrupt("return", this);

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](1);
                throw _context3.t0;

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 10]]);
      }));

      function decodeABI(_x3) {
        return _decodeABI.apply(this, arguments);
      }

      return decodeABI;
    }()
    /**
     * @function setBlockNumber
     * @memberof TestScilla
     * @description set block number for TestScilla
     * @param  {Number} number - block number setted to blockchain
     * @return {TestScilla|false} test contract
     */

  }, {
    key: "setBlockNumber",
    value: function () {
      var _setBlockNumber = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(number) {
        var result;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;

                if (!(number && laksaUtils.isInt(Number(number)))) {
                  _context4.next = 7;
                  break;
                }

                this.setBlockchain(String(number));
                this.setCreationBlock(String(number));
                return _context4.abrupt("return", this);

              case 7:
                if (!(number === undefined)) {
                  _context4.next = 15;
                  break;
                }

                _context4.next = 10;
                return this.messenger.send('GetLatestTxBlock');

              case 10:
                result = _context4.sent;

                if (!result) {
                  _context4.next = 15;
                  break;
                }

                this.setBlockchain(result.header.BlockNum);
                this.setCreationBlock(result.header.BlockNum);
                return _context4.abrupt("return", this);

              case 15:
                _context4.next = 20;
                break;

              case 17:
                _context4.prev = 17;
                _context4.t0 = _context4["catch"](0);
                throw _context4.t0;

              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 17]]);
      }));

      function setBlockNumber(_x4) {
        return _setBlockNumber.apply(this, arguments);
      }

      return setBlockNumber;
    }()
    /**
     * @function testPayload
     * @memberof TestScilla.prototype
     * @description construct payload for TestScilla
     * @return {Object} payload object
     */

  }, {
    key: "setABI",

    /**
     * @function setABI
     * @memberof TestScilla
     * @description set abi for TestScilla
     * @return {TestScilla} TestScilla instance
     */
    value: function setABI(abi) {
      this.abi = new ABI(abi) || {};
      return this;
    }
    /**
     * @function setCode
     * @memberof TestScilla
     * @description set code for TestScilla
     * @return {TestScilla} test contract
     */

  }, {
    key: "setCode",
    value: function setCode(code) {
      this.code = code || '';
      return this;
    }
    /**
     * @function setInitParamsValues
     * @memberof TestScilla
     * @description set init param values for TestScilla
     * @param  {Array<Object>} initParams    - init params get from ABI
     * @param  {Array<Object>} arrayOfValues - init params set for ABI
     * @return {TestScilla} test contract
     */

  }, {
    key: "setInitParamsValues",
    value: function setInitParamsValues(initParams, arrayOfValues) {
      var result = setParamValues(initParams, arrayOfValues);
      this.init = result;
      return this;
    }
    /**
     * @function setCreationBlock
     * @memberof TestScilla
     * @description set creation Block for TestScilla
     * @param  {Number} blockNumber - block number for blockchain
     * @return {TestScilla} test contract
     */

  }, {
    key: "setCreationBlock",
    value: function setCreationBlock(blockNumber) {
      var result = setParamValues([{
        vname: '_creation_block',
        type: 'BNum'
      }], [{
        vname: '_creation_block',
        type: 'BNum',
        value: new laksaUtils.BN(blockNumber).toString()
      }]);

      var _this$init = _toArray(this.init),
          arr = _this$init.slice(0);

      arr.push(result[0]);
      this.init = arr;
      return this;
    }
    /**
     * @function setBlockchain
     * @memberof TestScilla
     * @description set blockchain object for TestScilla
     * @param  {Number} blockNumber - block number for blockchain
     * @return {TestScilla} test contract
     */

  }, {
    key: "setBlockchain",
    value: function setBlockchain(blockNumber) {
      var result = setParamValues([{
        vname: 'BLOCKNUMBER',
        type: 'BNum'
      }], [{
        vname: 'BLOCKNUMBER',
        type: 'BNum',
        value: new laksaUtils.BN(blockNumber).toString()
      }]);

      var _this$blockchain = _toArray(this.blockchain),
          arr = _this$blockchain.slice(0);

      arr.push(result[0]);
      this.blockchain = arr;
      return this;
    }
  }, {
    key: "testPayload",
    get: function get() {
      return _objectSpread({}, this.payload(), {
        code: this.code,
        data: JSON.stringify(this.init.concat(this.blockchain)).replace(/\\"/g, '"')
      });
    }
  }]);

  return TestScilla;
}(Contract), (_applyDecoratedDescriptor(_class$1.prototype, "getABI", [_dec$1], Object.getOwnPropertyDescriptor(_class$1.prototype, "getABI"), _class$1.prototype), _applyDecoratedDescriptor(_class$1.prototype, "decodeABI", [_dec2$1], Object.getOwnPropertyDescriptor(_class$1.prototype, "decodeABI"), _class$1.prototype)), _class$1));

var _dec$2, _class$2;
/**
 * @class Contracts
 * @param  {Messenger}  messenger - Messenger instance
 * @param  {Wallet} signer - Wallet instance
 * @return {Contracts} Contract factory
 */

var Contracts = (_dec$2 = laksaShared.assertObject({
  ContractAddress: ['isAddress', 'optional'],
  code: ['isString', 'optional'],
  init: ['isArray', 'optional'],
  status: ['isString', 'optional']
}), (_class$2 =
/*#__PURE__*/
function (_Core) {
  _inherits(Contracts, _Core);

  function Contracts(messenger, signer) {
    var _this;

    _classCallCheck(this, Contracts);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Contracts).call(this));
    /**
     * @var {Messeger} messenger
     * @memberof Contracts.prototype
     * @description Messenger instance
     */

    _this.messenger = messenger;
    /**
     * @var {Wallet} signer
     * @memberof Contracts.prototype
     * @description Wallet instance
     */

    _this.signer = signer;
    return _this;
  }
  /**
   * @function getAddressForContract
   * @memberof Contracts
   * @description get Contract address from Transaction
   * @param  {Transaction} tx - Transaction instance
   * @return {String} Contract address
   */


  _createClass(Contracts, [{
    key: "getAddressForContract",
    value: function getAddressForContract(tx) {
      // always subtract 1 from the tx nonce, as contract addresses are computed
      // based on the nonce in the global state.
      var nonce = tx.txParams.nonce ? tx.txParams.nonce - 1 : 0;
      return laksaCoreCrypto.hashjs.sha256().update(tx.senderAddress, 'hex').update(laksaCoreCrypto.intToHexArray(nonce, 64).join(''), 'hex').digest('hex').slice(24);
    }
    /**
     * @function new
     * @memberof Contracts
     * @description Create a Contract
     * @param  {String} code - Code string
     * @param  {Array<Object>} init - init params
     * @return {Contract} Contract instance
     */

  }, {
    key: "new",
    value: function _new(code, init) {
      var newContract = new Contract({
        code: code,
        init: init
      }, {
        messenger: this.messenger,
        signer: this.signer
      }, ContractStatus.INITIALISED);
      return newContract;
    }
    /**
     * @function at
     * @memberof Contracts
     * @description get a Contract from factory and give it Messenger and Wallet as members
     * @param  {Contract} contract - Contract instance
     * @return {Contract} Contract instance
     */

  }, {
    key: "at",
    value: function at(contract) {
      return new Contract(_objectSpread({}, contract), {
        messenger: this.messenger,
        signer: this.signer
      }, contract.status);
    }
    /**
     * @function testContract
     * @memberof Contracts
     * @description test Contract code and init params, usable before deploying
     * @param  {String} code - Code string
     * @param  {Array<Object>} init - init params
     * @return {Boolean} test result boolean
     */

  }, {
    key: "testContract",
    value: function () {
      var _testContract = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(code, init) {
        var contract, result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                contract = new TestScilla({
                  code: code,
                  init: init
                }, {
                  messenger: this.messenger,
                  signer: this.signer
                }, ContractStatus.INITIALISED);
                _context.next = 3;
                return contract // decode ABI from code first
                .decodeABI({
                  code: code
                }) // we set the init params to decoded ABI
                .then(function (decoded) {
                  return decoded.setInitParamsValues(decoded.abi.getInitParams(), init);
                }) // we get the current block number from node, and set it to params
                .then(function (inited) {
                  return inited.setBlockNumber();
                }) // but we have to give it a test
                .then(function (ready) {
                  return ready.testCall(2000);
                }) // now we change the status to wait for sign
                .then(function (state) {
                  return state.status === ContractStatus.TESTED ? {
                    abi: state.abi,
                    init: state.init,
                    status: state.status
                  } : false;
                });

              case 3:
                result = _context.sent;
                return _context.abrupt("return", result);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function testContract(_x, _x2) {
        return _testContract.apply(this, arguments);
      }

      return testContract;
    }()
  }]);

  return Contracts;
}(laksaShared.Core), (_applyDecoratedDescriptor(_class$2.prototype, "at", [_dec$2], Object.getOwnPropertyDescriptor(_class$2.prototype, "at"), _class$2.prototype)), _class$2));

exports.isInt = laksaUtils.isInt;
exports.isHash = laksaUtils.isHash;
exports.Matchers = Matchers;
exports.validators = validators;
exports.validate = validate;
exports.transform = transform;
exports.ABI = ABI;
exports.Contracts = Contracts;
exports.Contract = Contract;
exports.TestScilla = TestScilla;
exports.ContractStatus = ContractStatus;
exports.setParamValues = setParamValues;
