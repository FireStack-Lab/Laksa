import { Transaction, TxStatus } from 'laksa-core-transaction'
import { Long, BN } from 'laksa-utils'
import { assertObject } from 'laksa-shared'

import { ContractStatus, setParamValues } from './util'

/**
 * @class Contract
 * @param  {Object}  params - contract params
 * @param  {Contracts} factory - contract factory
 * @param  {String} status -Contract status
 * @return {Contract} Contract instance
 */
class Contract {
  constructor(params, factory, status = ContractStatus.INITIALISED) {
    /**
     * @var {String} code
     * @memberof Contract
     * @description code
     */
    this.code = params.code || ''
    /**
     * @var {Array<Object>} init
     * @memberof Contract
     * @description init
     */
    this.init = params.init || []
    /**
     * @var {Number} version
     * @memberof Contract
     * @description version
     */
    this.version = params.version || 0
    /**
     * @var {String} ContractAddress
     * @memberof Contract
     * @description ContractAddress
     */
    this.ContractAddress = params.ContractAddress || undefined
    /**
     * @var {Messenger} messenger
     * @memberof Contract
     * @description messenger
     */
    this.messenger = factory.messenger
    /**
     * @var {Wallet} signer
     * @memberof Contract
     * @description signer
     */
    this.signer = factory.signer
    /**
     * @var {String} status
     * @memberof Contract
     * @description status
     */
    this.status = status
    /**
     * @var {Transaction|Object} transaction
     * @memberof Contract
     * @description transaction
     */
    this.transaction = {}
  }

  /**
   * @function isInitialised
   * @description return true if the contract has been initialised
   * @memberof Contract
   * @return {Boolean}
   */
  isInitialised() {
    return this.status === ContractStatus.INITIALISED
  }

  /**
   * @function isSigned
   * @description return true if the contract has been signed
   * @memberof Contract
   * @return {Boolean}
   */
  isSigned() {
    return this.status === ContractStatus.SIGNED
  }

  /**
   * @function isSent
   * @description return true if the contract has been sent
   * @memberof Contract
   * @return {Boolean}
   */
  isSent() {
    return this.status === ContractStatus.SENT
  }

  /**
   * @function isDeployed
   * @description return true if the contract has been deployed
   * @memberof Contract
   * @return {Boolean}
   */
  isDeployed() {
    return this.status === ContractStatus.DEPLOYED
  }

  /**
   * @function isRejected
   * @description return true if the contract has been rejected
   * @memberof Contract
   * @return {Boolean}
   */
  isRejected() {
    return this.status === ContractStatus.REJECTED
  }

  /**
   * @function deployPayload
   * @description return deploy payload
   * @memberof Contract
   * @return {Object} - Deploy payload
   */
  get deployPayload() {
    return {
      version:
        this.version < 65535
          ? this.messenger.setTransactionVersion(this.version, this.messenger.Network_ID)
          : this.version,
      amount: new BN(0),
      toAddr: String(0).repeat(40),
      code: this.code,
      data: JSON.stringify(this.init).replace(/\\"/g, '"')
    }
  }

  /**
   * @function callPayload
   * @description return deploy payload
   * @memberof Contract
   * @return {Object} - call payload
   */
  get callPayload() {
    return {
      version:
        this.version < 65535
          ? this.messenger.setTransactionVersion(this.version, this.messenger.Network_ID)
          : this.version,
      toAddr: this.ContractAddress
    }
  }

  /**
   * @function setStatus
   * @description set Contract status
   * @memberof Contract
   * @param  {String} status contract status during all life-time
   */
  setStatus(status) {
    this.status = status
  }

  /**
   * @function setInitParamsValues
   * @memberof Contract
   * @description set init params value and return Contract
   * @param  {Array<Object>} initParams    init params get from ABI
   * @param  {Array<Object>} arrayOfValues init params set for ABI
   * @return {Contract} Contract instance
   */
  setInitParamsValues(initParams, arrayOfValues) {
    const result = setParamValues(initParams, arrayOfValues)
    this.init = result
    return this
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
   * @function sendContract
   * @memberof Contract
   * @description send contract with account and password
   * @param {Object} paramObject
   * @param {Account} paramObject.account - Account to sign
   * @param {String} paramObject.password - Account's password if it is encrypted
   * @return {Promise<Contract>} Contract instance
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
   * @function signTxn
   * @memberof Contract
   * @description sign contract with account and password
   * @param {Object} paramObject
   * @param {Account} paramObject.account - Account to sign
   * @param {String} paramObject.password - Account's password if it is encrypted
   * @return {Promise<Contract>} Contract instance
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
   * @function confirmTx
   * @memberof Contract
   * @description confirm transaction with maxAttempts and intervel
   * @param {Number} maxAttempts - max tries
   * @param {Number} interval - try confirm intervally
   * @return {Promise<Contract>} Contract instance
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
   * @function getState
   * @memberof Contract
   * @description get smart contract state
   * @return {Object} RPC response
   */
  async getState() {
    if (this.status !== ContractStatus.DEPLOYED) {
      return Promise.resolve([])
    }

    const response = await this.messenger.send('GetSmartContractState', this.ContractAddress)

    return response
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
