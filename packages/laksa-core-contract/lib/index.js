'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.match');
var laksaUtils = require('laksa-utils');
require('core-js/modules/es6.function.name');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
require('core-js/modules/es6.regexp.to-string');
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
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

var ABI = function ABI(abi) {
  var _this = this;

  _classCallCheck(this, ABI);

  _defineProperty(this, "getName", function () {
    return _this.name;
  });

  _defineProperty(this, "getInitParams", function () {
    return _this.params;
  });

  _defineProperty(this, "getInitParamTypes", function () {
    if (_this.params.length > 0) {
      return getParamTypes(_this.params);
    }
  });

  _defineProperty(this, "getFields", function () {
    return _this.fields;
  });

  _defineProperty(this, "getFieldsTypes", function () {
    if (_this.fields.length > 0) {
      return getParamTypes(_this.fields);
    }
  });

  _defineProperty(this, "getTransitions", function () {
    return _this.transitions;
  });

  _defineProperty(this, "getTransitionsParamTypes", function () {
    var returnArray = [];

    if (_this.transitions.length > 0) {
      for (var i = 0; i < _this.transitions.length; i += 1) {
        returnArray[i] = getParamTypes(_this.transitions[i].params);
      }
    }

    return returnArray;
  });

  _defineProperty(this, "getEvents", function () {
    return _this.events;
  });

  this.events = abi !== undefined ? abi.events : []; // Array<object>

  this.fields = abi !== undefined ? abi.fields : []; // Array<object>

  this.name = abi !== undefined ? abi.name : ''; // string

  this.params = abi !== undefined ? abi.params : []; // Array<object>

  this.transitions = abi !== undefined ? abi.transitions : []; // Array<object>
};

var setParamValues = function setParamValues(rawParams, newValues) {
  var newParams = [];
  rawParams.forEach(function (v, i) {
    if (!validate(v.type, newValues[i])) {
      throw new TypeError("Type validator failed,with <".concat(v.vname, ":").concat(v.type, ">"));
    }

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
  function Contract(_messenger) {
    var _this = this;

    _classCallCheck(this, Contract);

    _defineProperty(this, "contractStatus", '');

    _defineProperty(this, "contractJson", {});

    _defineProperty(this, "abi", {});

    _defineProperty(this, "code", '');

    _defineProperty(this, "initParams", []);

    _defineProperty(this, "blockchain", []);

    _defineProperty(this, "on", function () {});

    _defineProperty(this, "testCall",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(_ref) {
        var gasLimit, callContractJson, result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                gasLimit = _ref.gasLimit;
                callContractJson = {
                  code: _this.code,
                  init: JSON.stringify(_this.initParams),
                  blockchain: JSON.stringify(_this.blockchain),
                  gaslimit: JSON.stringify(gasLimit)
                };
                _context.next = 4;
                return _this.messenger.sendServer('/contract/call', callContractJson);

              case 4:
                result = _context.sent;

                if (result.result) {
                  _this.setContractStatus('waitForSign');
                }

                return _context.abrupt("return", _this);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(this, "generateNewContractJson", function () {
      _this.contractJson = _objectSpread({}, defaultContractJson, {
        code: JSON.stringify(_this.code),
        data: JSON.stringify(_this.initParams.concat(_this.blockchain))
      });

      _this.setContractStatus('initialized');

      return _this;
    });

    _defineProperty(this, "deploy",
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
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
                return _this.messenger.send({
                  method: 'CreateTransaction',
                  params: [deployedTxn]
                });

              case 5:
                result = _context2.sent;

                if (result) {
                  _this.setContractStatus('deployed');
                }

                return _context2.abrupt("return", _objectSpread({}, _this, {
                  txnId: result
                }));

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getABI",
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(_ref4) {
        var code, result;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                code = _ref4.code;
                _context3.next = 3;
                return _this.messenger.sendServer('/contract/check', {
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

      return function (_x3) {
        return _ref5.apply(this, arguments);
      };
    }());

    _defineProperty(this, "decodeABI",
    /*#__PURE__*/
    function () {
      var _ref7 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(_ref6) {
        var code, abiObj;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                code = _ref6.code;

                _this.setCode(code);

                _context4.next = 4;
                return _this.getABI({
                  code: code
                });

              case 4:
                abiObj = _context4.sent;

                _this.setABI(abiObj);

                return _context4.abrupt("return", _this);

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x4) {
        return _ref7.apply(this, arguments);
      };
    }());

    _defineProperty(this, "setBlockNumber",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee5() {
      var result;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _this.messenger.send({
                method: 'GetLatestTxBlock',
                param: []
              });

            case 2:
              result = _context5.sent;

              if (!result) {
                _context5.next = 7;
                break;
              }

              _this.setBlockchain(result.header.BlockNum);

              _this.setCreationBlock(result.header.BlockNum);

              return _context5.abrupt("return", _this);

            case 7:
              return _context5.abrupt("return", false);

            case 8:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));

    _defineProperty(this, "setMessenger", function (messenger) {
      _this.messenger = messenger || undefined;
    });

    _defineProperty(this, "setContractStatus", function (status) {
      _this.contractStatus = status;
    });

    this.messenger = _messenger;
  }

  _createClass(Contract, [{
    key: "setABI",
    //-------------------------------
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

  }]);

  return Contract;
}();

exports.toBN = laksaUtils.toBN;
exports.Contract = Contract;
exports.ABI = ABI;
