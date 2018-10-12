import Transaction from 'laksa-core-transaction'
import { sign } from 'laksa-shared'
import { validate, toBN, isInt } from './validate'
import ABI from './abi'

export const ContractStatus = {
  initialised: Symbol('initialised'),
  waitForSign: Symbol('waitForSign'),
  rejected: Symbol('rejected'),
  deployed: Symbol('deployed')
}

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

export class Contract {
  contractJson = {}

  blockchain = []

  constructor(factory, abi, address, code, initParams, state) {
    this.messenger = factory.messenger
    this.signer = factory.signer

    this.address = address || undefined
    if (address) {
      this.abi = abi
      this.address = address
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

  // event
  on = () => {}

  // test call to scilla runner
  async testCall(gasLimit) {
    const callContractJson = {
      code: this.code,
      init: JSON.stringify(this.initParams),
      blockchain: JSON.stringify(this.blockchain),
      gaslimit: JSON.stringify(gasLimit)
    }
    // the endpoint for sendServer has been set to scillaProvider
    const result = await this.messenger.sendServer('/contract/call', callContractJson)
    if (result.result) {
      this.setContractStatus(ContractStatus.waitForSign)
    }
    return this
  }

  @sign
  async prepareTx(tx) {
    const raw = tx.txParams

    // const { code, ...rest } = raw
    const response = await this.messenger.send({
      method: 'CreateTransaction',
      params: [{ ...raw, amount: raw.amount.toNumber() }]
    })

    return tx.confirm(response.TranID)
  }

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
          to: defaultContractJson.to,
          // pubKey: this.signer.publicKey,
          // amount should be 0.  we don't accept implicitly anymore.
          amount: toBN(0),
          gasPrice: toBN(gasPrice).toNumber(),
          gasLimit: toBN(gasLimit).toNumber(),
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

  async deploy(signedTxn) {
    if (!signedTxn.signature) throw new Error('transaction has not been signed')
    const deployedTxn = Object.assign({}, { ...signedTxn, amount: signedTxn.amount.toNumber() })
    const result = await this.messenger.send({ method: 'CreateTransaction', params: [deployedTxn] })
    if (result) {
      this.setContractStatus(ContractStatus.deployed)
    }
    return { ...this, txnId: result }
  }

  /**
   * call
   *
   * @param {string} transition
   * @param {any} params
   * @returns {Promise<Transaction>}
   */
  async call(transition, params, amount = toBN(0)) {
    const msg = {
      _tag: transition,
      // TODO: this should be string, but is not yet supported by lookup.
      params
    }

    try {
      return await this.prepareTx(
        new Transaction({
          version: 0,
          to: defaultContractJson.to,
          amount: toBN(amount),
          gasPrice: 1000,
          gasLimit: 1000,
          data: JSON.stringify(msg)
        })
      )
    } catch (err) {
      throw err
    }
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

  async setBlockNumber(number) {
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
    this.setContractStatus(ContractStatus.initialised)
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
