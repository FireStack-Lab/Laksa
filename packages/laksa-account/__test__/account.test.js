import fetch from 'jest-fetch-mock'
import {
  Unit, Long, isAddress, isPrivateKey, isPubkey, BN
} from '../../laksa-utils/src'

import { Transactions } from '../../laksa-core-transaction/src'
import { HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
import { Wallet } from '../../laksa-wallet/src'
import config from '../../laksa-core/src/config'

import { generatePrivateKey, schnorr, Signature } from '../../laksa-core-crypto/src'
import { Account, ENCRYPTED } from '../src'

const provider = new HttpProvider('https://api.zilliqa.com')
const messenger = new Messenger(provider, config)
const wallet = new Wallet(messenger)

describe('test createAccount', () => {
  afterEach(() => {
    fetch.resetMocks()
  })
  it('should be able to generate an object with keys,address,and 5 functions', async () => {
    const account = new Account()
    const mock = account.createAccount()

    expect(isAddress(mock.address)).toBeTruthy()
    expect(isPrivateKey(mock.privateKey)).toBeTruthy()
    expect(isPubkey(mock.publicKey)).toBeTruthy()
  })
  it('should be able to import an private keys, then generate publicKey,address,and 5 functions', async () => {
    const account = new Account()
    const prvKey = generatePrivateKey()
    const normalAccount = account.importAccount(prvKey)

    expect(isAddress(normalAccount.address)).toBeTruthy()
    expect(isPrivateKey(normalAccount.privateKey)).toBeTruthy()
    expect(isPubkey(normalAccount.publicKey)).toBeTruthy()

    expect(() => account.importAccount(123)).toThrowError(/private key is not correct/)
    expect(() => account.importAccount()).toThrowError(/private key is not correct/)
  })
  it('should be able to encrypt the privateKey', async () => {
    const account = new Account().createAccount()
    try {
      const emptyEncrypted = await account.encrypt()
      return emptyEncrypted
    } catch (err) {
      expect(err.message).toEqual('password is not found')
    }

    const encrypted = await account.encrypt('Tim3sA1waysL4te')
    expect(encrypted.privateKey).toEqual(ENCRYPTED)
    try {
      const encrypted2x = await encrypted.encrypt('somethingelse')
      return encrypted2x
    } catch (err) {
      expect(err.message).toEqual('Validation failed for privateKey,should be isPrivateKey')
    }
  })

  it('should be able to decrypt the Encrypted Account', async () => {
    const account = new Account().createAccount()
    const beforeEncrypted = account.privateKey

    const encrypted = await account.encrypt('Tim3sA1waysL4te', { kdf: 'pbkdf2' })
    const afterDecrypted = await encrypted.decrypt('Tim3sA1waysL4te')

    expect(afterDecrypted.privateKey).toStrictEqual(beforeEncrypted)
  })
  it('should NOT be able to decrypt with wrong password', async () => {
    const account = new Account().createAccount()

    const encrypted = await account.encrypt('Tim3sA1waysL4te')
    try {
      const decrypted = await encrypted.decrypt('weak_password')
      return decrypted
    } catch (err) {
      expect(err.message).toEqual('Failed to decrypt.')
    }
    try {
      const decrypted = await encrypted.decrypt()
      return decrypted
    } catch (err) {
      expect(err.message).toEqual('password is not found')
    }
  })
  it('should be able to sign a transaction bytes', async () => {
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
          balance: 888,
          nonce: 1
        }
      }
    ].map(res => [JSON.stringify(res)])

    fetch.mockResponses(...responses)
    const account = new Account(messenger).createAccount()

    const rawTx = {
      version: 1,
      toAddr: '0x1111111111111111111111111111111111111111',
      amount: Unit.Zil(1000).toQa(),
      gasPrice: Unit.Li(10000).toQa(),
      gasLimit: Long.fromNumber(250000000)
    }

    const transactions = new Transactions(messenger, wallet)
    const tx = transactions.new(rawTx, messenger)
    const signedTxn = await account.signTransaction(tx)

    const lgtm = schnorr.verify(
      tx.bytes,
      new Signature({
        r: new BN(signedTxn.signature.slice(0, 64), 16),
        s: new BN(signedTxn.signature.slice(64), 16)
      }),
      Buffer.from(account.publicKey, 'hex')
    )

    expect(lgtm).toBeTruthy()

    try {
      const encrypted = await account.encrypt('EncrypMyAssest')
      await encrypted.signTransaction(tx)
    } catch (err) {
      expect(err.message).toEqual('password is not found')
    }
  })

  it('should be able to sign a transaction object with Encrypted privateKey', async () => {
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
          balance: 888,
          nonce: 1
        }
      }
    ].map(res => [JSON.stringify(res)])

    fetch.mockResponses(...responses)

    const account = new Account(messenger).createAccount()

    const rawTx = {
      version: 1,
      toAddr: '0x1111111111111111111111111111111111111111',
      amount: Unit.Zil(1000).toQa(),
      gasPrice: Unit.Li(10000).toQa(),
      gasLimit: Long.fromNumber(250000000)
    }

    const transactions = new Transactions(messenger, wallet)
    const tx = transactions.new(rawTx, messenger)
    await account.encrypt('EncrypMyAssest')
    const signedTxn = await account.signTransaction(tx, 'EncrypMyAssest')
    // expect(signedTxn.signature).toEqual('111')
    const lgtm = schnorr.verify(
      tx.bytes,
      new Signature({
        r: new BN(signedTxn.signature.slice(0, 64), 16),
        s: new BN(signedTxn.signature.slice(64), 16)
      }),
      Buffer.from(account.publicKey, 'hex')
    )

    expect(lgtm).toBeTruthy()
  })
  it('should import account while crypto object is existed', async () => {
    const acc = new Account()

    const bcc = acc.createAccount()
    const prv = bcc.privateKey
    await bcc.encrypt('111')
    const imported = bcc.importAccount(prv)
    expect(imported.privateKey).toEqual(prv)
  })
})
