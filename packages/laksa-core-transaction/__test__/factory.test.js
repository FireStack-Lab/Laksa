import { HttpProvider } from '../../laksa-providers-http/src'
import { BN, Long } from '../../laksa-utils/src'
import { Messenger } from '../../laksa-core-messenger/src'
import config from '../../laksa-core/src/config'

import { Transaction, Transactions } from '../src'

import { Wallet } from '../../laksa-wallet/src'

const provider = new HttpProvider('https://mock.com')
const messenger = new Messenger(provider, config)
const wallet = new Wallet(messenger)
const transactionFactory = new Transactions(messenger, wallet)

describe('TransactionFactory', () => {
  it('should be able to create a fresh tx', () => {
    const tx = transactionFactory.new({
      version: 0,
      amount: new BN(0),
      gasPrice: new BN(1),
      gasLimit: Long.fromNumber(100),
      toAddr: '0x88888888888888888888'
    })

    expect(tx).toBeInstanceOf(Transaction)
    expect(tx.isInitialised()).toBeTruthy()
  })
})
