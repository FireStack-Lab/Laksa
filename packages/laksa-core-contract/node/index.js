(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils));
}(this, (function (exports,laksaUtils) { 'use strict';

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
      this.events = abi !== undefined ? abi.events : []; // Array<object>

      this.fields = abi !== undefined ? abi.fields : []; // Array<object>

      this.name = abi !== undefined ? abi.name : ''; // string

      this.params = abi !== undefined ? abi.params : []; // Array<object>

      this.transitions = abi !== undefined ? abi.transitions : []; // Array<object>
    }

    getName() {
      return this.name;
    }

    getInitParams() {
      return this.params;
    }

    getInitParamTypes() {
      if (this.params.length > 0) {
        return getParamTypes(this.params);
      }
    }

    getFields() {
      return this.fields;
    }

    getFieldsTypes() {
      if (this.fields.length > 0) {
        return getParamTypes(this.fields);
      }
    }

    getTransitions() {
      return this.transitions;
    }

    getTransitionsParamTypes() {
      const returnArray = [];

      if (this.transitions.length > 0) {
        for (let i = 0; i < this.transitions.length; i += 1) {
          returnArray[i] = getParamTypes(this.transitions[i].params);
        }
      }

      return returnArray;
    }

    getEvents() {
      return this.events;
    }

  }

  const setParamValues = (rawParams, newValues) => {
    const newParams = [];
    rawParams.forEach((v, i) => {
      if (!validate(v.type, newValues[i])) {
        throw new TypeError(`Type validator failed,with <${v.vname}:${v.type}>`);
      } // FIXME:it may change cause local scilla runner return the `name` not `vname`
      // But when call or make transaction, remote node only accpet `vname`


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

  const defaultContractJson = {
    to: '0000000000000000000000000000000000000000',
    code: '',
    data: ''
  };

  class Contract {
    constructor(messenger) {
      _defineProperty(this, "contractStatus", '');

      _defineProperty(this, "contractJson", {});

      _defineProperty(this, "abi", {});

      _defineProperty(this, "code", '');

      _defineProperty(this, "initParams", []);

      _defineProperty(this, "blockchain", []);

      _defineProperty(this, "on", () => {});

      this.messenger = messenger;
    }

    // test call to scilla runner
    async testCall({
      gasLimit
    }) {
      const callContractJson = {
        code: this.code,
        init: JSON.stringify(this.initParams),
        blockchain: JSON.stringify(this.blockchain),
        gaslimit: JSON.stringify(gasLimit) // the endpoint for sendServer has been set to scillaProvider

      };
      const result = await this.messenger.sendServer('/contract/call', callContractJson);

      if (result.result) {
        this.setContractStatus('waitForSign');
      }

      return this;
    }

    async deploy(signedTxn) {
      if (!signedTxn.signature) throw new Error('transaction has not been signed');
      const deployedTxn = Object.assign({}, _objectSpread({}, signedTxn, {
        amount: signedTxn.amount.toNumber()
      }));
      const result = await this.messenger.send({
        method: 'CreateTransaction',
        params: [deployedTxn]
      });

      if (result) {
        this.setContractStatus('deployed');
      }

      return _objectSpread({}, this, {
        txnId: result
      });
    } //-------------------------------


    async getABI({
      code
    }) {
      // the endpoint for sendServer has been set to scillaProvider
      const result = await this.messenger.sendServer('/contract/check', {
        code
      });

      if (result.result && result.message !== undefined) {
        return JSON.parse(result.message);
      }
    }

    async decodeABI({
      code
    }) {
      this.setCode(code);
      const abiObj = await this.getABI({
        code
      });
      this.setABI(abiObj);
      return this;
    }

    async setBlockNumber() {
      const result = await this.messenger.send({
        method: 'GetLatestTxBlock',
        param: []
      });

      if (result) {
        this.setBlockchain(result.header.BlockNum);
        this.setCreationBlock(result.header.BlockNum);
        return this;
      }

      return false;
    } //-------------------------------
    // new contract json for deploy


    generateNewContractJson() {
      this.contractJson = _objectSpread({}, defaultContractJson, {
        code: JSON.stringify(this.code),
        data: JSON.stringify(this.initParams.concat(this.blockchain))
      });
      this.setContractStatus('initialized');
      return this;
    }

    setABI(abi) {
      this.abi = new ABI(abi) || {};
      return this;
    }

    setCode(code) {
      this.code = code || '';
      return this;
    }

    setInitParamsValues(initParams, arrayOfValues) {
      const result = setParamValues(initParams, arrayOfValues);
      this.initParams = result;
      return this;
    }

    setCreationBlock(blockNumber) {
      const result = setParamValues([{
        vname: '_creation_block',
        type: 'BNum'
      }], [laksaUtils.toBN(blockNumber).toString()]);
      this.initParams.push(result[0]);
      return this;
    }

    setBlockchain(blockNumber) {
      const result = setParamValues([{
        vname: 'BLOCKNUMBER',
        type: 'BNum'
      }], [laksaUtils.toBN(blockNumber).toString()]);
      this.blockchain.push(result[0]);
      return this;
    } // messenger Setter


    setMessenger(messenger) {
      this.messenger = messenger || undefined;
    }

    setContractStatus(status) {
      this.contractStatus = status;
    }

  }

  exports.toBN = laksaUtils.toBN;
  exports.Contract = Contract;
  exports.ABI = ABI;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
