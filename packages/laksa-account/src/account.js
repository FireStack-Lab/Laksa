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

  // prototype.createAccount
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

  // prototype.importAccount
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
  async encrypt(password, options = { level: 1024 }) {
    const encryptedAccount = await encryptAccount(this, password, options)
    return Object.assign(this, encryptedAccount)
  }

  // sub object
  async decrypt(password) {
    const that = this
    const decrypted = await decryptAccount(that, password)
    delete this.crypto
    return Object.assign(this, decrypted)
  }

  // sign method for Transaction bytes
  sign(bytes) {
    if (this.privateKey === ENCRYPTED) {
      throw new Error('This account is encrypted, please decrypt it first')
    }
    return sign(bytes, this.privateKey, this.publicKey)
  }

  // sign plain object
  signTransaction(transactionObject) {
    if (this.privateKey === ENCRYPTED) {
      throw new Error(
        'This account is encrypted, please decrypt it first or use "signTransactionWithPassword"'
      )
    }
    return signTransaction(this.privateKey, transactionObject)
  }

  // sign plain object with password
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
