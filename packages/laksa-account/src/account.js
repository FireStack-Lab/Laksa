import { sign } from 'laksa-core-crypto'

import { ENCRYPTED } from './symbols'
import {
  createAccount,
  importAccount,
  encryptAccount,
  decryptAccount,
  signTransaction
} from './utils'

export class Account {
  constructor(messenger) {
    this.messenger = messenger
    this.balance = '0'
    this.nonce = 0
  }

  /**
   * @function {createAccount}
   * @return {Account} {account object}
   */
  createAccount() {
    const accountObject = createAccount()
    const newObject = new Account(this.messenger)
    return Object.assign({}, accountObject, {
      balance: newObject.balance,
      nonce: newObject.nonce,
      messenger: newObject.messenger,
      getBalance: newObject.getBalance,
      encrypt: newObject.encrypt,
      decrypt: newObject.decrypt,
      toFile: newObject.toFile,
      fromFile: newObject.fromFile,
      sign: newObject.sign,
      signTransaction: newObject.signTransaction,
      signTransactionWithPassword: newObject.signTransactionWithPassword
    })
  }

  /**
   * @function {importAccount}
   * @param  {PrivateKey} privateKey {privatekey string}
   * @return {Account} {account object}
   */
  importAccount(privateKey) {
    const accountObject = importAccount(privateKey)
    const newObject = new Account(this.messenger)
    return Object.assign({}, accountObject, {
      balance: newObject.balance,
      nonce: newObject.nonce,
      messenger: newObject.messenger,
      getBalance: newObject.getBalance,
      encrypt: newObject.encrypt,
      decrypt: newObject.decrypt,
      toFile: newObject.toFile,
      fromFile: newObject.fromFile,
      sign: newObject.sign,
      signTransaction: newObject.signTransaction,
      signTransactionWithPassword: newObject.signTransactionWithPassword
    })
  }

  // sub object
  /**
   * @function {encrypt}
   * @param  {string} password {password string}
   * @param  {object} options  {options object for encryption}
   * @return {Account} {account object}
   */
  async encrypt(password, options = { level: 1024 }) {
    const encryptedAccount = await encryptAccount(this, password, options)
    return Object.assign(this, encryptedAccount)
  }

  // sub object
  /**
   * @function {decrypt}
   * @param  {string} password {password string}
   * @return {object} {account object}
   */
  async decrypt(password) {
    const that = this
    const decrypted = await decryptAccount(that, password)
    delete this.crypto
    return Object.assign(this, decrypted)
  }

  /**
   * @function {toFile}
   * @param  {string} password {description}
   * @param  {object} options  {description}
   * @return {string} {description}
   */
  async toFile(password, options = { level: 1024 }) {
    const {
      privateKey, address, id, index, crypto, version, publicKey
    } = this
    if (privateKey === ENCRYPTED) {
      return JSON.stringify({
        address,
        privateKey,
        publicKey,
        id,
        index,
        crypto,
        version
      })
    }
    const encrypted = await this.encrypt(password, options)
    return JSON.stringify({
      address: encrypted.address,
      privateKey: encrypted.privateKey,
      publicKey: encrypted.publicKey,
      id: encrypted.id,
      index: encrypted.index,
      crypto: encrypted.crypto,
      version: encrypted.version
    })
  }

  /**
   * @function {fromFile}
   * @param  {object} keyStore {description}
   * @param  {string} password {description}
   * @return {Account} {description}
   */
  async fromFile(keyStore, password) {
    const keyStoreObject = JSON.parse(keyStore)
    const decrypted = await decryptAccount(keyStoreObject, password)
    if (decrypted) {
      return this.importAccount(decrypted.privateKey)
    } else throw new Error('cannot import file')
  }

  /**
   * @function {sign} {sign method for Transaction bytes}
   * @param  {Buffer} bytes {Buffer that waited for sign}
   * @return {object} {signed transaction object}
   */
  sign(bytes) {
    if (this.privateKey === ENCRYPTED || this.privateKey === undefined) {
      throw new Error('This account is encrypted or not found, please decrypt it first')
    }
    return sign(bytes, this.privateKey, this.publicKey)
  }

  /**
   * @function {signTransaction} {sign plain object}
   * @param  {object} transactionObject {transaction object that prepared for sign}
   * @return {object} {signed transaction object}
   */
  async signTransaction(transactionObject) {
    if (this.privateKey === ENCRYPTED || this.privateKey === undefined) {
      throw new Error(
        'This account is encrypted, please decrypt it first or use "signTransactionWithPassword"'
      )
    }
    try {
      const { nonce } = await this.getBalance()
      return signTransaction(this.privateKey, { ...transactionObject, nonce: nonce + 1 })
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @function {signTransactionWithPassword} {sign plain object with password}
   * @param  {object} transactionObject {transaction object}
   * @param  {string} password          {password string}
   * @return {object} {signed transaction object}
   */
  async signTransactionWithPassword(transactionObject, password) {
    if (this.privateKey === ENCRYPTED || this.privateKey === undefined) {
      const decrypted = await this.decrypt(password)
      const { nonce } = await this.getBalance()
      const signed = signTransaction(decrypted.privateKey, {
        ...transactionObject,
        nonce: nonce + 1
      })
      const encryptAfterSign = await this.encrypt(password)
      Object.assign(this, encryptAfterSign)
      return signed
    } else {
      const { nonce } = await this.getBalance()
      const nonEncryptSigned = signTransaction(this.privateKey, {
        ...transactionObject,
        nonce: nonce + 1
      })
      Object.assign(this, nonEncryptSigned)
      return nonEncryptSigned
    }
  }

  async getBalance() {
    try {
      const balanceObject = await this.messenger.send({
        method: 'GetBalance',
        params: [this.address]
      })
      const { balance, nonce } = balanceObject
      if (nonce !== undefined) {
        Object.assign(this, { balance, nonce })
        return { balance, nonce }
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
