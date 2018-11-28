import { Contract } from './contract'
import { ContractStatus } from './util'
import { validate, toBN, isInt } from './validate'
import { ABI } from './abi'
/**
 * @function setParamValues
 * @param  {Array<object>} rawParams {init params get from ABI}
 * @param  {Array<object>} newValues {init params set for ABI}
 * @return {Array<object>} {new array of params objects}
 */
const setParamValues = (rawParams, newValues) => {
  const newParams = []
  rawParams.forEach((v, i) => {
    if (!validate(v.type, newValues[i].value)) {
      throw new TypeError(`Type validator failed,with <${v.vname}:${v.type}>`)
    }
    // FIXME:it may change cause local scilla runner return the `name` not `vname`
    // But when call or make transaction, remote node only accpet `vname`
    const newObj = Object.assign({}, v, {
      value: newValues[i].value,
      vname: v.name ? v.name : v.vname
    })
    if (newObj.name) {
      delete newObj.name
    }
    newParams.push(newObj)
  })
  return newParams
}

export class TestScilla extends Contract {
  blockchain = []

  constructor(...props) {
    super(...props)
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

  //-------------------------------

  /**
   * @function {generateNewContractJson}
   * @return {Contract} {raw contract with code and init params}
   */
  get testPayload() {
    return {
      ...this.payload(),
      code: this.code,
      data: JSON.stringify(this.init.concat(this.blockchain)).replace(/\\"/g, '"')
    }
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
    this.init = result
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
      [{ vname: '_creation_block', type: 'BNum', value: toBN(blockNumber).toString() }]
    )

    const [...arr] = this.init
    arr.push(result[0])
    this.init = arr
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
      [{ vname: 'BLOCKNUMBER', type: 'BNum', value: toBN(blockNumber).toString() }]
    )
    const [...arr] = this.blockchain
    arr.push(result[0])
    this.blockchain = arr
    return this
  }
}
