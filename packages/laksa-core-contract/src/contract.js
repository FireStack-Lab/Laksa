import { Transaction } from 'laksa-core-transaction'
import { sign } from 'laksa-shared'
import {
  validate, toBN, isInt, isHash
} from './validate'
import { ABI } from './abi'

export const ContractStatus = {
  initialised: 'initialised',
  waitForSign: 'waitForSign',
  sent: 'sent',
  rejected: 'rejected',
  deployed: 'deployed'
}

/**
 * @function setParamValues
 * @param  {Array<object>} rawParams {init params get from ABI}
 * @param  {Array<object>} newValues {init params set for ABI}
 * @return {Array<object>} {new array of params objects}
 */
const setParamValues = (rawParams, newValues) => {
  const newParams = []
  rawParams.forEach((v, i) => {
    if (!validate(v.type, newValues[i])) {
      throw new TypeError(`Type validator failed,with <${v.vname}:${v.type}>`)
    }
    // FIXME:it may change cause local scilla runner return the `name` not `vname`
    // But when call or make transaction, remote node only accpet `vname`
    const newObj = Object.assign({}, v, { value: newValues[i], vname: v.name ? v.name : v.vname })
    if (newObj.name) {
      delete newObj.name
    }
    newParams.push(newObj)
  })
  return newParams
}

const defaultContractJson = {
  toAddr: '0000000000000000000000000000000000000000',
  code: '',
  data: ''
}

export class Contract {
  contractJson = {}

  contractTestJson = {}

  blockchain = []

  initTestParams = []

  constructor(messenger, signer, abi, ContractAddress, code, initParams, state) {
    this.messenger = messenger
    this.signer = signer

    this.ContractAddress = ContractAddress || undefined
    if (ContractAddress) {
      this.abi = abi
      this.ContractAddress = ContractAddress
      this.initParams = initParams
      this.state = state
      this.contractStatus = ContractStatus.deployed
    } else {
      // assume we're deploying
      this.abi = abi
      this.code = code
      this.initParams = initParams
      this.contractStatus = ContractStatus.initialised
    }
  }

  /**
   * @function {on}
   * @return {Event} {description}
   */
  on = () => {}

  /**
   * @function {testCall}
   * @param  {Int} gasLimit {gasLimit for test call to scilla-runner}
   * @return {Contract} {raw Contract object}
   */
  async testCall(gasLimit) {
    try {
      const callContractJson = {
        code: this.code,
        init: JSON.stringify(this.initTestParams),
        blockchain: JSON.stringify(this.blockchain),
        gaslimit: JSON.stringify(gasLimit)
      }
      // the endpoint for sendServer has been set to scillaProvider
      const result = await this.messenger.sendServer('/contract/call', callContractJson)

      if (result.result) {
        this.setContractStatus(ContractStatus.waitForSign)
      }
      return this
    } catch (error) {
      throw error
    }
  }

  @sign
  async prepareTx(tx) {
    try {
      const raw = tx.txParams
      /**
       * @function response
       * @returns {Object}
       * @param {Address} ContractAddress {contract address that deployed}
       * @param {string} Info  {Infomation that server returns}
       * @param {TranID} TranID  {transaction ID that server returns},
       */

      const response = await this.messenger.send({
        method: 'CreateTransaction',
        params: [
          {
            ...raw,
            amount: raw.amount.toString(),
            gasLimit: raw.gasLimit.toString(),
            gasPrice: raw.gasPrice.toString()
          }
        ]
      })

      return tx.confirm(response.TranID)
    } catch (error) {
      throw error
    }
  }

  /**
   * @function {deployTxn}
   * @param  {Int} gasPrice {gasPrice}
   * @param  {Int} gasLimit {gasLimit}
   * @return {Contract} {description}
   */
  async deployTxn({ gasPrice, gasLimit }) {
    if (!this.code || !this.initParams) {
      throw new Error('Cannot deploy without code or ABI.')
    }
    // console.log(this.signer)
    try {
      Transaction.setMessenger(this.messenger)
      const tx = await this.prepareTx(
        new Transaction({
          version: 0,
          toAddr: defaultContractJson.toAddr,
          // pubKey: this.signer.publicKey,
          // amount should be 0.  we don't accept implicitly anymore.
          amount: toBN(0),
          gasPrice: toBN(gasPrice),
          gasLimit: toBN(gasLimit),
          code: this.code,
          data: JSON.stringify(this.initParams).replace(/\\"/g, '"')
        })
      )
      if (!tx.receipt || !tx.receipt.success) {
        this.setContractStatus(ContractStatus.rejected)
        return this
      }

      this.setContractStatus(ContractStatus.deployed)
      return this
    } catch (err) {
      throw err
    }
  }

  /**
   * @function {deploy}
   * @param  {Transaction} signedTxn {description}
   * @return {Contract} {Contract that deployed successfully}
   */
  async deploy(signedTxn) {
    if (!signedTxn.signature) throw new Error('transaction has not been signed')
    try {
      const deployedTxn = Object.assign(
        {},
        {
          ...signedTxn.txParams,
          amount: signedTxn.amount.toString(),
          gasLimit: signedTxn.gasLimit.toString(),
          gasPrice: signedTxn.gasPrice.toString()
        }
      )
      const result = await this.messenger.send({
        method: 'CreateTransaction',
        params: [deployedTxn]
      })

      if (result.TranID) {
        this.ContractAddress = result.ContractAddress
        this.setContractStatus(ContractStatus.sent)
        this.transaction = signedTxn.map(obj => {
          return { ...obj, TranID: result.TranID }
        })
        return this
      } else {
        this.setContractStatus(ContractStatus.rejected)
        return this
      }
    } catch (error) {
      throw error
    }
  }

  async track() {
    try {
      if (!isHash(this.transaction.TranID)) {
        throw new Error('the contract has not been sent')
      }
      Transaction.setMessenger(this.messenger)
      const result = await this.transaction.confirm(this.transaction.TranID)
      if (result && (!result.receipt || !result.receipt.success)) {
        this.setContractStatus(ContractStatus.rejected)
        return this
      } else if (result && result.receipt && result.receipt.success) {
        this.setContractStatus(ContractStatus.deployed)
      }

      return this
    } catch (error) {
      throw error
    }
  }

  /**
   * call
   *
   * @param {string} transition
   * @param {any} params
   * @returns {Promise<Transaction>}
   */
  async call(transition, params, amount = toBN(0)) {
    try {
      const msg = {
        _tag: transition,
        // TODO: this should be string, but is not yet supported by lookup.
        params
      }
      return await this.prepareTx(
        new Transaction({
          version: 0,
          toAddr: defaultContractJson.toAddr,
          amount: toBN(amount),
          gasPrice: toBN(1000),
          gasLimit: toBN(1000),
          data: JSON.stringify(msg)
        })
      )
    } catch (error) {
      throw error
    }
  }

  //-------------------------------
  /**
   * @function {getABI}
   * @param  {string} { code {scilla code string}
   * @return {ABI} {ABI object}
   */
  async getABI({ code }) {
    // the endpoint for sendServer has been set to scillaProvider
    try {
      const result = await this.messenger.sendServer('/contract/check', { code })
      if (result.result && result.message !== undefined) {
        return JSON.parse(result.message)
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * @function {decodeABI}
   * @param  {string} { code {scilla code string}
   * @return {Contract} {raw contract}
   */
  async decodeABI({ code }) {
    try {
      this.setCode(code)
      const abiObj = await this.getABI({ code })
      this.setABI(abiObj)
      return this
    } catch (error) {
      throw error
    }
  }

  /**
   * @function {setBlockNumber}
   * @param  {Int} number {block number setted to blockchain}
   * @return {Contract|false} {raw contract}
   */
  async setBlockNumber(number) {
    try {
      if (number && isInt(Number(number))) {
        this.setBlockchain(String(number))
        this.setCreationBlock(String(number))
        return this
      } else if (number === undefined) {
        const result = await this.messenger.send({ method: 'GetLatestTxBlock', param: [] })
        if (result) {
          this.setBlockchain(result.header.BlockNum)
          this.setCreationBlock(result.header.BlockNum)
          return this
        }
      }
    } catch (error) {
      throw error
    }
  }

  //-------------------------------

  /**
   * @function {generateNewContractJson}
   * @return {Contract} {raw contract with code and init params}
   */
  generateNewContractJson() {
    this.contractJson = {
      ...defaultContractJson,
      code: this.code,
      data: JSON.stringify(this.initParams).replace(/\\"/g, '"')
    }
    this.contractTestJson = {
      ...defaultContractJson,
      code: this.code,
      data: JSON.stringify(this.initTestParams.concat(this.blockchain)).replace(/\\"/g, '"')
    }
    this.setContractStatus(ContractStatus.initialised)
    return this
  }

  /**
   * @function {setABIe}
   * @param  {ABI} abi {ABI object}
   * @return {Contract} {raw contract}
   */
  setABI(abi) {
    this.abi = new ABI(abi) || {}
    return this
  }

  /**
   * @function {setCode}
   * @param  {string} code {scilla code string}
   * @return {Contract} {raw contract with code}
   */
  setCode(code) {
    this.code = code || ''
    return this
  }

  /**
   * @function {setInitParamsValues}
   * @param  {Array<Object>} initParams    {init params get from ABI}
   * @param  {Array<Object>} arrayOfValues {init params set for ABI}
   * @return {Contract} {raw contract object}
   */
  setInitParamsValues(initParams, arrayOfValues) {
    const result = setParamValues(initParams, arrayOfValues)
    this.initParams = result
    return this
  }

  /**
   * @function {setCreationBlock}
   * @param  {Int} blockNumber {block number for blockchain}
   * @return {Contract} {raw contract object}
   */
  setCreationBlock(blockNumber) {
    const result = setParamValues(
      [{ vname: '_creation_block', type: 'BNum' }],
      [toBN(blockNumber).toString()]
    )

    const [...arr] = this.initParams
    arr.push(result[0])
    this.initTestParams = arr

    return this
  }

  /**
   * @function {setBlockchain}
   * @param  {Int} blockNumber {block number for blockchain}
   * @return {Contract} {raw contract object}
   */
  setBlockchain(blockNumber) {
    const result = setParamValues(
      [{ vname: 'BLOCKNUMBER', type: 'BNum' }],
      [toBN(blockNumber).toString()]
    )
    const [...arr] = this.blockchain
    arr.push(result[0])
    this.blockchain = arr
    return this
  }

  /**
   * @function {setMessenger}
   * @param  {Messenger} messenger {messenger instance}
   * @return {Messenger} {setter}
   */
  setMessenger(messenger) {
    this.messenger = messenger || undefined
  }

  /**
   * @function {setContractStatus}
   * @param  {Symbol} status {status symbol}
   * @return {Symbol} {setter}
   */
  setContractStatus(status) {
    this.contractStatus = status
  }
}
