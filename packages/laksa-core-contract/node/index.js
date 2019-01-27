(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('laksa-core-transaction'), require('laksa-shared'), require('laksa-core-crypto')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'laksa-core-transaction', 'laksa-shared', 'laksa-core-crypto'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.laksaCoreTransaction,global.laksaShared,global.laksaCoreCrypto));
}(this, (function (exports,laksaUtils,laksaCoreTransaction,laksaShared,laksaCoreCrypto) { 'use strict';

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
    validatorFn: value => laksaUtils.isByStrX.test(value),
    transformer: value => String(value)
  }, {
    type: 'UInt',
    match: type => Matchers.Uint.test(type),
    validatorFn: value => laksaUtils.isUint.test(value),
    transformer: value => Number(value, 10)
  }, {
    type: 'Int',
    match: type => Matchers.Int.test(type),
    validatorFn: value => laksaUtils.isInt.test(value),
    transformer: value => Number(value, 10)
  }, {
    type: 'BNum',
    match: type => Matchers.BNum.test(type),
    validatorFn: value => laksaUtils.isBN.test(new laksaUtils.BN(value)),
    transformer: value => Number(value, 10)
  }, {
    type: 'String',
    match: type => Matchers.String.test(type),
    validatorFn: value => laksaUtils.isString.test(value),
    transformer: value => String(value)
  }];
  const validate = (type, value) => {
    return validators.some(val => val.match(type) && val.validatorFn(value));
  };
  const transform = (type, value) => {
    if (validate(type, value)) {
      const found = validators.find(d => d.match(type));
      return found.transformer(value);
    } else {
      throw new Error('Cannot transform');
    }
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
      } else return [];
    }

    getFields() {
      return this.fields;
    }

    getFieldsTypes() {
      if (this.fields.length > 0) {
        return getParamTypes(this.fields);
      } else return [];
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

  const ContractStatus = Object.freeze({
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
   * @param  {Array<object>} rawParams {init params get from ABI}
   * @param  {Array<object>} newValues {init params set for ABI}
   * @return {Array<object>} {new array of params objects}
   */

  const setParamValues = (rawParams, newValues) => {
    const newParams = [];
    rawParams.forEach((v, i) => {
      if (!validate(v.type, newValues[i].value)) {
        throw new TypeError(`Type validator failed,with <${v.vname}:${v.type}>`);
      } // FIXME:it may change cause local scilla runner return the `name` not `vname`
      // But when call or make transaction, remote node only accpet `vname`


      const newObj = Object.assign({}, v, {
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
  let Contract = (_dec = laksaShared.assertObject({
    gasLimit: ['isLong', 'required'],
    gasPrice: ['isBN', 'required']
  }), _dec2 = laksaShared.assertObject({
    transition: ['isString', 'required'],
    params: ['isArray', 'required'],
    amount: ['isBN', 'optional'],
    gasLimit: ['isLong', 'optional'],
    gasPrice: ['isBN', 'optional']
  }), _dec3 = laksaShared.assertObject({
    gasLimit: ['isLong', 'required'],
    gasPrice: ['isBN', 'required']
  }), _dec4 = laksaShared.assertObject({
    transition: ['isString', 'required'],
    params: ['isArray', 'required'],
    amount: ['isBN', 'required'],
    gasLimit: ['isLong', 'required'],
    gasPrice: ['isBN', 'required']
  }), (_class = class Contract {
    constructor(params, factory, status = ContractStatus.INITIALISED) {
      this.code = params.code || '';
      this.init = params.init || [];
      this.version = params.version || 0;
      this.ContractAddress = params.ContractAddress || undefined;
      this.messenger = factory.messenger;
      this.signer = factory.signer;
      this.status = status;
      this.transaction = {};
    }
    /**
     * isInitialised
     *
     * Returns true if the contract has not been deployed
     *
     * @returns {boolean}
     */


    isInitialised() {
      return this.status === ContractStatus.INITIALISED;
    }
    /**
     * isSigned
     *
     * Returns true if the contract is signed
     *
     * @returns {boolean}
     */


    isSigned() {
      return this.status === ContractStatus.SIGNED;
    }
    /**
     * isSent
     *
     * Returns true if the contract is sent
     *
     * @returns {boolean}
     */


    isSent() {
      return this.status === ContractStatus.SENT;
    }
    /**
     * isDeployed
     *
     * Returns true if the contract is deployed
     *
     * @returns {boolean}
     */


    isDeployed() {
      return this.status === ContractStatus.DEPLOYED;
    }
    /**
     * isRejected
     *
     * Returns true if an attempt to deploy the contract was made, but the
     * underlying transaction was unsuccessful.
     *
     * @returns {boolean}
     */


    isRejected() {
      return this.status === ContractStatus.REJECTED;
    }
    /**
     * @function {payload}
     * @return {object} {default deployment payload}
     */


    get deployPayload() {
      return {
        version: this.version < 65535 ? this.messenger.setTransactionVersion(this.version) : this.version,
        amount: new laksaUtils.BN(0),
        toAddr: String(0).repeat(40),
        code: this.code,
        data: JSON.stringify(this.init).replace(/\\"/g, '"')
      };
    }

    get callPayload() {
      return {
        version: this.version < 65535 ? this.messenger.setTransactionVersion(this.version) : this.version,
        toAddr: this.ContractAddress
      };
    }
    /**
     * @function {setStatus}
     * @param  {string} status {contract status during all life-time}
     * @return {type} {set this.status}
     */


    setStatus(status) {
      this.status = status;
    }
    /**
     * @function {setInitParamsValues}
     * @param  {Array<Object>} initParams    {init params get from ABI}
     * @param  {Array<Object>} arrayOfValues {init params set for ABI}
     * @return {Contract} {raw contract object}
     */


    setInitParamsValues(initParams, arrayOfValues) {
      const result = setParamValues(initParams, arrayOfValues);
      this.init = result;
      return this;
    }
    /**
     * @function {deploy}
     * @param  {Object<{gasLimit:Long,gasPrice:BN}>} transactionParams { gasLimit and gasPrice}
     * @param  {Object<{account:Account,password?:String}>} accountParams {account and password}
     * @return {Contract} {Contract with finalty}
     */


    async deploy({
      gasLimit = laksaUtils.Long.fromNumber(2500),
      gasPrice = new laksaUtils.BN(100),
      account = this.signer.signer,
      password,
      maxAttempts = 20,
      interval = 1000
    }) {
      if (!this.code || !this.init) {
        throw new Error('Cannot deploy without code or ABI.');
      }

      try {
        this.setDeployPayload({
          gasLimit,
          gasPrice
        });
        await this.sendContract({
          account,
          password
        });
        await this.confirmTx(maxAttempts, interval);
        return this;
      } catch (err) {
        throw err;
      }
    }
    /**
     * call
     *
     * @param {string} transition
     * @param {any} params
     * @returns {Promise<Transaction>}
     */


    async call({
      transition,
      params,
      amount = new laksaUtils.BN(0),
      gasLimit = laksaUtils.Long.fromNumber(1000),
      gasPrice = new laksaUtils.BN(100),
      account = this.signer.signer,
      password,
      maxAttempts = 20,
      interval = 1000
    }) {
      if (!this.ContractAddress) {
        return Promise.reject(Error('Contract has not been deployed!'));
      }

      try {
        this.setCallPayload({
          transition,
          params,
          amount,
          gasLimit,
          gasPrice
        });
        await this.sendContract({
          account,
          password
        });
        await this.confirmTx(maxAttempts, interval);
        return this;
      } catch (err) {
        throw err;
      }
    }
    /**
     * @function {sendContract}
     * @param  {Object<{account:Account,password?:String}>} accountParams {account and password}
     * @return {Contract} {Contract Sent}
     */


    async sendContract({
      account = this.signer.signer,
      password
    }) {
      try {
        await this.signTxn({
          account,
          password
        });
        const {
          transaction,
          response
        } = await this.transaction.sendTransaction();
        this.ContractAddress = this.ContractAddress || response.ContractAddress;
        this.transaction = transaction.map(obj => {
          return _objectSpread({}, obj, {
            TranID: response.TranID
          });
        });
        this.setStatus(ContractStatus.SENT);
        return this;
      } catch (error) {
        throw error;
      }
    }
    /**
     * @function {signTxn}
     * @param  {Object<{account:Account,password?:String}>} accountParams {account and password}
     * @return {Contract} {Contract Signed}
     */


    async signTxn({
      account = this.signer.signer,
      password
    }) {
      try {
        this.transaction = await account.signTransaction(this.transaction, password);
        this.setStatus(ContractStatus.SIGNED);
        return this;
      } catch (error) {
        throw error;
      }
    }
    /**
     * @function {confirmTx}
     * @return {Contract} {Contract confirm with finalty}
     */


    async confirmTx(maxAttempts = 20, interval = 1000) {
      try {
        await this.transaction.confirm(this.transaction.TranID, maxAttempts, interval);

        if (!this.transaction.receipt || !this.transaction.receipt.success) {
          this.setStatus(ContractStatus.REJECTED);
          return this;
        }

        this.setStatus(ContractStatus.DEPLOYED);
        return this;
      } catch (error) {
        throw error;
      }
    }
    /**
     * @function {getState}
     * @return {type} {description}
     */


    async getState() {
      if (this.status !== ContractStatus.DEPLOYED) {
        return Promise.resolve([]);
      }

      const response = await this.messenger.send('GetSmartContractState', this.ContractAddress);
      return response;
    }

    setDeployPayload({
      gasPrice,
      gasLimit
    }) {
      this.transaction = new laksaCoreTransaction.Transaction(_objectSpread({}, this.deployPayload, {
        gasPrice,
        gasLimit
      }), this.messenger);
      return this;
    }

    setCallPayload({
      transition,
      params,
      amount,
      gasLimit,
      gasPrice
    }) {
      const msg = {
        _tag: transition,
        // TODO: this should be string, but is not yet supported by lookup.
        params
      };
      this.transaction = new laksaCoreTransaction.Transaction(_objectSpread({}, this.callPayload, {
        amount,
        gasPrice,
        gasLimit,
        data: JSON.stringify(msg)
      }), this.messenger);
      return this;
    }

  }, (_applyDecoratedDescriptor(_class.prototype, "deploy", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "deploy"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "call", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "call"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setDeployPayload", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "setDeployPayload"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setCallPayload", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "setCallPayload"), _class.prototype)), _class));

  var _dec$1, _dec2$1, _class$1;
  let TestScilla = (_dec$1 = laksaShared.assertObject({
    code: ['isString', 'required']
  }), _dec2$1 = laksaShared.assertObject({
    code: ['isString', 'required']
  }), (_class$1 = class TestScilla extends Contract {
    constructor(...props) {
      super(...props);

      _defineProperty(this, "blockchain", []);
    }
    /**
     * @function {testCall}
     * @param  {Int} gasLimit {gasLimit for test call to scilla-runner}
     * @return {Contract} {raw Contract object}
     */


    async testCall(gasLimit) {
      try {
        const callContractJson = {
          code: this.code,
          init: JSON.stringify(this.init),
          blockchain: JSON.stringify(this.blockchain),
          gaslimit: JSON.stringify(gasLimit) // the endpoint for sendServer has been set to scillaProvider

        };
        const result = await this.messenger.sendServer('/contract/call', callContractJson);

        if (result.result) {
          this.setStatus(ContractStatus.TESTED);
        } else {
          this.setStatus(ContractStatus.ERROR);
        }

        return this;
      } catch (error) {
        throw error;
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
      try {
        const result = await this.messenger.sendServer('/contract/check', {
          code
        });

        if (result.result && result.message !== undefined) {
          return JSON.parse(result.message);
        }
      } catch (error) {
        throw error;
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
      try {
        this.setCode(code);
        const abiObj = await this.getABI({
          code
        });
        this.setABI(abiObj);
        return this;
      } catch (error) {
        throw error;
      }
    }
    /**
     * @function {setBlockNumber}
     * @param  {Int} number {block number setted to blockchain}
     * @return {Contract|false} {raw contract}
     */


    async setBlockNumber(number) {
      try {
        if (number && laksaUtils.isInt(Number(number))) {
          this.setBlockchain(String(number));
          this.setCreationBlock(String(number));
          return this;
        } else if (number === undefined) {
          const result = await this.messenger.send('GetLatestTxBlock');

          if (result) {
            this.setBlockchain(result.header.BlockNum);
            this.setCreationBlock(result.header.BlockNum);
            return this;
          }
        }
      } catch (error) {
        throw error;
      }
    } //-------------------------------

    /**
     * @function {generateNewContractJson}
     * @return {Contract} {raw contract with code and init params}
     */


    get testPayload() {
      return _objectSpread({}, this.payload(), {
        code: this.code,
        data: JSON.stringify(this.init.concat(this.blockchain)).replace(/\\"/g, '"')
      });
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
      this.init = result;
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
      }], [{
        vname: '_creation_block',
        type: 'BNum',
        value: new laksaUtils.BN(blockNumber).toString()
      }]);
      const [...arr] = this.init;
      arr.push(result[0]);
      this.init = arr;
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
      }], [{
        vname: 'BLOCKNUMBER',
        type: 'BNum',
        value: new laksaUtils.BN(blockNumber).toString()
      }]);
      const [...arr] = this.blockchain;
      arr.push(result[0]);
      this.blockchain = arr;
      return this;
    }

  }, (_applyDecoratedDescriptor(_class$1.prototype, "getABI", [_dec$1], Object.getOwnPropertyDescriptor(_class$1.prototype, "getABI"), _class$1.prototype), _applyDecoratedDescriptor(_class$1.prototype, "decodeABI", [_dec2$1], Object.getOwnPropertyDescriptor(_class$1.prototype, "decodeABI"), _class$1.prototype)), _class$1));

  var _dec$2, _class$2;
  let Contracts = (_dec$2 = laksaShared.assertObject({
    ContractAddress: ['isAddress', 'optional'],
    code: ['isString', 'optional'],
    init: ['isArray', 'optional'],
    status: ['isString', 'optional']
  }), (_class$2 = class Contracts extends laksaShared.Core {
    constructor(messenger, signer) {
      super();
      this.messenger = messenger;
      this.signer = signer;
    }

    getAddressForContract(tx) {
      // always subtract 1 from the tx nonce, as contract addresses are computed
      // based on the nonce in the global state.
      const nonce = tx.txParams.nonce ? tx.txParams.nonce - 1 : 0;
      return laksaCoreCrypto.hashjs.sha256().update(tx.senderAddress, 'hex').update(laksaCoreCrypto.intToHexArray(nonce, 64).join(''), 'hex').digest('hex').slice(24);
    }

    new(code, init) {
      const newContract = new Contract({
        code,
        init
      }, {
        messenger: this.messenger,
        signer: this.signer
      }, ContractStatus.INITIALISED);
      return newContract;
    }

    at(contract) {
      return new Contract(_objectSpread({}, contract), {
        messenger: this.messenger,
        signer: this.signer
      }, contract.status);
    }

    async testContract(code, init) {
      const contract = new TestScilla({
        code,
        init
      }, {
        messenger: this.messenger,
        signer: this.signer
      }, ContractStatus.INITIALISED);
      const result = await contract // decode ABI from code first
      .decodeABI({
        code
      }) // we set the init params to decoded ABI
      .then(decoded => decoded.setInitParamsValues(decoded.abi.getInitParams(), init)) // we get the current block number from node, and set it to params
      .then(inited => inited.setBlockNumber()) // but we have to give it a test
      .then(ready => ready.testCall(2000)) // now we change the status to wait for sign
      .then(state => {
        return state.status === ContractStatus.TESTED ? {
          abi: state.abi,
          init: state.init,
          status: state.status
        } : false;
      });
      return result;
    }

  }, (_applyDecoratedDescriptor(_class$2.prototype, "at", [_dec$2], Object.getOwnPropertyDescriptor(_class$2.prototype, "at"), _class$2.prototype)), _class$2));

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

  Object.defineProperty(exports, '__esModule', { value: true });

})));
