import { Core } from 'laksa-shared'
import { Transaction } from './transaction'

export class Transactions extends Core {
  constructor(messenger, signer) {
    super()
    this.messenger = messenger
    this.signer = signer
  }

  new(txParams) {
    return new Transaction(txParams, this.messenger)
  }
}
