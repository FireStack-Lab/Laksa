'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.match');
var laksaUtils = require('laksa-utils');
require('core-js/modules/es6.function.name');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/es6.number.constructor');
require('core-js/modules/es6.regexp.replace');
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _applyDecoratedDescriptor = _interopDefault(require('@babel/runtime/helpers/applyDecoratedDescriptor'));
require('core-js/modules/es6.object.assign');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
var laksaCoreTransaction = require('laksa-core-transaction');
var laksaShared = require('laksa-shared');

var Matchers = {
  ByStrX: /^ByStr[0-9]+$/,
  String: /^String$/,
  Uint: /^Uint(32|64|128|256)$/,
  Int: /^Int(32|64|128|256)$/,
  BNum: /^BNum$/
};
var validators = [{
  type: 'ByStrX',
  match: function match(type) {
    return Matchers.ByStrX.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isByStrX.test(value);
  }
}, {
  type: 'UInt',
  match: function match(type) {
    return Matchers.Uint.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isUint.test(value);
  }
}, {
  type: 'Int',
  match: function match(type) {
    return Matchers.Int.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isInt.test(value);
  }
}, {
  type: 'BNum',
  match: function match(type) {
    return Matchers.BNum.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isBN.test(laksaUtils.toBN(value));
  }
}, {
  type: 'String',
  match: function match(type) {
    return Matchers.String.test(type);
  },
  validatorFn: function validatorFn(value) {
    return laksaUtils.isString.test(value);
  }
}];

var validate = function validate(type, value) {
  return validators.some(function (val) {
    return val.match(type) && val.validatorFn(value);
  });
};

function getParamTypes(list) {
  var result = [];
  list.map(function (obj, index) {
    result[index] = obj.type;
    return false;
  });
  return result;
}

var ABI =
/*#__PURE__*/
function () {
  function ABI(abi) {
    _classCallCheck(this, ABI);

    this.events = abi !== undefined ? abi.events : []; // Array<object>

    this.fields = abi !== undefined ? abi.fields : []; // Array<object>

    this.name = abi !== undefined ? abi.name : ''; // string

    this.params = abi !== undefined ? abi.params : []; // Array<object>

    this.transitions = abi !== undefined ? abi.transitions : []; // Array<object>
  }

  _createClass(ABI, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }, {
    key: "getInitParams",
    value: function getInitParams() {
      return this.params;
    }
  }, {
    key: "getInitParamTypes",
    value: function getInitParamTypes() {
      if (this.params.length > 0) {
        return getParamTypes(this.params);
      }
    }
  }, {
    key: "getFields",
    value: function getFields() {
      return this.fields;
    }
  }, {
    key: "getFieldsTypes",
    value: function getFieldsTypes() {
      if (this.fields.length > 0) {
        return getParamTypes(this.fields);
      }
    }
  }, {
    key: "getTransitions",
    value: function getTransitions() {
      return this.transitions;
    }
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
  }, {
    key: "getEvents",
    value: function getEvents() {
      return this.events;
    }
  }]);

  return ABI;
}();

var _class;
var ContractStatus = {
  initialised: Symbol('initialised'),
  waitForSign: Symbol('waitForSign'),
  rejected: Symbol('rejected'),
  deployed: Symbol('deployed')
  /**
   * @function setParamValues
   * @param  {Array<object>} rawParams {init params get from ABI}
   * @param  {Array<object>} newValues {init params set for ABI}
   * @return {Array<object>} {new array of params objects}
   */

};

var setParamValues = function setParamValues(rawParams, newValues) {
  var newParams = [];
  rawParams.forEach(function (v, i) {
    if (!validate(v.type, newValues[i])) {
      throw new TypeError("Type validator failed,with <".concat(v.vname, ":").concat(v.type, ">"));
    } // FIXME:it may change cause local scilla runner return the `name` not `vname`
    // But when call or make transaction, remote node only accpet `vname`


    var newObj = Object.assign({}, v, {
      value: newValues[i],
      vname: v.name ? v.name : v.vname
    });

    if (newObj.name) {
      delete newObj.name;
    }

    newParams.push(newObj);
  });
  return newParams;
};

var defaultContractJson = {
  to: '0000000000000000000000000000000000000000',
  code: '',
  data: ''
};
var Contract = (_class =
/*#__PURE__*/
function () {
  function Contract(factory, abi, address, code, initParams, state) {
    _classCallCheck(this, Contract);

    _defineProperty(this, "contractJson", {});

    _defineProperty(this, "blockchain", []);

    _defineProperty(this, "on", function () {});

    this.messenger = factory.messenger;
    this.signer = factory.signer;
    this.address = address || undefined;

    if (address) {
      this.abi = abi;
      this.address = address;
      this.initParams = initParams;
      this.state = state;
      this.contractStatus = ContractStatus.deployed;
    } else {
      // assume we're deploying
      this.abi = abi;
      this.code = code;
      this.initParams = initParams;
      this.contractStatus = ContractStatus.initialised;
    }
  }
  /**
   * @function {on}
   * @return {Event} {description}
   */


  _createClass(Contract, [{
    key: "testCall",

    /**
     * @function {testCall}
     * @param  {Int} gasLimit {gasLimit for test call to scilla-runner}
     * @return {Contract} {raw Contract object}
     */
    value: function () {
      var _testCall = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(gasLimit) {
        var callContractJson, result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                callContractJson = {
                  code: this.code,
                  init: JSON.stringify(this.initParams),
                  blockchain: JSON.stringify(this.blockchain),
                  gaslimit: JSON.stringify(gasLimit) // the endpoint for sendServer has been set to scillaProvider

                };
                _context.next = 3;
                return this.messenger.sendServer('/contract/call', callContractJson);

              case 3:
                result = _context.sent;

                if (result.result) {
                  this.setContractStatus(ContractStatus.waitForSign);
                }

                return _context.abrupt("return", this);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function testCall(_x) {
        return _testCall.apply(this, arguments);
      };
    }()
  }, {
    key: "prepareTx",
    value: function () {
      var _prepareTx = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(tx) {
        var raw, response;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                raw = tx.txParams;
                /**
                 * @function response
                 * @returns {Object}
                 * @param {Address} ContractAddress {contract address that deployed}
                 * @param {string} Info  {Infomation that server returns}
                 * @param {TranID} TranID  {transaction ID that server returns},
                 */

                _context2.next = 3;
                return this.messenger.send({
                  method: 'CreateTransaction',
                  params: [_objectSpread({}, raw, {
                    amount: raw.amount.toNumber()
                  })]
                });

              case 3:
                response = _context2.sent;
                return _context2.abrupt("return", tx.confirm(response.TranID));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function prepareTx(_x2) {
        return _prepareTx.apply(this, arguments);
      };
    }()
    /**
     * @function {deployTxn}
     * @param  {Int} gasPrice {gasPrice}
     * @param  {Int} gasLimit {gasLimit}
     * @return {Contract} {description}
     */

  }, {
    key: "deployTxn",
    value: function () {
      var _deployTxn = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(_ref) {
        var gasPrice, gasLimit, tx;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                gasPrice = _ref.gasPrice, gasLimit = _ref.gasLimit;

                if (!(!this.code || !this.initParams)) {
                  _context3.next = 3;
                  break;
                }

                throw new Error('Cannot deploy without code or ABI.');

              case 3:
                _context3.prev = 3;
                laksaCoreTransaction.Transaction.setMessenger(this.messenger);
                _context3.next = 7;
                return this.prepareTx(new laksaCoreTransaction.Transaction({
                  version: 0,
                  to: defaultContractJson.to,
                  // pubKey: this.signer.publicKey,
                  // amount should be 0.  we don't accept implicitly anymore.
                  amount: laksaUtils.toBN(0),
                  gasPrice: laksaUtils.toBN(gasPrice).toNumber(),
                  gasLimit: laksaUtils.toBN(gasLimit).toNumber(),
                  code: this.code,
                  data: JSON.stringify(this.initParams).replace(/\\"/g, '"')
                }));

              case 7:
                tx = _context3.sent;

                if (!(!tx.receipt || !tx.receipt.success)) {
                  _context3.next = 11;
                  break;
                }

                this.setContractStatus(ContractStatus.rejected);
                return _context3.abrupt("return", this);

              case 11:
                this.setContractStatus(ContractStatus.deployed);
                return _context3.abrupt("return", this);

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3["catch"](3);
                throw _context3.t0;

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 15]]);
      }));

      return function deployTxn(_x3) {
        return _deployTxn.apply(this, arguments);
      };
    }()
    /**
     * @function {deploy}
     * @param  {Transaction} signedTxn {description}
     * @return {Contract} {Contract that deployed successfully}
     */

  }, {
    key: "deploy",
    value: function () {
      var _deploy = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(signedTxn) {
        var deployedTxn, result;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (signedTxn.signature) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('transaction has not been signed');

              case 2:
                deployedTxn = Object.assign({}, _objectSpread({}, signedTxn, {
                  amount: signedTxn.amount.toNumber()
                }));
                _context4.next = 5;
                return this.messenger.send({
                  method: 'CreateTransaction',
                  params: [deployedTxn]
                });

              case 5:
                result = _context4.sent;

                if (!result.TranID) {
                  _context4.next = 12;
                  break;
                }

                this.address = result.ContractAddress;
                this.setContractStatus(ContractStatus.deployed);
                return _context4.abrupt("return", _objectSpread({}, this, {
                  TranID: result.TranID
                }));

              case 12:
                this.setContractStatus(ContractStatus.rejected);
                return _context4.abrupt("return", this);

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function deploy(_x4) {
        return _deploy.apply(this, arguments);
      };
    }()
    /**
     * call
     *
     * @param {string} transition
     * @param {any} params
     * @returns {Promise<Transaction>}
     */

  }, {
    key: "call",
    value: function () {
      var _call = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee5(transition, params) {
        var amount,
            msg,
            _args5 = arguments;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                amount = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : laksaUtils.toBN(0);
                msg = {
                  _tag: transition,
                  // TODO: this should be string, but is not yet supported by lookup.
                  params: params
                };
                _context5.prev = 2;
                _context5.next = 5;
                return this.prepareTx(new laksaCoreTransaction.Transaction({
                  version: 0,
                  to: defaultContractJson.to,
                  amount: laksaUtils.toBN(amount),
                  gasPrice: 1000,
                  gasLimit: 1000,
                  data: JSON.stringify(msg)
                }));

              case 5:
                return _context5.abrupt("return", _context5.sent);

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](2);
                throw _context5.t0;

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 8]]);
      }));

      return function call(_x5, _x6) {
        return _call.apply(this, arguments);
      };
    }() //-------------------------------

    /**
     * @function {getABI}
     * @param  {string} { code {scilla code string}
     * @return {ABI} {ABI object}
     */

  }, {
    key: "getABI",
    value: function () {
      var _getABI = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee6(_ref2) {
        var code, result;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                code = _ref2.code;
                _context6.next = 3;
                return this.messenger.sendServer('/contract/check', {
                  code: code
                });

              case 3:
                result = _context6.sent;

                if (!(result.result && result.message !== undefined)) {
                  _context6.next = 6;
                  break;
                }

                return _context6.abrupt("return", JSON.parse(result.message));

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function getABI(_x7) {
        return _getABI.apply(this, arguments);
      };
    }()
    /**
     * @function {decodeABI}
     * @param  {string} { code {scilla code string}
     * @return {Contract} {raw contract}
     */

  }, {
    key: "decodeABI",
    value: function () {
      var _decodeABI = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee7(_ref3) {
        var code, abiObj;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                code = _ref3.code;
                this.setCode(code);
                _context7.next = 4;
                return this.getABI({
                  code: code
                });

              case 4:
                abiObj = _context7.sent;
                this.setABI(abiObj);
                return _context7.abrupt("return", this);

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function decodeABI(_x8) {
        return _decodeABI.apply(this, arguments);
      };
    }()
    /**
     * @function {setBlockNumber}
     * @param  {Int} number {block number setted to blockchain}
     * @return {Contract|false} {raw contract}
     */

  }, {
    key: "setBlockNumber",
    value: function () {
      var _setBlockNumber = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee8(number) {
        var result;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!(number && laksaUtils.isInt(Number(number)))) {
                  _context8.next = 6;
                  break;
                }

                this.setBlockchain(String(number));
                this.setCreationBlock(String(number));
                return _context8.abrupt("return", this);

              case 6:
                if (!(number === undefined)) {
                  _context8.next = 14;
                  break;
                }

                _context8.next = 9;
                return this.messenger.send({
                  method: 'GetLatestTxBlock',
                  param: []
                });

              case 9:
                result = _context8.sent;

                if (!result) {
                  _context8.next = 14;
                  break;
                }

                this.setBlockchain(result.header.BlockNum);
                this.setCreationBlock(result.header.BlockNum);
                return _context8.abrupt("return", this);

              case 14:
                return _context8.abrupt("return", false);

              case 15:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function setBlockNumber(_x9) {
        return _setBlockNumber.apply(this, arguments);
      };
    }() //-------------------------------

    /**
     * @function {generateNewContractJson}
     * @return {Contract} {raw contract with code and init params}
     */

  }, {
    key: "generateNewContractJson",
    value: function generateNewContractJson() {
      this.contractJson = _objectSpread({}, defaultContractJson, {
        code: JSON.stringify(this.code),
        data: JSON.stringify(this.initParams.concat(this.blockchain))
      });
      this.setContractStatus(ContractStatus.initialised);
      return this;
    }
    /**
     * @function {setABIe}
     * @param  {ABI} abi {ABI object}
     * @return {Contract} {raw contract}
     */

  }, {
    key: "setABI",
    value: function setABI(abi) {
      this.abi = new ABI(abi) || {};
      return this;
    }
    /**
     * @function {setCode}
     * @param  {string} code {scilla code string}
     * @return {Contract} {raw contract with code}
     */

  }, {
    key: "setCode",
    value: function setCode(code) {
      this.code = code || '';
      return this;
    }
    /**
     * @function {setInitParamsValues}
     * @param  {Array<Object>} initParams    {init params get from ABI}
     * @param  {Array<Object>} arrayOfValues {init params set for ABI}
     * @return {Contract} {raw contract object}
     */

  }, {
    key: "setInitParamsValues",
    value: function setInitParamsValues(initParams, arrayOfValues) {
      var result = setParamValues(initParams, arrayOfValues);
      this.initParams = result;
      return this;
    }
    /**
     * @function {setCreationBlock}
     * @param  {Int} blockNumber {block number for blockchain}
     * @return {Contract} {raw contract object}
     */

  }, {
    key: "setCreationBlock",
    value: function setCreationBlock(blockNumber) {
      var result = setParamValues([{
        vname: '_creation_block',
        type: 'BNum'
      }], [laksaUtils.toBN(blockNumber).toString()]);
      this.initParams.push(result[0]);
      return this;
    }
    /**
     * @function {setBlockchain}
     * @param  {Int} blockNumber {block number for blockchain}
     * @return {Contract} {raw contract object}
     */

  }, {
    key: "setBlockchain",
    value: function setBlockchain(blockNumber) {
      var result = setParamValues([{
        vname: 'BLOCKNUMBER',
        type: 'BNum'
      }], [laksaUtils.toBN(blockNumber).toString()]);
      this.blockchain.push(result[0]);
      return this;
    }
    /**
     * @function {setMessenger}
     * @param  {Messenger} messenger {messenger instance}
     * @return {Messenger} {setter}
     */

  }, {
    key: "setMessenger",
    value: function setMessenger(messenger) {
      this.messenger = messenger || undefined;
    }
    /**
     * @function {setContractStatus}
     * @param  {Symbol} status {status symbol}
     * @return {Symbol} {setter}
     */

  }, {
    key: "setContractStatus",
    value: function setContractStatus(status) {
      this.contractStatus = status;
    }
  }]);

  return Contract;
}(), (_applyDecoratedDescriptor(_class.prototype, "prepareTx", [laksaShared.sign], Object.getOwnPropertyDescriptor(_class.prototype, "prepareTx"), _class.prototype)), _class);

exports.toBN = laksaUtils.toBN;
exports.Contract = Contract;
exports.ContractStatus = ContractStatus;
exports.ABI = ABI;
