import { encodeTransaction } from './util'

export const TxStatus = {
  Pending: Symbol('Pending'),
  Initialised: Symbol('Initialised'),
  Confirmed: Symbol('Confirmed'),
  Rejected: Symbol('Rejected')
}

export class Transaction {
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

  /**
   * setStatus
   *
   * Escape hatch to imperatively set the state of the transaction.
   *
   * @param {TxStatus} status
   * @returns {undefined}
   */
  setStatus(status) {
    this.status = status
    return this
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
  confirm(txHash, maxTry = 10, poll = 3000) {
    this.status = TxStatus.Pending

    return new Promise((resolve, reject) => {
      const token = setTimeout(() => {
        this.status = TxStatus.Rejected
        reject(
          new Error('The transaction is taking unusually long to be confirmed. It may be lost.')
        )
      }, maxTry * poll * 2)

      const cancelTimeout = () => {
        clearTimeout(token)
      }

      this.trackTx(txHash, resolve, reject, {
        cancelTimeout,
        tried: 0,
        maxTry,
        poll
      })
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

  trackTx(txHash, resolve, reject, options) {
    const {
      cancelTimeout, tried, maxTry, poll
    } = options
    if (this.isRejected()) {
      return
    }
    function sleep(time) {
      return new Promise(res => setTimeout(res, time))
    }
    // TODO: regex validation for txHash so we don't get garbage
    const result = Transaction.messenger.send({ method: 'GetTransaction', params: [txHash] })

    const attemped = tried + 1

    if (attemped < (maxTry || 10)) {
      result
        .then(res => {
          if (res && res.error) {
            sleep(poll).then(() =>
              this.trackTx(txHash, resolve, reject, {
                ...options,
                tried: attemped
              }))
            return
          }

          if (res && !res.error) {
            this.id = res.ID
            this.receipt = res.receipt
            const isRecipt = this.receipt && this.receipt.success
            this.status = isRecipt ? TxStatus.Confirmed : TxStatus.Rejected
            cancelTimeout()
            resolve(this)
          }
        })
        .catch(err => {
          cancelTimeout()
          this.status = TxStatus.Rejected
          reject(err)
        })
    } else {
      cancelTimeout()
    }
  }
}
