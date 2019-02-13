import { Transaction, TxStatus } from 'laksa-core-transaction'
import { Long, BN } from 'laksa-utils'
import { assertObject } from 'laksa-shared'

import { ContractStatus, setParamValues } from './util'

class Contract {
  constructor(params, factory, status = ContractStatus.INITIALISED) {
    this.code = params.code || ''
    this.init = params.init || []
    this.version = params.version || 0
    this.ContractAddress = params.ContractAddress || undefined
    this.messenger = factory.messenger
    this.signer = factory.signer
    this.status = status
    this.transaction = {}
  }

  /**
   * isInitialised
   *
   * Returns true if the contract has not been deployed
   *
   * @returns {boolean}
   */
  isInitialised() {
    return this.status === ContractStatus.INITIALISED
  }

  /**
   * isSigned
   *
   * Returns true if the contract is signed
   *
   * @returns {boolean}
   */
  isSigned() {
    return this.status === ContractStatus.SIGNED
  }

  /**
   * isSent
   *
   * Returns true if the contract is sent
   *
   * @returns {boolean}
   */
  isSent() {
    return this.status === ContractStatus.SENT
  }

  /**
   * isDeployed
   *
   * Returns true if the contract is deployed
   *
   * @returns {boolean}
   */
  isDeployed() {
    return this.status === ContractStatus.DEPLOYED
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
    return this.status === ContractStatus.REJECTED
  }

  /**
   * @function {payload}
   * @return {object} {default deployment payload}
   */
  get deployPayload() {
    return {
      version:
        this.version < 65535 ? this.messenger.setTransactionVersion(this.version) : this.version,
      amount: new BN(0),
      toAddr: String(0).repeat(40),
      code: this.code,
      data: JSON.stringify(this.init).replace(/\\"/g, '"')
    }
  }

  get callPayload() {
    return {
      version:
        this.version < 65535 ? this.messenger.setTransactionVersion(this.version) : this.version,
      toAddr: this.ContractAddress
    }
  }

  /**
   * @function {setStatus}
   * @param  {string} status {contract status during all life-time}
   * @return {type} {set this.status}
   */
  setStatus(status) {
    this.status = status
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
   * @function {deploy}
   * @param  {Object<{gasLimit:Long,gasPrice:BN}>} transactionParams { gasLimit and gasPrice}
   * @param  {Object<{account:Account,password?:String}>} accountParams {account and password}
   * @return {Contract} {Contract with finalty}
   */
  @assertObject({
    gasLimit: ['isLong', 'required'],
    gasPrice: ['isBN', 'required'],
    toDS: ['isBoolean', 'optional']
  })
  async deploy({
    gasLimit = Long.fromNumber(2500),
    gasPrice = new BN(100),
    account = this.signer.signer,
    password,
    maxAttempts = 20,
    interval = 1000,
    toDS = false
  }) {
    if (!this.code || !this.init) {
      throw new Error('Cannot deploy without code or ABI.')
    }

    try {
      this.setDeployPayload({ gasLimit, gasPrice, toDS })
      await this.sendContract({ account, password })
      await this.confirmTx(maxAttempts, interval)
      return this
    } catch (err) {
      throw err
    }
  }

  /**
   * call
   *
   * @param {string} transition
   * @param {any} params
   * @returns {Promise<Transaction>}
   */
  @assertObject({
    transition: ['isString', 'required'],
    params: ['isArray', 'required'],
    amount: ['isBN', 'optional'],
    gasLimit: ['isLong', 'optional'],
    gasPrice: ['isBN', 'optional'],
    toDS: ['isBoolean', 'optional']
  })
  async call({
    transition,
    params,
    amount = new BN(0),
    gasLimit = Long.fromNumber(1000),
    gasPrice = new BN(100),
    account = this.signer.signer,
    password,
    maxAttempts = 20,
    interval = 1000,
    toDS = false
  }) {
    if (!this.ContractAddress) {
      return Promise.reject(Error('Contract has not been deployed!'))
    }

    try {
      this.setCallPayload({
        transition,
        params,
        amount,
        gasLimit,
        gasPrice,
        toDS
      })
      await this.sendContract({ account, password })
      await this.confirmTx(maxAttempts, interval)
      return this
    } catch (err) {
      throw err
    }
  }

  /**
   * @function {sendContract}
   * @param  {Object<{account:Account,password?:String}>} accountParams {account and password}
   * @return {Contract} {Contract Sent}
   */
  async sendContract({ account = this.signer.signer, password }) {
    try {
      await this.signTxn({ account, password })
      const { transaction, response } = await this.transaction.sendTransaction()
      this.ContractAddress = this.ContractAddress || response.ContractAddress
      this.transaction = transaction.map(obj => {
        return { ...obj, TranID: response.TranID }
      })
      this.setStatus(ContractStatus.SENT)
      return this
    } catch (error) {
      throw error
    }
  }

  /**
   * @function {signTxn}
   * @param  {Object<{account:Account,password?:String}>} accountParams {account and password}
   * @return {Contract} {Contract Signed}
   */
  async signTxn({ account = this.signer.signer, password }) {
    try {
      this.transaction = await account.signTransaction(this.transaction, password)
      this.setStatus(ContractStatus.SIGNED)
      return this
    } catch (error) {
      throw error
    }
  }

  /**
   * @function {confirmTx}
   * @return {Contract} {Contract confirm with finalty}
   */
  async confirmTx(maxAttempts = 20, interval = 1000) {
    try {
      await this.transaction.confirm(this.transaction.TranID, maxAttempts, interval)
      if (!this.transaction.receipt || !this.transaction.receipt.success) {
        this.setStatus(ContractStatus.REJECTED)
        return this
      }
      this.setStatus(ContractStatus.DEPLOYED)
      return this
    } catch (error) {
      throw error
    }
  }

  /**
   * @function {getState}
   * @return {type} {description}
   */
  async getState() {
    if (this.status !== ContractStatus.DEPLOYED) {
      return Promise.resolve([])
    }

    const response = await this.messenger.send('GetSmartContractState', this.ContractAddress)

    return response
  }

  @assertObject({
    gasLimit: ['isLong', 'required'],
    gasPrice: ['isBN', 'required'],
    toDS: ['isBoolean', 'optional']
  })
  setDeployPayload({ gasPrice, gasLimit, toDS }) {
    this.transaction = new Transaction(
      {
        ...this.deployPayload,
        gasPrice,
        gasLimit
      },
      this.messenger,
      TxStatus.Initialised,
      toDS
    )
    return this
  }

  @assertObject({
    transition: ['isString', 'required'],
    params: ['isArray', 'required'],
    amount: ['isBN', 'required'],
    gasLimit: ['isLong', 'required'],
    gasPrice: ['isBN', 'required'],
    toDS: ['isBoolean', 'optional']
  })
  setCallPayload({
    transition, params, amount, gasLimit, gasPrice, toDS
  }) {
    const msg = {
      _tag: transition,

      // TODO: this should be string, but is not yet supported by lookup.
      params
    }
    this.transaction = new Transaction(
      {
        ...this.callPayload,
        amount,
        gasPrice,
        gasLimit,
        data: JSON.stringify(msg)
      },
      this.messenger,
      TxStatus.Initialised,
      toDS
    )
    return this
  }
}

export { Contract }
