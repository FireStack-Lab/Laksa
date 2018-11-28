import { Transaction } from 'laksa-core-transaction'
import { Long } from 'laksa-utils'
import { toBN } from './validate'
import { ContractStatus } from './util'

export class Contract {
<<<<<<< HEAD
  contractJson = {}

  contractTestJson = {}

  blockchain = []

  initTestParams = []

  constructor(messenger, signer, abi, ContractAddress, code, initParams, contractStatus) {
    this.messenger = messenger
    this.signer = signer

    this.ContractAddress = ContractAddress || undefined
    if (ContractAddress) {
      this.abi = abi
      this.ContractAddress = ContractAddress
      this.initParams = initParams
      this.contractStatus = contractStatus || ContractStatus.deployed
    } else {
      // assume we're deploying
      this.abi = abi
      this.code = code
      this.initParams = initParams
      this.contractStatus = contractStatus || ContractStatus.initialised
=======
  constructor(params, factory, status = ContractStatus.INITIALISED) {
    this.code = params.code || ''
    this.init = params.init || []
    this.ContractAddress = params.ContractAddress || undefined
    this.messenger = factory.messenger
    this.signer = factory.signer
    this.status = status
  }

  get payload() {
    return {
      version: 0,
      amount: toBN(0),
      toAddr: String(0).repeat(40),
      code: this.code,
      data: JSON.stringify(this.init).replace(/\\"/g, '"')
>>>>>>> next
    }
  }

  setStatus(status) {
    this.status = status
  }

  async prepareTx(tx, { account, password }) {
    try {
<<<<<<< HEAD
      const { transaction, response } = await tx.sendTxn()
=======
      await this.signTxn(tx, { account, password })
      const { transaction, response } = await tx.sendTransaction()
>>>>>>> next
      this.ContractAddress = response.ContractAddress
      this.transaction = transaction.map(obj => {
        return { ...obj, TranID: response.TranID }
      })
      return tx.confirm(response.TranID)
    } catch (error) {
      throw error
    }
  }

  async deploy(
    { gasLimit = Long.fromNumber(2500), gasPrice = toBN(10) },
    { account = this.signer.signer, password }
  ) {
    if (!this.code || !this.init) {
      throw new Error('Cannot deploy without code or ABI.')
    }
    // console.log(this.signer)
    try {
      const tx = await this.prepareTx(
        new Transaction(
          {
<<<<<<< HEAD
            version: 0,
            toAddr: defaultContractJson.toAddr,
            amount: toBN(0),
            gasPrice: toBN(gasPrice),
            gasLimit: toBN(gasLimit),
            code: this.code,
            data: JSON.stringify(this.initParams).replace(/\\"/g, '"')
          },
          this.messenger
        )
=======
            ...this.payload,
            gasPrice,
            gasLimit
          },
          this.messenger
        ),
        { account, password }
>>>>>>> next
      )

      if (!tx.receipt || !tx.receipt.success) {
        this.setStatus(ContractStatus.REJECTED)
        return this
      }

      this.setStatus(ContractStatus.DEPLOYED)
      return this
    } catch (err) {
      throw err
    }
  }

<<<<<<< HEAD
  // /**
  //  * @function {deploy}
  //  * @param  {Transaction} signedTxn {description}
  //  * @return {Contract} {Contract that deployed successfully}
  //  */
  // async deploy(signedTxn) {
  //   if (!signedTxn.signature) throw new Error('transaction has not been signed')
  //   try {
  //     const deployedTxn = Object.assign(
  //       {},
  //       {
  //         ...signedTxn.txParams,
  //         amount: signedTxn.amount.toString(),
  //         gasLimit: signedTxn.gasLimit.toString(),
  //         gasPrice: signedTxn.gasPrice.toString()
  //       }
  //     )
  //     const result = await this.messenger.send({
  //       method: 'CreateTransaction',
  //       params: [deployedTxn]
  //     })

  //     if (result.TranID) {
  //       this.ContractAddress = result.ContractAddress
  //       this.setContractStatus(ContractStatus.sent)
  //       this.transaction = signedTxn.map(obj => {
  //         return { ...obj, TranID: result.TranID }
  //       })
  //       return this
  //     } else {
  //       this.setContractStatus(ContractStatus.rejected)
  //       return this
  //     }
  //   } catch (error) {
  //     throw error
  //   }
  // }

  /**
   * @function {deploy}
   * @param  {Transaction} signedTxn {description}
   * @return {Contract} {Contract that deployed successfully}
   */
  async deploy(signedTxn) {
    try {
      const { response } = await signedTxn.sendTxn()
      this.ContractAddress = response.ContractAddress
      if (response.TranID) {
        this.ContractAddress = response.ContractAddress
        this.setContractStatus(ContractStatus.sent)
        this.transaction = signedTxn.map(obj => {
          return { ...obj, TranID: response.TranID }
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
  async call(transition, params, amount = toBN(0), gasLimit = toBN(1000), gasPrice = toBN(10)) {
    try {
      const msg = {
        _tag: transition,
        // TODO: this should be string, but is not yet supported by lookup.
        params
      }
      if (!this.ContractAddress) {
        return Promise.reject(new Error('Contract has not been deployed!'))
      }
      return await this.prepareTx(
        new Transaction(
          {
            version: 0,
            toAddr: defaultContractJson.toAddr,
            amount: toBN(amount),
            gasPrice: toBN(gasPrice),
            gasLimit: toBN(gasLimit),
            data: JSON.stringify(msg)
          },
          this.messenger
        )
      )
=======
  async signTxn(txn, { account, password }) {
    try {
      const result = await account.signTransaction(txn, password)
      this.setStatus(ContractStatus.SIGNED)
      return result
>>>>>>> next
    } catch (error) {
      throw error
    }
  }
<<<<<<< HEAD

  /**
   * @function {getState}
   * @return {Promise<State>} {description}
   */
  async getState() {
    if (this.ContratStatus !== ContractStatus.Deployed) {
      return Promise.resolve([])
    }
    try {
      const response = await this.messenger.send({
        method: 'GetSmartContractState',
        params: [this.ContractAddress]
      })

      return response.result
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
=======
>>>>>>> next
}
