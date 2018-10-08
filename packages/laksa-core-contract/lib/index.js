'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.function.name');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
require('core-js/modules/es6.regexp.to-string');
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
require('core-js/modules/es6.object.assign');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.regexp.match');
var laksaUtils = require('laksa-utils');
var laksaCoreCrypto = require('laksa-core-crypto');

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

var Contract =
/*#__PURE__*/
function () {
  function Contract(abi, code, nodeProvider, scillaProvider) {
    var _this = this;

    _classCallCheck(this, Contract);

    _defineProperty(this, "rawTxObject", {
      version: 0,
      nonce: 1,
      to: '0000000000000000000000000000000000000000',
      amount: laksaUtils.toBN(0),
      gasPrice: 1,
      gasLimit: 50,
      code: '',
      data: ''
    });

    _defineProperty(this, "initParams", []);

    _defineProperty(this, "blockchain", []);

    _defineProperty(this, "on", function () {});

    _defineProperty(this, "deploy", function (_ref) {
      var blockNumber = _ref.blockNumber,
          privateKey = _ref.privateKey,
          amount = _ref.amount,
          gasPrice = _ref.gasPrice,
          gasLimit = _ref.gasLimit,
          nonce = _ref.nonce;

      _this.setBlockchain(blockNumber);

      _this.setCreationBlock(blockNumber);

      var newDeployment = _objectSpread({}, _this.rawTxObject, {
        nonce: nonce,
        amount: amount !== undefined ? laksaUtils.toBN(amount) : laksaUtils.toBN(0),
        gasPrice: gasPrice !== undefined ? laksaUtils.toBN(gasPrice).toNumber() : 1,
        gasLimit: gasLimit !== undefined ? laksaUtils.toBN(gasLimit).toNumber() : 50,
        code: JSON.stringify(_this.code),
        data: JSON.stringify(_this.initParams.concat(_this.blockchain)) // console.log(newDeployment)

      });

      var txn = laksaCoreCrypto.createTransactionJson(privateKey, newDeployment);
      return txn;
    });

    _defineProperty(this, "call", function () {});

    this.abi = abi || {};
    this.code = code || '';
    this.nodeProvider = nodeProvider || undefined;
    this.scillaProvider = scillaProvider || undefined;
  }

  _createClass(Contract, [{
    key: "setNodeProvider",
    // provider Setter
    value: function setNodeProvider(provider) {
      this.nodeProvider = provider;
    } // scilla provider Setter

  }, {
    key: "setScillaProvider",
    value: function setScillaProvider(provider) {
      this.scillaProvider = provider;
    }
  }, {
    key: "setABI",
    value: function setABI(abi) {
      this.abi = abi !== undefined ? new ABI(abi) : {};
    }
  }, {
    key: "setCode",
    value: function setCode(code) {
      this.code = JSON.stringify(code) || '';
    }
  }, {
    key: "setInitParamsValues",
    value: function setInitParamsValues(initParams, arrayOfValues) {
      var result = setParamValues(initParams, arrayOfValues);
      this.initParams = result;
      return result;
    }
  }, {
    key: "setCreationBlock",
    value: function setCreationBlock(blockNumber) {
      var result = setParamValues([{
        vname: '_creation_block',
        type: 'BNum'
      }], [laksaUtils.toBN(blockNumber).toString()]);
      this.initParams.push(result[0]);
      return result[0];
    }
  }, {
    key: "setBlockchain",
    value: function setBlockchain(blockNumber) {
      var result = setParamValues([{
        vname: 'BLOCKNUMBER',
        type: 'BNum'
      }], [laksaUtils.toBN(blockNumber).toString()]);
      this.blockchain.push(result[0]);
      return result[0];
    }
  }]);

  return Contract;
}();

exports.Contract = Contract;
exports.ABI = ABI;
