'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.match');
var laksaUtils = require('laksa-utils');
require('core-js/modules/es6.function.name');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
require('core-js/modules/es6.regexp.to-string');
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
require('core-js/modules/es6.object.assign');
require('core-js/modules/web.dom.iterable');

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

var Contract =
/*#__PURE__*/
function () {
  function Contract(messenger) {
    _classCallCheck(this, Contract);

    _defineProperty(this, "contractStatus", '');

    _defineProperty(this, "contractJson", {});

    _defineProperty(this, "abi", {});

    _defineProperty(this, "code", '');

    _defineProperty(this, "initParams", []);

    _defineProperty(this, "blockchain", []);

    _defineProperty(this, "on", function () {});

    this.messenger = messenger;
  }

  _createClass(Contract, [{
    key: "testCall",
    // test call to scilla runner
    value: function () {
      var _testCall = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(_ref) {
        var gasLimit, callContractJson, result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                gasLimit = _ref.gasLimit;
                callContractJson = {
                  code: this.code,
                  init: JSON.stringify(this.initParams),
                  blockchain: JSON.stringify(this.blockchain),
                  gaslimit: JSON.stringify(gasLimit) // the endpoint for sendServer has been set to scillaProvider

                };
                _context.next = 4;
                return this.messenger.sendServer('/contract/call', callContractJson);

              case 4:
                result = _context.sent;

                if (result.result) {
                  this.setContractStatus('waitForSign');
                }

                return _context.abrupt("return", this);

              case 7:
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
    key: "deploy",
    value: function () {
      var _deploy = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(signedTxn) {
        var deployedTxn, result;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (signedTxn.signature) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('transaction has not been signed');

              case 2:
                deployedTxn = Object.assign({}, _objectSpread({}, signedTxn, {
                  amount: signedTxn.amount.toNumber()
                }));
                _context2.next = 5;
                return this.messenger.send({
                  method: 'CreateTransaction',
                  params: [deployedTxn]
                });

              case 5:
                result = _context2.sent;

                if (result) {
                  this.setContractStatus('deployed');
                }

                return _context2.abrupt("return", _objectSpread({}, this, {
                  txnId: result
                }));

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function deploy(_x2) {
        return _deploy.apply(this, arguments);
      };
    }() //-------------------------------

  }, {
    key: "getABI",
    value: function () {
      var _getABI = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(_ref2) {
        var code, result;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                code = _ref2.code;
                _context3.next = 3;
                return this.messenger.sendServer('/contract/check', {
                  code: code
                });

              case 3:
                result = _context3.sent;

                if (!(result.result && result.message !== undefined)) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", JSON.parse(result.message));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function getABI(_x3) {
        return _getABI.apply(this, arguments);
      };
    }()
  }, {
    key: "decodeABI",
    value: function () {
      var _decodeABI = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(_ref3) {
        var code, abiObj;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                code = _ref3.code;
                this.setCode(code);
                _context4.next = 4;
                return this.getABI({
                  code: code
                });

              case 4:
                abiObj = _context4.sent;
                this.setABI(abiObj);
                return _context4.abrupt("return", this);

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function decodeABI(_x4) {
        return _decodeABI.apply(this, arguments);
      };
    }()
  }, {
    key: "setBlockNumber",
    value: function () {
      var _setBlockNumber = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee5() {
        var result;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.messenger.send({
                  method: 'GetLatestTxBlock',
                  param: []
                });

              case 2:
                result = _context5.sent;

                if (!result) {
                  _context5.next = 7;
                  break;
                }

                this.setBlockchain(result.header.BlockNum);
                this.setCreationBlock(result.header.BlockNum);
                return _context5.abrupt("return", this);

              case 7:
                return _context5.abrupt("return", false);

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function setBlockNumber() {
        return _setBlockNumber.apply(this, arguments);
      };
    }() //-------------------------------
    // new contract json for deploy

  }, {
    key: "generateNewContractJson",
    value: function generateNewContractJson() {
      this.contractJson = _objectSpread({}, defaultContractJson, {
        code: JSON.stringify(this.code),
        data: JSON.stringify(this.initParams.concat(this.blockchain))
      });
      this.setContractStatus('initialized');
      return this;
    }
  }, {
    key: "setABI",
    value: function setABI(abi) {
      this.abi = new ABI(abi) || {};
      return this;
    }
  }, {
    key: "setCode",
    value: function setCode(code) {
      this.code = code || '';
      return this;
    }
  }, {
    key: "setInitParamsValues",
    value: function setInitParamsValues(initParams, arrayOfValues) {
      var result = setParamValues(initParams, arrayOfValues);
      this.initParams = result;
      return this;
    }
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
  }, {
    key: "setBlockchain",
    value: function setBlockchain(blockNumber) {
      var result = setParamValues([{
        vname: 'BLOCKNUMBER',
        type: 'BNum'
      }], [laksaUtils.toBN(blockNumber).toString()]);
      this.blockchain.push(result[0]);
      return this;
    } // messenger Setter

  }, {
    key: "setMessenger",
    value: function setMessenger(messenger) {
      this.messenger = messenger || undefined;
    }
  }, {
    key: "setContractStatus",
    value: function setContractStatus(status) {
      this.contractStatus = status;
    }
  }]);

  return Contract;
}();

exports.toBN = laksaUtils.toBN;
exports.Contract = Contract;
exports.ABI = ABI;
