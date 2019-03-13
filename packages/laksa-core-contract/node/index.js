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

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils'), require('laksa-core-transaction'), require('laksa-shared'), require('laksa-core-crypto')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils', 'laksa-core-transaction', 'laksa-shared', 'laksa-core-crypto'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils,global.laksaCoreTransaction,global.laksaShared,global.laksaCoreCrypto));
}(this, (function (exports,laksaUtils,laksaCoreTransaction,laksaShared,laksaCoreCrypto) { 'use strict';

  /**
   * @var {Object<String>} Matchers
   * @description Matchers object with multiple patterns
   */

  const Matchers = {
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
  /**
   * @function validate
   * @description validate param type and it's value
   * @param  {String} type  - param type
   * @param  {any} value - param value to validate
   * @return {Boolean} validate result
   */

  const validate = (type, value) => {
    return validators.some(val => val.match(type) && val.validatorFn(value));
  };
  /**
   * @function transform
   * @description transform a value to it's validator format
   * @param  {String} type  - param type
   * @param  {any} value - param value to validate
   * @return {any} transform result
   */

  const transform = (type, value) => {
    if (validate(type, value)) {
      const found = validators.find(d => d.match(type));
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
    const result = [];
    list.map((obj, index) => {
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


  class ABI {
    constructor(abi) {
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


    getName() {
      return this.name;
    }
    /**
     * @function getInitParams
     * @memberof ABI
     * @description params getter
     * @return {String} ABI.params
     */


    getInitParams() {
      return this.params;
    }
    /**
     * @function getInitParamTypes
     * @memberof ABI
     * @description get param types array
     * @return {Array<Object>} param types
     */


    getInitParamTypes() {
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


    getFields() {
      return this.fields;
    }
    /**
     * @function getFieldsTypes
     * @memberof ABI
     * @description get fields types array
     * @return {Array<Object>} fields types
     */


    getFieldsTypes() {
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


    getTransitions() {
      return this.transitions;
    }
    /**
     * @function getTransitionsParamTypes
     * @memberof ABI
     * @description get transitions types array
     * @return {Array<Object>} transitions types
     */


    getTransitionsParamTypes() {
      const returnArray = [];

      if (this.transitions.length > 0) {
        for (let i = 0; i < this.transitions.length; i += 1) {
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

  /**
   * @var {Object} ContractStatus
   * @description  immutable contract status
   */

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
   * @description set param values
   * @param  {Array<Object>} rawParams - init params get from ABI
   * @param  {Array<Object>} newValues - init params set for ABI
   * @return {Array<objObjectect>} new array of params objects
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
  /**
   * @class Contract
   * @param  {Object}  params - contract params
   * @param  {Contracts} factory - contract factory
   * @param  {String} status -Contract status
   * @return {Contract} Contract instance
   */

  let Contract = (_dec = laksaShared.assertObject({
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
  }), (_class = class Contract {
    constructor(params, factory, status = ContractStatus.INITIALISED) {
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


    isInitialised() {
      return this.status === ContractStatus.INITIALISED;
    }
    /**
     * @function isSigned
     * @description return true if the contract has been signed
     * @memberof Contract
     * @return {Boolean}
     */


    isSigned() {
      return this.status === ContractStatus.SIGNED;
    }
    /**
     * @function isSent
     * @description return true if the contract has been sent
     * @memberof Contract
     * @return {Boolean}
     */


    isSent() {
      return this.status === ContractStatus.SENT;
    }
    /**
     * @function isDeployed
     * @description return true if the contract has been deployed
     * @memberof Contract
     * @return {Boolean}
     */


    isDeployed() {
      return this.status === ContractStatus.DEPLOYED;
    }
    /**
     * @function isRejected
     * @description return true if the contract has been rejected
     * @memberof Contract
     * @return {Boolean}
     */


    isRejected() {
      return this.status === ContractStatus.REJECTED;
    }
    /**
     * @function deployPayload
     * @description return deploy payload
     * @memberof Contract
     * @return {Object} Deploy payload
     */


    get deployPayload() {
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


    get callPayload() {
      return {
        version: this.version < 65535 ? this.messenger.setTransactionVersion(this.version, this.messenger.Network_ID) : this.version,
        toAddr: this.ContractAddress
      };
    }
    /**
     * @function setStatus
     * @description set Contract status
     * @memberof Contract
     * @param  {String} status - contract status during all life-time
     */


    setStatus(status) {
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


    setInitParamsValues(initParams, arrayOfValues) {
      const result = setParamValues(initParams, arrayOfValues);
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


    async deploy({
      gasLimit = laksaUtils.Long.fromNumber(2500),
      gasPrice = new laksaUtils.BN(100),
      account = this.signer.signer,
      password,
      maxAttempts = 20,
      interval = 1000,
      toDS = false
    }) {
      if (!this.code || !this.init) {
        throw new Error('Cannot deploy without code or ABI.');
      }

      try {
        this.setDeployPayload({
          gasLimit,
          gasPrice,
          toDS
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


    async call({
      transition,
      params,
      amount = new laksaUtils.BN(0),
      gasLimit = laksaUtils.Long.fromNumber(1000),
      gasPrice = new laksaUtils.BN(100),
      account = this.signer.signer,
      password,
      maxAttempts = 20,
      interval = 1000,
      toDS = false
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
          gasPrice,
          toDS
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
     * @function sendContract
     * @memberof Contract
     * @description send contract with account and password
     * @param {Object} paramObject
     * @param {Account} paramObject.account - Account to sign
     * @param {String} paramObject.password - Account's password if it is encrypted
     * @return {Promise<Contract>} Contract instance
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
     * @function signTxn
     * @memberof Contract
     * @description sign contract with account and password
     * @param {Object} paramObject
     * @param {Account} paramObject.account - Account to sign
     * @param {String} paramObject.password - Account's password if it is encrypted
     * @return {Promise<Contract>} Contract instance
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
     * @function confirmTx
     * @memberof Contract
     * @description confirm transaction with maxAttempts and intervel
     * @param {Number} maxAttempts - max tries
     * @param {Number} interval - try confirm intervally
     * @return {Promise<Contract>} Contract instance
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
     * @function getState
     * @memberof Contract
     * @description get smart contract state
     * @return {Object} - RPC response
     */


    async getState() {
      if (this.status !== ContractStatus.DEPLOYED) {
        return Promise.resolve([]);
      }

      const response = await this.messenger.send('GetSmartContractState', this.ContractAddress);
      return response;
    }
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


    setDeployPayload({
      gasPrice,
      gasLimit,
      toDS
    }) {
      this.transaction = new laksaCoreTransaction.Transaction(_objectSpread({}, this.deployPayload, {
        gasPrice,
        gasLimit
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


    setCallPayload({
      transition,
      params,
      amount,
      gasLimit,
      gasPrice,
      toDS
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
      }), this.messenger, laksaCoreTransaction.TxStatus.Initialised, toDS);
      return this;
    }

  }, (_applyDecoratedDescriptor(_class.prototype, "deploy", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "deploy"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "call", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "call"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setDeployPayload", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "setDeployPayload"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setCallPayload", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "setCallPayload"), _class.prototype)), _class));

  var _dec$1, _dec2$1, _class$1;
  let TestScilla = (_dec$1 = laksaShared.assertObject({
    code: ['isString', 'required']
  }), _dec2$1 = laksaShared.assertObject({
    code: ['isString', 'required']
  }), (_class$1 = class TestScilla extends Contract {
    /**
     * @var {Array<Object>}blockchain
     * @memberof TestScilla.prototype
     * @description Create a Contract
     */
    constructor(...props) {
      super(...props);

      _defineProperty(this, "blockchain", []);
    }
    /**
     * @function testCall
     * @memberof TestScilla
     * @description a Test Contract instance
     * @param  {BN} gasLimit - gasLimit for test call to scilla-runner
     * @return {TestScilla} raw Contract object
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
    }
    /**
     * @function getABI
     * @memberof TestScilla
     * @description get ABI from scilla runner
     * @param  {Object} params
     * @param  {String} params.code - code string
     * @return {Object} RPC result
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
     * @function decodeABI
     * @description decode ABI from scilla runner
     * @param  {Object} paramObject
     * @param  {String} paramObject.code - scilla code string
     * @return {TestScilla} test contract
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
     * @function setBlockNumber
     * @memberof TestScilla
     * @description set block number for TestScilla
     * @param  {Number} number - block number setted to blockchain
     * @return {TestScilla|false} test contract
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
    }
    /**
     * @function testPayload
     * @memberof TestScilla.prototype
     * @description construct payload for TestScilla
     * @return {Object} payload object
     */


    get testPayload() {
      return _objectSpread({}, this.payload(), {
        code: this.code,
        data: JSON.stringify(this.init.concat(this.blockchain)).replace(/\\"/g, '"')
      });
    }
    /**
     * @function setABI
     * @memberof TestScilla
     * @description set abi for TestScilla
     * @return {TestScilla} TestScilla instance
     */


    setABI(abi) {
      this.abi = new ABI(abi) || {};
      return this;
    }
    /**
     * @function setCode
     * @memberof TestScilla
     * @description set code for TestScilla
     * @return {TestScilla} test contract
     */


    setCode(code) {
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


    setInitParamsValues(initParams, arrayOfValues) {
      const result = setParamValues(initParams, arrayOfValues);
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
     * @function setBlockchain
     * @memberof TestScilla
     * @description set blockchain object for TestScilla
     * @param  {Number} blockNumber - block number for blockchain
     * @return {TestScilla} test contract
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
  /**
   * @class Contracts
   * @param  {Messenger}  messenger - Messenger instance
   * @param  {Wallet} signer - Wallet instance
   * @return {Contracts} Contract factory
   */

  let Contracts = (_dec$2 = laksaShared.assertObject({
    ContractAddress: ['isAddress', 'optional'],
    code: ['isString', 'optional'],
    init: ['isArray', 'optional'],
    status: ['isString', 'optional']
  }), (_class$2 = class Contracts extends laksaShared.Core {
    constructor(messenger, signer) {
      super();
      /**
       * @var {Messeger} messenger
       * @memberof Contracts.prototype
       * @description Messenger instance
       */

      this.messenger = messenger;
      /**
       * @var {Wallet} signer
       * @memberof Contracts.prototype
       * @description Wallet instance
       */

      this.signer = signer;
    }
    /**
     * @function getAddressForContract
     * @memberof Contracts
     * @description get Contract address from Transaction
     * @param  {Transaction} tx - Transaction instance
     * @return {String} Contract address
     */


    getAddressForContract(tx) {
      // always subtract 1 from the tx nonce, as contract addresses are computed
      // based on the nonce in the global state.
      const nonce = tx.txParams.nonce ? tx.txParams.nonce - 1 : 0;
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
    /**
     * @function at
     * @memberof Contracts
     * @description get a Contract from factory and give it Messenger and Wallet as members
     * @param  {Contract} contract - Contract instance
     * @return {Contract} Contract instance
     */


    at(contract) {
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
