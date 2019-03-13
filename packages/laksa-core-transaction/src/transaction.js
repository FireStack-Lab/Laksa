import {
  encodeTransactionProto,
  getAddressFromPublicKey,
  toChecksumAddress
} from 'laksa-core-crypto'
import { sleep, TxStatus } from './util'

/**
 * @class Transaction
 * @description Createa a Transaction instance
 * @param {Object} params - params object
 * @param {Messenger} messenger - messenger instance
 * @param {String} status - txstatus
 * @param {Boolean} toDs - send to Shard
 * @return {Transaction} = Transaction instance
 */
class Transaction {
  constructor(params, messenger, status = TxStatus.Initialised, toDS = false) {
    // params
    this.version = params.version
    this.TranID = params.TranID
    this.toAddr = params.toAddr.toLowerCase()
    this.nonce = params.nonce
    this.pubKey = params.pubKey
    this.amount = params.amount
    this.code = params.code || ''
    this.data = params.data || ''
    this.signature = params.signature
    this.gasPrice = params.gasPrice
    this.gasLimit = params.gasLimit
    this.receipt = params.receipt
    // status
    this.status = status
    this.messenger = messenger
    this.toDS = toDS
  }

  /**
   * @function confirm
   * @memberof Transaction
   * @param {BaseTx} params
   */
  static confirm(params, messenger) {
    return new Transaction(params, messenger, TxStatus.Confirmed)
  }

  /**
   *@function reject
   * @memberof Transaction
   * @param {BaseTx} params
   */
  static reject(params, messenger) {
    return new Transaction(params, messenger, TxStatus.Rejected)
  }

  setMessenger(messenger) {
    this.messenger = messenger
  }

  /**
   * @param {TxStatus} status
   * @returns {undefined}
   */
  setStatus(status) {
    this.status = status
    return this
  }

  get bytes() {
    return encodeTransactionProto(this.txParams)
  }

  get txParams() {
    return {
      version: this.version,
      // this.messenger.setTransactionVersion(this.version),
      TranID: this.TranID,
      toAddr: toChecksumAddress(this.toAddr).slice(2),
      // after updated to the core, it will not slice
      nonce: this.nonce,
      pubKey: this.pubKey,
      amount: this.amount,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      code: this.code,
      data: this.data,
      signature: this.signature,
      receipt: this.receipt
    }
  }

  get senderAddress() {
    if (!this.pubKey) {
      return String(0).repeat(40)
    }
    return getAddressFromPublicKey(this.pubKey)
  }

  /**
   * @function isPending
   *
   * @returns {boolean}
   */
  isPending() {
    return this.status === TxStatus.Pending
  }

  /**
   * @function isInitialised
   *
   * @returns {boolean}
   */
  isInitialised() {
    return this.status === TxStatus.Initialised
  }

  /**
   * @function isRejected
   *
   * @returns {boolean}
   */
  isSigned() {
    return this.status === TxStatus.Signed
  }

  /**
   * @function isConfirmed
   *
   * @returns {boolean}
   */
  isConfirmed() {
    return this.status === TxStatus.Confirmed
  }

  /**
   * @function isRejected
   *
   * @returns {boolean}
   */
  isRejected() {
    return this.status === TxStatus.Rejected
  }

  async sendTransaction() {
    if (!this.signature) {
      throw new Error('The Transaction has not been signed')
    }
    try {
      const raw = this.txParams
      const result = await this.messenger.send('CreateTransaction', {
        ...raw,
        amount: raw.amount.toString(),
        gasLimit: raw.gasLimit.toString(),
        gasPrice: raw.gasPrice.toString(),
        priority: this.toDS
      })
      const { TranID } = result

      if (!TranID) {
        throw new Error('Transaction fail')
      } else {
        this.TranID = TranID
        this.status = TxStatus.Pending
        return { transaction: this, response: result }
      }
    } catch (error) {
      throw error
    }
  }

  // /**
  //  * confirmReceipt
  //  *
  //  * Similar to the Promise API. This sets the Transaction instance to a state
  //  * of pending. Calling this function kicks off a passive loop that polls the
  //  * lookup node for confirmation on the txHash.
  //  *
  //  * The polls are performed with a linear backoff:
  //  *
  //  * `const delay = interval * attempt`
  //  *
  //  * This is a low-level method that you should generally not have to use
  //  * directly.
  //  */

  /*
   *
   * @param {string} txHash
   * @param {number} maxAttempts
   * @param {number} initial interval in milliseconds
   * @returns {Promise<Transaction>}
   */
  async confirm(txHash, maxAttempts = 20, interval = 1000) {
    this.status = TxStatus.Pending
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        if (await this.trackTx(txHash)) {
          return this
        }
      } catch (err) {
        this.status = TxStatus.Rejected
        throw err
      }
      if (attempt + 1 < maxAttempts) {
        await sleep(interval * attempt)
      }
    }
    this.status = TxStatus.Rejected
    throw new Error(`The transaction is still not confirmed after ${maxAttempts} attempts.`)
  }

  map(fn) {
    const newParams = fn(this.txParams)
    this.setParams(newParams)

    return this
  }

  setParams(params) {
    this.version = params.version
    this.TranID = params.TranID
    this.toAddr = params.toAddr
    this.nonce = params.nonce
    this.pubKey = params.pubKey
    this.amount = params.amount
    this.code = params.code
    this.data = params.data
    this.signature = params.signature
    this.gasPrice = params.gasPrice
    this.gasLimit = params.gasLimit
    this.receipt = params.receipt
  }

  async trackTx(txHash) {
    // TODO: regex validation for txHash so we don't get garbage
    const res = await this.messenger.send('GetTransaction', txHash)
    if (res.responseType === 'error') {
      return false
    }

    this.TranID = res.ID
    this.receipt = res.receipt
    this.status = this.receipt && this.receipt.success ? TxStatus.Confirmed : TxStatus.Rejected
    return true
  }
}

export { Transaction }
