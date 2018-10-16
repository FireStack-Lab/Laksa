import { toBN } from '../../laksa-utils/src'
import Transaction from '../../laksa-core-transaction/src'
import { generatePrivateKey, schnorr } from '../../laksa-core-crypto/src'
import { Account, ENCRYPTED } from '../src'

describe('test createAccount', () => {
  it('should be able to generate an object with keys,address,and 5 functions', async () => {
    const account = new Account()
    const mock = account.createAccount()

    expect(mock).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        privateKey: expect.any(String),
        publicKey: expect.any(String),
        decrypt: expect.any(Function),
        encrypt: expect.any(Function),
        sign: expect.any(Function),
        signTransaction: expect.any(Function),
        signTransactionWithPassword: expect.any(Function)
      })
    )
  })
  it('should be able to import an private keys, then generate publicKey,address,and 5 functions', async () => {
    const account = new Account()
    const prvKey = generatePrivateKey()
    const normalAccount = account.importAccount(prvKey)

    expect(normalAccount).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        privateKey: expect.any(String),
        publicKey: expect.any(String),
        decrypt: expect.any(Function),
        encrypt: expect.any(Function),
        sign: expect.any(Function),
        signTransaction: expect.any(Function),
        signTransactionWithPassword: expect.any(Function)
      })
    )

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
      expect(err.message).toEqual('Cannot convert a Symbol value to a string')
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
    const privateKey = generatePrivateKey()
    const account = new Account().importAccount(privateKey)

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
    const { Signature } = schnorr
    const tx = new Transaction(rawTx)
    const rawSignature = account.sign(tx.bytes)

    const lgtm = schnorr.verify(
      tx.bytes,
      new Signature({
        r: toBN(rawSignature.slice(0, 64), 16),
        s: toBN(rawSignature.slice(64), 16)
      }),
      Buffer.from(account.publicKey, 'hex')
    )

    expect(lgtm).toBeTruthy()

    try {
      const encrypted = await account.encrypt('EncrypMyAssest')
      const nothingSigned = encrypted.sign(rawTx)
      return nothingSigned
    } catch (err) {
      expect(err.message).toEqual('This account is encrypted, please decrypt it first')
    }
  })
  it('should be able to sign a transaction object', () => {
    const privateKey = '97d2d3a21d829800eeb01aa7f244926f993a1427d9ba79d9dc3bf14fe04d9e37'

    const account = new Account().importAccount(privateKey)

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

    const signed = account.signTransaction(rawTx)

    expect(signed.signature).toEqual(
      '24767c0588e91291a560d158b9e05762feafb9e4b58540528058c65b8e0b3eb1652317594d6cbff5c5a3c00e91698fa667da5b5e1952d47157e137e757e48b32'
    )
  })
  it('should be able to sign a transaction object with Encrypted privateKey', async () => {
    const privateKey = '97d2d3a21d829800eeb01aa7f244926f993a1427d9ba79d9dc3bf14fe04d9e37'

    const account = new Account().importAccount(privateKey)
    const nonEncryptedAccount = new Account().importAccount(privateKey)
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

    const encrypted = await account.encrypt('my4wes0me p6ssw04d')
    try {
      const nothingSigned = account.signTransaction(rawTx)
      return nothingSigned
    } catch (err) {
      expect(err.message).toEqual(
        'This account is encrypted, please decrypt it first or use "signTransactionWithPassword"'
      )
    }

    const signedWithPsw = await encrypted.signTransactionWithPassword(rawTx, 'my4wes0me p6ssw04d')
    const signedWithPswButNotEncrypted = await nonEncryptedAccount.signTransactionWithPassword(
      rawTx,
      'my4wes0me p6ssw04d'
    )
    expect(signedWithPsw.signature).toEqual(
      '24767c0588e91291a560d158b9e05762feafb9e4b58540528058c65b8e0b3eb1652317594d6cbff5c5a3c00e91698fa667da5b5e1952d47157e137e757e48b32'
    )
    expect(encrypted.privateKey).toEqual(ENCRYPTED)

    expect(signedWithPswButNotEncrypted.signature).toEqual(
      '24767c0588e91291a560d158b9e05762feafb9e4b58540528058c65b8e0b3eb1652317594d6cbff5c5a3c00e91698fa667da5b5e1952d47157e137e757e48b32'
    )
  })
})
