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
  }

  /**
   * @function {createAccount}
   * @return {Account} {account object}
   */
  createAccount() {
    const accountObject = createAccount()
    const newObject = new Account()
    return Object.assign({}, accountObject, {
      encrypt: newObject.encrypt,
      decrypt: newObject.decrypt,
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
    const newObject = new Account()
    return Object.assign({}, accountObject, {
      encrypt: newObject.encrypt,
      decrypt: newObject.decrypt,
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
   * @function {sign} {sign method for Transaction bytes}
   * @param  {Buffer} bytes {Buffer that waited for sign}
   * @return {object} {signed transaction object}
   */
  sign(bytes) {
    if (this.privateKey === ENCRYPTED) {
      throw new Error('This account is encrypted, please decrypt it first')
    }
    return sign(bytes, this.privateKey, this.publicKey)
  }

  /**
   * @function {signTransaction} {sign plain object}
   * @param  {object} transactionObject {transaction object that prepared for sign}
   * @return {object} {signed transaction object}
   */
  signTransaction(transactionObject) {
    if (this.privateKey === ENCRYPTED) {
      throw new Error(
        'This account is encrypted, please decrypt it first or use "signTransactionWithPassword"'
      )
    }
    return signTransaction(this.privateKey, transactionObject)
  }

  /**
   * @function {signTransactionWithPassword} {sign plain object with password}
   * @param  {object} transactionObject {transaction object}
   * @param  {string} password          {password string}
   * @return {object} {signed transaction object}
   */
  async signTransactionWithPassword(transactionObject, password) {
    if (this.privateKey === ENCRYPTED) {
      const decrypted = await this.decrypt(password)
      const signed = signTransaction(decrypted.privateKey, transactionObject)
      const encryptAfterSign = await this.encrypt(password)
      Object.assign(this, encryptAfterSign)
      return signed
    } else {
      const nonEncryptSigned = signTransaction(this.privateKey, transactionObject)
      Object.assign(this, nonEncryptSigned)
      return nonEncryptSigned
    }
  }
}
