(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('laksa-core-transaction'), require('laksa-shared')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'laksa-core-transaction', 'laksa-shared'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.laksaCoreTransaction,global.laksaShared));
}(this, (function (exports,laksaUtils,laksaCoreTransaction,laksaShared) { 'use strict';

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
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

  var _class;
  const ContractStatus = {
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
  let Contract = (_class = class Contract {
    constructor(factory, abi, address, code, initParams, state) {
      _defineProperty(this, "contractJson", {});

      _defineProperty(this, "blockchain", []);

      _defineProperty(this, "on", () => {});

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


    /**
     * @function {testCall}
     * @param  {Int} gasLimit {gasLimit for test call to scilla-runner}
     * @return {Contract} {raw Contract object}
     */
    async testCall(gasLimit) {
      const callContractJson = {
        code: this.code,
        init: JSON.stringify(this.initParams),
        blockchain: JSON.stringify(this.blockchain),
        gaslimit: JSON.stringify(gasLimit) // the endpoint for sendServer has been set to scillaProvider

      };
      const result = await this.messenger.sendServer('/contract/call', callContractJson);

      if (result.result) {
        this.setContractStatus(ContractStatus.waitForSign);
      }

      return this;
    }

    async prepareTx(tx) {
      const raw = tx.txParams;
      /**
       * @function response
       * @returns {Object}
       * @param {Address} ContractAddress {contract address that deployed}
       * @param {string} Info  {Infomation that server returns}
       * @param {TranID} TranID  {transaction ID that server returns},
       */

      const response = await this.messenger.send({
        method: 'CreateTransaction',
        params: [_objectSpread({}, raw, {
          amount: raw.amount.toNumber()
        })]
      });
      return tx.confirm(response.TranID);
    }
    /**
     * @function {deployTxn}
     * @param  {Int} gasPrice {gasPrice}
     * @param  {Int} gasLimit {gasLimit}
     * @return {Contract} {description}
     */


    async deployTxn({
      gasPrice,
      gasLimit
    }) {
      if (!this.code || !this.initParams) {
        throw new Error('Cannot deploy without code or ABI.');
      } // console.log(this.signer)


      try {
        laksaCoreTransaction.Transaction.setMessenger(this.messenger);
        const tx = await this.prepareTx(new laksaCoreTransaction.Transaction({
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

        if (!tx.receipt || !tx.receipt.success) {
          this.setContractStatus(ContractStatus.rejected);
          return this;
        }

        this.setContractStatus(ContractStatus.deployed);
        return this;
      } catch (err) {
        throw err;
      }
    }
    /**
     * @function {deploy}
     * @param  {Transaction} signedTxn {description}
     * @return {Contract} {Contract that deployed successfully}
     */


    async deploy(signedTxn) {
      if (!signedTxn.signature) throw new Error('transaction has not been signed');
      const deployedTxn = Object.assign({}, _objectSpread({}, signedTxn, {
        amount: signedTxn.amount.toNumber()
      }));
      const result = await this.messenger.send({
        method: 'CreateTransaction',
        params: [deployedTxn]
      });

      if (result.TranID) {
        this.address = result.ContractAddress;
        this.setContractStatus(ContractStatus.deployed);
        return _objectSpread({}, this, {
          TranID: result.TranID
        });
      } else {
        this.setContractStatus(ContractStatus.rejected);
        return this;
      }
    }
    /**
     * call
     *
     * @param {string} transition
     * @param {any} params
     * @returns {Promise<Transaction>}
     */


    async call(transition, params, amount = laksaUtils.toBN(0)) {
      const msg = {
        _tag: transition,
        // TODO: this should be string, but is not yet supported by lookup.
        params
      };

      try {
        return await this.prepareTx(new laksaCoreTransaction.Transaction({
          version: 0,
          to: defaultContractJson.to,
          amount: laksaUtils.toBN(amount),
          gasPrice: 1000,
          gasLimit: 1000,
          data: JSON.stringify(msg)
        }));
      } catch (err) {
        throw err;
      }
    } //-------------------------------

    /**
     * @function {getABI}
     * @param  {string} { code {scilla code string}
     * @return {ABI} {ABI object}
     */


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
    /**
     * @function {decodeABI}
     * @param  {string} { code {scilla code string}
     * @return {Contract} {raw contract}
     */


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
    /**
     * @function {setBlockNumber}
     * @param  {Int} number {block number setted to blockchain}
     * @return {Contract|false} {raw contract}
     */


    async setBlockNumber(number) {
      if (number && laksaUtils.isInt(Number(number))) {
        this.setBlockchain(String(number));
        this.setCreationBlock(String(number));
        return this;
      } else if (number === undefined) {
        const result = await this.messenger.send({
          method: 'GetLatestTxBlock',
          param: []
        });

        if (result) {
          this.setBlockchain(result.header.BlockNum);
          this.setCreationBlock(result.header.BlockNum);
          return this;
        }
      }

      return false;
    } //-------------------------------

    /**
     * @function {generateNewContractJson}
     * @return {Contract} {raw contract with code and init params}
     */


    generateNewContractJson() {
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


    setABI(abi) {
      this.abi = new ABI(abi) || {};
      return this;
    }
    /**
     * @function {setCode}
     * @param  {string} code {scilla code string}
     * @return {Contract} {raw contract with code}
     */


    setCode(code) {
      this.code = code || '';
      return this;
    }
    /**
     * @function {setInitParamsValues}
     * @param  {Array<Object>} initParams    {init params get from ABI}
     * @param  {Array<Object>} arrayOfValues {init params set for ABI}
     * @return {Contract} {raw contract object}
     */


    setInitParamsValues(initParams, arrayOfValues) {
      const result = setParamValues(initParams, arrayOfValues);
      this.initParams = result;
      return this;
    }
    /**
     * @function {setCreationBlock}
     * @param  {Int} blockNumber {block number for blockchain}
     * @return {Contract} {raw contract object}
     */


    setCreationBlock(blockNumber) {
      const result = setParamValues([{
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


    setBlockchain(blockNumber) {
      const result = setParamValues([{
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


    setMessenger(messenger) {
      this.messenger = messenger || undefined;
    }
    /**
     * @function {setContractStatus}
     * @param  {Symbol} status {status symbol}
     * @return {Symbol} {setter}
     */


    setContractStatus(status) {
      this.contractStatus = status;
    }

  }, (_applyDecoratedDescriptor(_class.prototype, "prepareTx", [laksaShared.sign], Object.getOwnPropertyDescriptor(_class.prototype, "prepareTx"), _class.prototype)), _class);

  exports.toBN = laksaUtils.toBN;
  exports.Contract = Contract;
  exports.ContractStatus = ContractStatus;
  exports.ABI = ABI;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
