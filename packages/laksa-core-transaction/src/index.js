import { encodeTransaction } from './util'

const TxStatus = {
  Pending: Symbol('Pending'),
  Initialised: Symbol('Initialised'),
  Confirmed: Symbol('Confirmed'),
  Rejected: Symbol('Rejected')
}

class Transaction {
  constructor(params, status = TxStatus.Initialised) {
    // params
    this.version = params.version
    this.id = params.id
    this.to = params.to
    this.nonce = params.nonce
    this.pubKey = params.pubKey
    this.amount = params.amount
    this.code = params.code
    this.data = params.data
    this.signature = params.signature
    this.gasPrice = params.gasPrice
    this.gasLimit = params.gasLimit
    this.receipt = params.receipt
    // status
    this.status = status
  }

  /**
   * confirmed
   *
   * constructs an already-confirmed transaction.
   *
   * @static
   * @param {BaseTx} params
   */
  static confirm(params) {
    return new Transaction(params, TxStatus.Confirmed)
  }

  static messenger

  static setMessenger(messenger) {
    Transaction.messenger = messenger
  }

  // parameters
  version

  to

  amount

  gasPrice

  gasLimit

  id

  code

  data

  receipt

  nonce

  pubKey

  signature

  // internal state
  status

  get bytes() {
    return encodeTransaction(this.txParams)
  }

  get txParams() {
    return {
      version: 0,
      id: this.id,
      to: this.to,
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

  /**
   * isPending
   *
   * @returns {boolean}
   */
  isPending() {
    return this.status === TxStatus.Pending
  }

  /**
   * isInitialised
   *
   * @returns {boolean}
   */
  isInitialised() {
    return this.status === TxStatus.Initialised
  }

  /**
   * isConfirmed
   *
   * @returns {boolean}
   */
  isConfirmed() {
    return this.status === TxStatus.Confirmed
  }

  /**
   * isRejected
   *
   * @returns {boolean}
   */
  isRejected() {
    return this.status === TxStatus.Rejected
  }

  /**
   * confirmReceipt
   *
   * Similar to the Promise API. This sets the Transaction instance to a state
   * of pending. Calling this function kicks off a passive loop that polls the
   * lookup node for confirmation on the txHash.
   *
   * This is a low-level method that you should generally not have to use
   * directly.
   *
   * @param {string} txHash
   * @param {number} timeout
   * @returns {Promise<Transaction>}
   */
  confirm(txHash, timeout = 60000) {
    this.status = TxStatus.Pending

    return new Promise((resolve, reject) => {
      const token = setTimeout(() => {
        this.status = TxStatus.Rejected
        reject(
          new Error('The transaction is taking unusually long to be confirmed. It may be lost.')
        )
      }, timeout)

      const cancelTimeout = () => {
        clearTimeout(token)
      }

      this.trackTx(txHash, resolve, reject, cancelTimeout)
    })
  }

  /**
   * map
   *
   * maps over the transaction, allowing for manipulation.
   *
   * @param {(prev: TxParams) => TxParams} fn - mapper
   * @returns {Transaction}
   */
  map(fn) {
    const newParams = fn(this.txParams)
    this.setParams(newParams)

    return this
  }

  setParams(params) {
    this.version = params.version
    this.id = params.id
    this.to = params.to
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

  trackTx(txHash, resolve, reject, cancelTimeout) {
    if (this.isRejected()) {
      return
    }

    // TODO: regex validation for txHash so we don't get garbage
    const result = Transaction.messenger.send({ method: 'GetTransaction', params: [txHash] })

    result
      .then((res) => {
        if (res.result && res.result.error) {
          this.trackTx(txHash, resolve, reject, cancelTimeout)
          return
        }

        if (res.result) {
          this.id = res.result.ID
          this.receipt = res.result.receipt
          const isRecipt = this.receipt && this.receipt.success
          this.status = isRecipt ? TxStatus.Confirmed : TxStatus.Rejected
          cancelTimeout()
          resolve(this)
        }
      })
      .catch((err) => {
        cancelTimeout()
        this.status = TxStatus.Rejected
        reject(err)
      })
  }
}
export default Transaction
