import { encodeTransactionProto, getAddressFromPublicKey } from 'laksa-core-crypto'

const TxStatus = {
  Pending: Symbol('Pending'),
  Initialised: Symbol('Initialised'),
  Signed: Symbol('Signed'),
  Confirmed: Symbol('Confirmed'),
  Rejected: Symbol('Rejected')
}

class Transaction {
  constructor(params, messenger, status = TxStatus.Initialised) {
    // params
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
    // status
    this.status = status
    this.messenger = messenger
  }

  /**
   * confirmed
   *
   * constructs an already-confirmed transaction.
   *
   * @static
   * @param {BaseTx} params
   */
  static confirm(params, messenger) {
    return new Transaction(params, messenger, TxStatus.Confirmed)
  }

  /**
   * reject
   *
   * constructs an already-rejected transaction.
   *
   * @static
   * @param {BaseTx} params
   */
  static reject(params, messenger) {
    return new Transaction(params, messenger, TxStatus.Rejected)
  }

  setMessenger(messenger) {
    this.messenger = messenger
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

  get bytes() {
    return encodeTransactionProto(this.txParams)
  }

  get txParams() {
    return {
      version: 0,
      TranID: this.TranID,
      toAddr: this.toAddr,
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
   * isRejected
   *
   * @returns {boolean}
   */
  isSigned() {
    return this.status === TxStatus.Signed
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
   * If a transaction is sigend , can be sent and get TranID,
   * We set the This.TranID = TranID and return Transaction Object and response
   * @function {sendTxn}
   * @return {transaction:Promise<Transaction|Error>,response:Promise<Response>} {Transaction}
   */
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
        gasPrice: raw.gasPrice.toString()
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
        reject(new Error(`The transaction confirm failure after ${maxTry} tries.`))
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
    const result = this.messenger.send('GetTransaction', txHash)

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
            this.TranID = res.ID
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

export { TxStatus, Transaction }
