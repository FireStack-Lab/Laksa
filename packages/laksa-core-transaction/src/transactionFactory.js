import { Core } from 'laksa-shared'
import { Transaction } from './transaction'
import { TxStatus } from './util'

/**
 * @class Transactions
 */
class Transactions extends Core {
  constructor(messenger, signer) {
    super()
    this.messenger = messenger
    this.signer = signer
  }

  new(txParams, toDS = false) {
    return new Transaction(txParams, this.messenger, TxStatus.Initialised, toDS)
  }
}

export { Transactions }
