import { validate, toBN } from './validate'
import ABI from './abi'

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
  to: '0000000000000000000000000000000000000000',
  code: '',
  data: ''
}

class Contract {
  constructor(messenger) {
    this.messenger = messenger
  }

  contractStatus = ''

  contractJson = {}

  abi = {}

  code = ''

  initParams = []

  blockchain = []

  // event
  on = () => {}

  // test call to scilla runner
  async testCall({ gasLimit }) {
    const callContractJson = {
      code: this.code,
      init: JSON.stringify(this.initParams),
      blockchain: JSON.stringify(this.blockchain),
      gaslimit: JSON.stringify(gasLimit)
    }
    // the endpoint for sendServer has been set to scillaProvider
    const result = await this.messenger.sendServer('/contract/call', callContractJson)
    if (result.result) {
      this.setContractStatus('waitForSign')
    }
    return this
  }

  async deploy(signedTxn) {
    if (!signedTxn.signature) throw new Error('transaction has not been signed')
    const deployedTxn = Object.assign({}, { ...signedTxn, amount: signedTxn.amount.toNumber() })
    const result = await this.messenger.send({ method: 'CreateTransaction', params: [deployedTxn] })
    if (result) {
      this.setContractStatus('deployed')
    }
    return { ...this, txnId: result }
  }

  //-------------------------------
  async getABI({ code }) {
    // the endpoint for sendServer has been set to scillaProvider
    const result = await this.messenger.sendServer('/contract/check', { code })
    if (result.result && result.message !== undefined) {
      return JSON.parse(result.message)
    }
  }

  async decodeABI({ code }) {
    this.setCode(code)
    const abiObj = await this.getABI({ code })
    this.setABI(abiObj)
    return this
  }

  async setBlockNumber() {
    const result = await this.messenger.send({ method: 'GetLatestTxBlock', param: [] })
    if (result) {
      this.setBlockchain(result.header.BlockNum)
      this.setCreationBlock(result.header.BlockNum)
      return this
    }
    return false
  }

  //-------------------------------
  // new contract json for deploy
  generateNewContractJson() {
    this.contractJson = {
      ...defaultContractJson,
      code: JSON.stringify(this.code),
      data: JSON.stringify(this.initParams.concat(this.blockchain))
    }
    this.setContractStatus('initialized')
    return this
  }

  setABI(abi) {
    this.abi = new ABI(abi) || {}
    return this
  }

  setCode(code) {
    this.code = code || ''
    return this
  }

  setInitParamsValues(initParams, arrayOfValues) {
    const result = setParamValues(initParams, arrayOfValues)
    this.initParams = result
    return this
  }

  setCreationBlock(blockNumber) {
    const result = setParamValues(
      [{ vname: '_creation_block', type: 'BNum' }],
      [toBN(blockNumber).toString()]
    )
    this.initParams.push(result[0])
    return this
  }

  setBlockchain(blockNumber) {
    const result = setParamValues(
      [{ vname: 'BLOCKNUMBER', type: 'BNum' }],
      [toBN(blockNumber).toString()]
    )
    this.blockchain.push(result[0])
    return this
  }

  // messenger Setter
  setMessenger(messenger) {
    this.messenger = messenger || undefined
  }

  setContractStatus(status) {
    this.contractStatus = status
  }
}

export default Contract
