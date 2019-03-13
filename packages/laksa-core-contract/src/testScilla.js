import { BN } from 'laksa-utils'
import { assertObject } from 'laksa-shared'
import { Contract } from './contract'
import { ContractStatus, setParamValues } from './util'
import { isInt } from './validate'
import { ABI } from './abi'

class TestScilla extends Contract {
  /**
   * @var {Array<Object>}blockchain
   * @memberof TestScilla.prototype
   * @description Create a Contract
   */
  blockchain = []

  constructor(...props) {
    super(...props)
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
        gaslimit: JSON.stringify(gasLimit)
      }
      // the endpoint for sendServer has been set to scillaProvider
      const result = await this.messenger.sendServer('/contract/call', callContractJson)

      if (result.result) {
        this.setStatus(ContractStatus.TESTED)
      } else {
        this.setStatus(ContractStatus.ERROR)
      }
      return this
    } catch (error) {
      throw error
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
  @assertObject({
    code: ['isString', 'required']
  })
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
   * @function decodeABI
   * @description decode ABI from scilla runner
   * @param  {Object} paramObject
   * @param  {String} paramObject.code - scilla code string
   * @return {TestScilla} test contract
   */
  @assertObject({
    code: ['isString', 'required']
  })
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
   * @function setBlockNumber
   * @memberof TestScilla
   * @description set block number for TestScilla
   * @param  {Number} number - block number setted to blockchain
   * @return {TestScilla|false} test contract
   */
  async setBlockNumber(number) {
    try {
      if (number && isInt(Number(number))) {
        this.setBlockchain(String(number))
        this.setCreationBlock(String(number))
        return this
      } else if (number === undefined) {
        const result = await this.messenger.send('GetLatestTxBlock')

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

  /**
   * @function testPayload
   * @memberof TestScilla.prototype
   * @description construct payload for TestScilla
   * @return {Object} payload object
   */
  get testPayload() {
    return {
      ...this.payload(),
      code: this.code,
      data: JSON.stringify(this.init.concat(this.blockchain)).replace(/\\"/g, '"')
    }
  }

  /**
   * @function setABI
   * @memberof TestScilla
   * @description set abi for TestScilla
   * @return {TestScilla} TestScilla instance
   */
  setABI(abi) {
    this.abi = new ABI(abi) || {}
    return this
  }

  /**
   * @function setCode
   * @memberof TestScilla
   * @description set code for TestScilla
   * @return {TestScilla} test contract
   */
  setCode(code) {
    this.code = code || ''
    return this
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
    const result = setParamValues(initParams, arrayOfValues)
    this.init = result
    return this
  }

  /**
   * @function setCreationBlock
   * @memberof TestScilla
   * @description set creation Block for TestScilla
   * @param  {Number} blockNumber - block number for blockchain
   * @return {TestScilla} test contract
   */
  setCreationBlock(blockNumber) {
    const result = setParamValues(
      [{ vname: '_creation_block', type: 'BNum' }],
      [{ vname: '_creation_block', type: 'BNum', value: new BN(blockNumber).toString() }]
    )

    const [...arr] = this.init
    arr.push(result[0])
    this.init = arr
    return this
  }

  /**
   * @function setBlockchain
   * @memberof TestScilla
   * @description set blockchain object for TestScilla
   * @param  {Number} blockNumber - block number for blockchain
   * @return {TestScilla} test contract
   */
  setBlockchain(blockNumber) {
    const result = setParamValues(
      [{ vname: 'BLOCKNUMBER', type: 'BNum' }],
      [{ vname: 'BLOCKNUMBER', type: 'BNum', value: new BN(blockNumber).toString() }]
    )
    const [...arr] = this.blockchain
    arr.push(result[0])
    this.blockchain = arr
    return this
  }
}

export { TestScilla }
