import fetch from 'jest-fetch-mock'

import { Transaction } from '../src/transaction'
import { TxStatus } from '../src/util'
import { BN, Long } from '../../laksa-utils/src'
import { randomBytes, isValidChecksumAddress } from '../../laksa-core-crypto/src'
import { Wallet } from '../../laksa-wallet/src'
import { HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
import config from '../../laksa-core/src/config'

const provider = new HttpProvider('https://mock.com')
const messenger = new Messenger(provider, config)
const wallet = new Wallet(messenger)

describe('Transaction', () => {
  wallet.createBatchAccounts(10)
  beforeEach(() => {
    // jest.useFakeTimers()
  })
  afterEach(() => {
    fetch.resetMocks()
    // jest.clearAllTimers()
  })
  it('should return a checksummed address from txParams', () => {
    const tx = new Transaction(
      {
        version: 0,
        toAddr: `0x${randomBytes(20)}`,
        amount: new BN(0),
        gasPrice: new BN(1000),
        gasLimit: Long.fromNumber(1000)
      },
      messenger
    )

    // FIXME: remove 0x when this is fixed on the core side
    expect(isValidChecksumAddress(`${tx.txParams.toAddr}`)).toBe(true)
  })
  it('should poll and call queued handlers on confirmation', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: 888,
          nonce: 1
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          TranID: 'some_hash',
          Info: 'Non-contract txn, sent to shard'
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          ID: 'some_hash',
          receipt: { cumulative_gas: '1000', success: true }
        }
      }
    ].map(res => [JSON.stringify(res)])

    fetch.mockResponses(...responses)
    wallet.setSigner(wallet.getAccountByIndex(0))

    const newTxn = new Transaction(
      {
        version: 0,
        toAddr: '0x1234567890123456789012345678901234567890',
        amount: new BN(0),
        gasPrice: new BN(1000),
        gasLimit: Long.fromNumber(1000)
      },
      messenger
    )
    const pending = await wallet.signer.signTransaction(newTxn)

    await messenger.send('CreateTransaction', pending.txParams)
    const confirmed = await pending.confirm('some_hash')
    const state = confirmed.txParams

    expect(confirmed.isConfirmed()).toBeTruthy()
    expect(state.receipt).toEqual({ success: true, cumulative_gas: '1000' })
  })
  it('should reject the promise if there is a network error', async () => {
    fetch
      .once(
        JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          result: {
            balance: 888,
            nonce: 1
          }
        })
      )
      .mockRejectOnce(new Error('something bad happened'))

    const tx = await wallet.signer.signTransaction(
      new Transaction(
        {
          version: 0,
          toAddr: '0x1234567890123456789012345678901234567890',
          amount: new BN(0),
          gasPrice: new BN(1000),
          gasLimit: Long.fromNumber(1000)
        },
        messenger
      )
    )

    await expect(messenger.send('CreateTransaction', tx.txParams)).rejects.toThrow()
  })
  it('should not reject the promise if receipt.success === false', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: 888,
          nonce: 1
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          TranID: 'some_hash',
          Info: 'Non-contract txn, sent to shard'
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          ID: 'some_hash',
          receipt: { cumulative_gas: '1000', success: false }
        }
      }
    ].map(res => [JSON.stringify(res)])

    fetch.mockResponses(...responses)

    const tx = await wallet.signer.signTransaction(
      new Transaction(
        {
          version: 0,
          toAddr: '0x1234567890123456789012345678901234567890',
          amount: new BN(0),
          gasPrice: new BN(1000),
          gasLimit: Long.fromNumber(1000)
        },
        messenger
      )
    )

    const res = await messenger.send('CreateTransaction', tx.txParams)
    const rejected = await tx.confirm(res.TranID)

    await expect(rejected.txParams.receipt && rejected.txParams.receipt.success).toEqual(false)
    const newRejected = Transaction.reject(
      { ...rejected.txParams, status: TxStatus.Rejected },
      messenger
    )
    expect(newRejected.isRejected()).toBeTruthy()
  })
  it('should try for n attempts before timing out', async () => {
    const attempts = 1
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: 888,
          nonce: 1
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          TranID: 'some_hash',
          Info: 'Non-contract txn, sent to shard'
        }
      },
      ...(() => {
        const mocks = []

        for (let i = 0; i < attempts; i += 1) {
          mocks.push({
            id: 1,
            jsonrpc: '2.0',
            error: {
              code: -888,
              message: 'Not found'
            }
          })
        }

        return mocks
      })(),
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          ID: 'some_hash',
          receipt: { cumulative_gas: '1000', success: true }
        }
      }
    ].map(res => [JSON.stringify(res)])

    fetch.mockResponses(...responses)
    const txn = new Transaction(
      {
        version: 0,
        toAddr: '0x1234567890123456789012345678901234567890',
        amount: new BN(0),
        gasPrice: new BN(1000),
        gasLimit: Long.fromNumber(1000)
      },
      messenger
    )
    txn.setMessenger(messenger)

    const pending = await wallet.signer.signTransaction(txn)

    const { transaction, response } = await pending.sendTransaction()
    expect(pending.isPending()).toBeTruthy()

    try {
      await transaction.confirm(response.TranID, attempts, 0)
      expect(transaction.isRejected()).toBeTruthy()
    } catch (error) {
      expect(error.message).toEqual(
        `The transaction is still not confirmed after ${attempts} attempts.`
      )
    }
    const result = await messenger.send('GetTransaction', response.TranID)
    pending.setStatus(TxStatus.Confirmed)
    expect(pending.isConfirmed()).toBeTruthy()
    expect(result.receipt.success).toBeTruthy()
    const newConfirmed = Transaction.confirm(pending.txParams, messenger)
    expect(newConfirmed.isConfirmed()).toBeTruthy()
  })
  it('should test getSenderAddress', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: 888,
          nonce: 1
        }
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)
    const txn = new Transaction(
      {
        version: 0,
        toAddr: '0x1234567890123456789012345678901234567890',
        amount: new BN(0),
        gasPrice: new BN(1000),
        gasLimit: Long.fromNumber(1000)
      },
      messenger
    )
    expect(typeof txn.bytes.toString('hex')).toEqual('string')
    expect(txn.isInitialised()).toBeTruthy()
    expect(txn.senderAddress).toEqual('0'.repeat(40))

    const pending = await wallet.signer.signTransaction(txn)

    pending.setStatus(TxStatus.Signed)
    expect(pending.isSigned()).toBeTruthy()

    expect(pending.senderAddress).toEqual(wallet.signer.address)

    pending.setStatus(TxStatus.Initialised)
    expect(pending.isInitialised()).toBeTruthy()
  })
})
