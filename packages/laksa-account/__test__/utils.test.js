import { generatePrivateKey } from '../../laksa-core-crypto/src'
import { Unit, Long } from '../../laksa-utils/src'
import {
  createAccount,
  importAccount,
  encryptAccount,
  decryptAccount,
  signTransaction,
  ENCRYPTED
} from '../src'
import { Transactions } from '../../laksa-core-transaction/src'
import { HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
import { Wallet } from '../../laksa-wallet/src'
import config from '../../laksa-core/src/config'

const provider = new HttpProvider('https://api.zilliqa.com')
const messenger = new Messenger(provider, config)
const wallet = new Wallet(messenger)

describe('test createAccount', () => {
  const instantMock = createAccount()
  const testWrongArray = [
    {
      testArray: [instantMock],
      message: 'password is not found'
    },
    {
      testArray: [instantMock, 1],
      message: 'password is not found'
    },
    {
      testArray: [],
      message: "Cannot read property 'privateKey' of undefined"
    },
    {
      testArray: [{ address: '123', privateKey: '123', publicKey: '123' }, 'simplePassWord'],
      message: 'Validation failed for privateKey,should be isPrivateKey'
    },
    {
      testArray: [
        { address: instantMock.address, privateKey: '123', publicKey: '123' },
        'simplePassWord'
      ],
      message: 'Validation failed for privateKey,should be isPrivateKey'
    },
    {
      testArray: [
        { address: instantMock.address, privateKey: instantMock.privateKey, publicKey: '123' },
        'simplePassWord'
      ],
      message: 'Validation failed for publicKey,should be isPubkey'
    }
  ]
  it('should be able to generate an object with keys,address,and 5 functions', async () => {
    expect(instantMock).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        privateKey: expect.any(String),
        publicKey: expect.any(String)
      })
    )
  })
  it('should be able to import and generate an object with keys,address,and 5 functions', async () => {
    const privateKey = generatePrivateKey()
    const importedMock = importAccount(privateKey)
    try {
      return importAccount()
    } catch (error) {
      expect(error.message).toEqual('private key is not correct:undefined')
    }
    expect(importedMock).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        privateKey: expect.any(String),
        publicKey: expect.any(String)
      })
    )
  })
  it('should be able to encrypt account', async () => {
    const encrypted = await encryptAccount(instantMock, 'simplePassword')
    expect(encrypted.privateKey).toEqual(ENCRYPTED)

    testWrongArray.forEach(async t => {
      try {
        const encryptedWrong = await encryptAccount(t.testArray[0], t.testArray[1])
        return encryptedWrong
      } catch (error) {
        expect(error.message).toEqual(t.message)
      }
    })
  })
  it('should be able to decrypt account', async () => {
    const encryptedMock = await encryptAccount(instantMock, 'simplePassWord')
    const decrtypedMock = await decryptAccount(encryptedMock, 'simplePassWord')
    expect(decrtypedMock.privateKey).toEqual(instantMock.privateKey)
    try {
      const decryptedWrong = await decryptAccount(encryptedMock, 'wrongPassWord')
      return decryptedWrong
    } catch (error) {
      expect(error.message).toEqual('Failed to decrypt.')
    }
    try {
      const decryptedEmpty = await decryptAccount(encryptedMock)
      return decryptedEmpty
    } catch (error) {
      expect(error.message).toEqual('password is not found')
    }
    try {
      const decryptedNotString = await decryptAccount(encryptedMock, 1)
      return decryptedNotString
    } catch (error) {
      expect(error.message).toEqual('password is not found')
    }
    try {
      const decryptedWrongAccount = await decryptAccount(
        {
          address: '',
          publicKey: '',
          crypto: ''
        },
        'simplePassWord'
      )
      return decryptedWrongAccount
    } catch (error) {
      expect(error.message).toEqual('Validation failed for crypto,should be isObject')
    }
    try {
      const decryptedWrongAccount = await decryptAccount(
        {
          address: encryptedMock.address,
          publicKey: '',
          crypto: ''
        },
        'simplePassWord'
      )
      return decryptedWrongAccount
    } catch (error) {
      expect(error.message).toEqual('Validation failed for crypto,should be isObject')
    }
    try {
      const decryptedWrongAccount = await decryptAccount(
        {
          address: encryptedMock.address,
          publicKey: '',
          crypto: encryptedMock.crypto
        },
        'simplePassWord'
      )
      return decryptedWrongAccount
    } catch (error) {
      expect(error.message).toEqual('Validation failed for publicKey,should be isPubkey')
    }
  })
  it('should be able to sign transaction', async () => {
    const privateKey = 'e19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930'
    const account = importAccount(privateKey)

    const rawTx = {
      version: 1,
      toAddr: '2E3C9B415B19AE4035503A06192A0FAD76E04243',
      amount: Unit.Zil(1000).toQa(),
      gasPrice: Unit.Li(10000).toQa(),
      gasLimit: Long.fromNumber(250000000)
    }

    const transactions = new Transactions(messenger, wallet)
    const tx = transactions.new(rawTx, messenger)
    tx.nonce += 1
    const signed = signTransaction(account.privateKey, tx)

    expect(signed.signature.length).toEqual(128)
  })
})
