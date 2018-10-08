(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('laksa-core-crypto')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'laksa-core-crypto'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.laksaCoreCrypto));
}(this, (function (exports,laksaUtils,laksaCoreCrypto) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function getParamTypes(list) {
    const result = [];
    list.map((obj, index) => {
      result[index] = obj.type;
      return false;
    });
    return result;
  }

  class ABI {
    constructor(abi) {
      _defineProperty(this, "getName", () => {
        return this.name;
      });

      _defineProperty(this, "getInitParams", () => {
        return this.params;
      });

      _defineProperty(this, "getInitParamTypes", () => {
        if (this.params.length > 0) {
          return getParamTypes(this.params);
        }
      });

      _defineProperty(this, "getFields", () => {
        return this.fields;
      });

      _defineProperty(this, "getFieldsTypes", () => {
        if (this.fields.length > 0) {
          return getParamTypes(this.fields);
        }
      });

      _defineProperty(this, "getTransitions", () => {
        return this.transitions;
      });

      _defineProperty(this, "getTransitionsParamTypes", () => {
        const returnArray = [];

        if (this.transitions.length > 0) {
          for (let i = 0; i < this.transitions.length; i += 1) {
            returnArray[i] = getParamTypes(this.transitions[i].params);
          }
        }

        return returnArray;
      });

      _defineProperty(this, "getEvents", () => {
        return this.events;
      });

      this.events = abi !== undefined ? abi.events : []; // Array<object>

      this.fields = abi !== undefined ? abi.fields : []; // Array<object>

      this.name = abi !== undefined ? abi.name : ''; // string

      this.params = abi !== undefined ? abi.params : []; // Array<object>

      this.transitions = abi !== undefined ? abi.transitions : []; // Array<object>
    }

  }

  const Matchers = {
    ByStrX: /^ByStr[0-9]+$/,
    String: /^String$/,
    Uint: /^Uint(32|64|128|256)$/,
    Int: /^Int(32|64|128|256)$/,
    BNum: /^BNum$/
  };
  const validators = [{
    type: 'ByStrX',
    match: type => Matchers.ByStrX.test(type),
    validatorFn: value => laksaUtils.isByStrX.test(value)
  }, {
    type: 'UInt',
    match: type => Matchers.Uint.test(type),
    validatorFn: value => laksaUtils.isUint.test(value)
  }, {
    type: 'Int',
    match: type => Matchers.Int.test(type),
    validatorFn: value => laksaUtils.isInt.test(value)
  }, {
    type: 'BNum',
    match: type => Matchers.BNum.test(type),
    validatorFn: value => laksaUtils.isBN.test(laksaUtils.toBN(value))
  }, {
    type: 'String',
    match: type => Matchers.String.test(type),
    validatorFn: value => laksaUtils.isString.test(value)
  }];

  const validate = (type, value) => {
    return validators.some(val => val.match(type) && val.validatorFn(value));
  };

  const setParamValues = (rawParams, newValues) => {
    const newParams = [];
    rawParams.forEach((v, i) => {
      if (!validate(v.type, newValues[i])) {
        throw new TypeError(`Type validator failed,with <${v.vname}:${v.type}>`);
      }

      const newObj = Object.assign({}, v, {
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

  class Contract {
    constructor(abi, code, nodeProvider, scillaProvider) {
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

      _defineProperty(this, "on", () => {});

      _defineProperty(this, "deploy", ({
        blockNumber,
        privateKey,
        amount,
        gasPrice,
        gasLimit,
        nonce
      }) => {
        this.setBlockchain(blockNumber);
        this.setCreationBlock(blockNumber);

        const newDeployment = _objectSpread({}, this.rawTxObject, {
          nonce,
          amount: amount !== undefined ? laksaUtils.toBN(amount) : laksaUtils.toBN(0),
          gasPrice: gasPrice !== undefined ? laksaUtils.toBN(gasPrice).toNumber() : 1,
          gasLimit: gasLimit !== undefined ? laksaUtils.toBN(gasLimit).toNumber() : 50,
          code: JSON.stringify(this.code),
          data: JSON.stringify(this.initParams.concat(this.blockchain)) // console.log(newDeployment)

        });

        const txn = laksaCoreCrypto.createTransactionJson(privateKey, newDeployment);
        return txn;
      });

      _defineProperty(this, "call", () => {});

      this.abi = abi || {};
      this.code = code || '';
      this.nodeProvider = nodeProvider || undefined;
      this.scillaProvider = scillaProvider || undefined;
    }

    // provider Setter
    setNodeProvider(provider) {
      this.nodeProvider = provider;
    } // scilla provider Setter


    setScillaProvider(provider) {
      this.scillaProvider = provider;
    }

    setABI(abi) {
      this.abi = abi !== undefined ? new ABI(abi) : {};
    }

    setCode(code) {
      this.code = JSON.stringify(code) || '';
    }

    setInitParamsValues(initParams, arrayOfValues) {
      const result = setParamValues(initParams, arrayOfValues);
      this.initParams = result;
      return result;
    }

    setCreationBlock(blockNumber) {
      const result = setParamValues([{
        vname: '_creation_block',
        type: 'BNum'
      }], [laksaUtils.toBN(blockNumber).toString()]);
      this.initParams.push(result[0]);
      return result[0];
    }

    setBlockchain(blockNumber) {
      const result = setParamValues([{
        vname: 'BLOCKNUMBER',
        type: 'BNum'
      }], [laksaUtils.toBN(blockNumber).toString()]);
      this.blockchain.push(result[0]);
      return result[0];
    }

  }

  exports.Contract = Contract;
  exports.ABI = ABI;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
