import { sign } from 'laksa-core-crypto'
import { Core } from 'laksa-shared'
import { isInt } from 'laksa-utils'
import { ENCRYPTED } from './symbols'
import {
  createAccount,
  importAccount,
  encryptAccount,
  decryptAccount,
  signTransaction
} from './utils'

export class Account extends Core {
  constructor(messenger) {
    super(messenger)
    delete this.signer
    this.privateKey = ''
    this.publicKey = ''
    this.address = ''
    this.balance = '0'
    this.nonce = 0
  }

  /**
   * @function {createAccount}
   * @return {Account} {account object}
   */
  createAccount() {
    const accountObject = createAccount()
    const { privateKey, publicKey, address } = accountObject
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.address = address
    return this
  }

  /**
   * @function {importAccount}
   * @param  {PrivateKey} privateKey {privatekey string}
   * @return {Account} {account object}
   */
  importAccount(privateKey) {
    const accountObject = importAccount(privateKey)
    const { publicKey, address } = accountObject
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.address = address
    if (this.crypto) delete this.crypto
    return this
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
  async sign(bytes, password) {
    try {
      if (this.privateKey === ENCRYPTED) {
        await this.decrypt(password)
        const result = sign(bytes, this.privateKey, this.publicKey)
        await this.encrypt(password)
        return result
      } else {
        return sign(bytes, this.privateKey, this.publicKey)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @function {signTransactionWithPassword} {sign plain object with password}
   * @param  {Transaction} txnObj {transaction object}
   * @param  {string} password          {password string}
   * @return {object} {signed transaction object}
   */
  async signTransaction(txnObj, password) {
    if (this.privateKey === ENCRYPTED) {
      await this.decrypt(password)
      await this.updateBalance()
      const signed = signTransaction(this.privateKey, {
        ...txnObj.txParams,
        nonce: this.nonce + 1
      })
      await this.encrypt(password)
      return txnObj.map(obj => {
        return { ...obj, ...signed }
      })
    } else {
      await this.updateBalance()
      const nonEncryptSigned = signTransaction(this.privateKey, {
        ...txnObj.txParams,
        nonce: this.nonce + 1
      })
      return txnObj.map(obj => {
        return { ...obj, ...nonEncryptSigned }
      })
    }
  }

  async getBalance() {
    try {
      const balanceObject = await this.messenger.send({
        method: 'GetBalance',
        params: [this.address]
      })
      const { balance, nonce } = balanceObject
      if (isInt(nonce)) {
        return { balance, nonce }
      } else {
        throw new Error('can not get nonce')
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateBalance() {
    try {
      const { balance, nonce } = await this.getBalance()
      this.balance = balance
      this.nonce = nonce
      return this
    } catch (error) {
      throw new Error(error)
    }
  }
}
