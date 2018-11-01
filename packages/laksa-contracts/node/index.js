(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('laksa-core-contract')) :
  typeof define === 'function' && define.amd ? define(['laksa-core-contract'], factory) :
  (global.Laksa = factory(global.laksaCoreContract));
}(this, (function (laksaCoreContract) { 'use strict';

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

  class Contracts {
    constructor(messenger, signer) {
      _defineProperty(this, "storage", {
        waitForSign: [],
        deployed: []
        /**
         * @function {at}
         * @param  {string} address    {description}
         * @param  {ABI} abi        {description}
         * @param  {string} code       {scilla code string}
         * @param  {Array<object>} initParams {description}
         * @param  {Symbol} state      {description}
         * @return {Contract} {description}
         */

      });

      this.messenger = messenger;
      this.signer = signer;
    }

    at(address, abi, code, initParams, state) {
      return new laksaCoreContract.Contract(this, abi, address, code, initParams, state);
    }
    /**
     * @function {new}
     * @param  {string} code       {scilla code string}
     * @param  {Array<object>} initParams {array of init params}
     * @param  {object} options    {options that set for new contract}
     * @return {Contract} {contract that created}
     */


    async new(code, initParams, options) {
      const contract = new laksaCoreContract.Contract(this);
      const result = await contract // decode ABI from code first
      .decodeABI({
        code
      }) // we set the init params to decoded ABI
      .then(decoded => decoded.setInitParamsValues(decoded.abi.getInitParams(), initParams)) // we get the current block number from node, and set it to params
      .then(inited => inited.setBlockNumber(options ? options.blockNumber : undefined)) // we have a contract json now
      .then(setted => setted.generateNewContractJson()) // but we have to give it a test
      .then(ready => ready.testCall(options ? options.gasLimit : 2000)) // now we change the status to wait for sign
      .then(state => {
        if (state.contractStatus === laksaCoreContract.ContractStatus.waitForSign) {
          return state;
        }
      }); // now store it to contracts-storage array

      this.storage.waitForSign.push(_objectSpread({
        createTime: new Date()
      }, result));
      return result;
    }
    /**
     * @function {deploy}
     * @param  {Contract} contract {contract object}
     * @param  {Int} gasLimit {gasLimit that set for contract}
     * @param  {Int} gasPrice {gasPrice that set for contract}
     * @param  {Account} signer   {account that for sign}
     * @param  {string} password {password for signer if encrypted}
     * @return {Contract} {contract that deployed}
     */


    async deploy({
      contract,
      gasLimit,
      gasPrice
    }, {
      signer,
      password
    }) {
      // we need singer address to get the nonce
      const {
        nonce
      } = await this.messenger.send({
        method: 'GetBalance',
        params: [signer.address]
      }); // to create a txn Json

      const txnJson = {
        // version number for deployment
        version: 0,
        // increase the nonce
        nonce: nonce + 1,
        // set to 40 bit length zeros
        to: '0000000000000000000000000000000000000000',
        // deploying a new contract, amount will be zero according to zilliqa
        amount: laksaCoreContract.toBN(0),
        // gasPrice will be forced to transform to BN first in the future
        gasPrice: laksaCoreContract.toBN(gasPrice).toNumber(),
        // gasLimit will be forced to transform to BN first in the future
        gasLimit: laksaCoreContract.toBN(gasLimit).toNumber() // generate a new txn json with contract json

      };
      const txnDetail = Object.assign({}, contract.contractJson, txnJson); // check if the signer is encrypted

      const signedContract = typeof signer.privateKey !== 'symbol' ? signer.signTransaction(txnDetail) : await signer.signTransactionWithPassword(txnDetail, password); // if only the contract  have a signature with signer

      if (signedContract.signature) {
        // then we can deploy it
        const result = await contract.deploy(signedContract); // after that we save it to storage

        this.storage.deployed.push(_objectSpread({
          deployedTime: new Date()
        }, result));
        return result;
      }
    }

  }

  return Contracts;

})));
