import { generatePrivateKey } from '../../laksa-core-crypto/src'
import { toBN } from '../../laksa-utils/src'
import {
  createAccount,
  importAccount,
  encryptAccount,
  decryptAccount,
  signTransaction,
  ENCRYPTED
} from '../src'

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
      message: "Cannot read property 'address' of undefined"
    },
    {
      testArray: [{ address: '123', privateKey: '123', publicKey: '123' }, 'simplePassWord'],
      message: 'Validation failed for address,should be isAddress'
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
      expect(error.message).toEqual('private key is not correct')
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
      expect(error.message).toEqual('Validation failed for address,should be isAddress')
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
    const privateKey = '97d2d3a21d829800eeb01aa7f244926f993a1427d9ba79d9dc3bf14fe04d9e37'

    const account = importAccount(privateKey)

    const rawTx = {
      version: 1,
      nonce: 1,
      to: 'another_person',
      amount: toBN(888),
      pubKey: account.publicKey,
      gasPrice: 888,
      gasLimit: 888888,
      code: '',
      data: 'some_data'
    }

    const signed = signTransaction(account.privateKey, rawTx)

    expect(signed.signature).toEqual(
      '24767c0588e91291a560d158b9e05762feafb9e4b58540528058c65b8e0b3eb1652317594d6cbff5c5a3c00e91698fa667da5b5e1952d47157e137e757e48b32'
    )
  })
})
