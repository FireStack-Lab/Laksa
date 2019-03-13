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

/**
 * @class
 * @param  {Messenger}  messenger - messsenger instance
 * @return {Account} {description}
 */
class Account extends Core {
  constructor(messenger) {
    super(messenger)
    delete this.signer
    /**
     * @var {String} privateKey
     * @memberof Account.prototype
     * @description privateKey of Account
     */
    this.privateKey = ''
    /**
     * @var {String} publicKey
     * @memberof Account.prototype
     * @description publicKey of Account
     */
    this.publicKey = ''
    /**
     * @var {String} address
     * @memberof Account.prototype
     * @description address of Account
     */
    this.address = ''
    /**
     * @var {String} balance
     * @memberof Account.prototype
     * @description balance of Account
     */
    this.balance = '0'
    /**
     * @var {Number} privateKey
     * @memberof Account.prototype
     * @description nonce of Account
     */
    this.nonce = 0
  }

  /**
   * @function createAccount
   * @description create new Account instance
   * @memberof Account
   * @return {Account} - create a new Account
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
   * @function importAccount
   * @description import private key string and return an Account instance
   * @memberof Account
   * @param  {String} privateKey - privatekey string
   * @return {Account} - create a new Account
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
   * @function encrypt
   * @memberof Account
   * @description encrypt an account providing password and encrypt options
   * @param  {String} password - password string
   * @param  {Object} options  - options object for encryption
   * @return {Promise<Account>} - encrypt an account
   */
  async encrypt(password, options = { level: 1024 }) {
    const encryptedAccount = await encryptAccount(this, password, options)
    return Object.assign(this, encryptedAccount)
  }

  // sub object
  /**
   * @function decrypt
   * @memberof Account
   * @description decrypt an account providing password
   * @param  {String} password - password string
   * @return {Promise<Object>} - account object
   */
  async decrypt(password) {
    const that = this
    const decrypted = await decryptAccount(that, password)
    delete this.crypto
    return Object.assign(this, decrypted)
  }

  /**
   * @function toFile
   * @memberof Account
   * @description encrypt an account and return as jsonString
   * @param  {String} password - password string
   * @param  {Object} options  - encryption options
   * @return {Promise<String>} - encrypted jsonString
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
   * @function fromFile
   * @memberof Account
   * @description Decrypt a keystore jsonString and generate an account.
   * @param  {String} keyStore - keystore jsonString
   * @param  {String} password - password string
   * @return {Promise<Account>} - Account
   */
  async fromFile(keyStore, password) {
    const keyStoreObject = JSON.parse(keyStore)
    const decrypted = await decryptAccount(keyStoreObject, password)
    if (decrypted) {
      return this.importAccount(decrypted.privateKey)
    } else throw new Error('cannot import file')
  }

  /**
   * @function signTransactionWithPassword
   * @memberof Account
   * @description  sign transaction object with password
   * @param  {Transaction} txnObj - transaction object
   * @param  {String} password  - password string
   * @return {Promise<Object>} - signed transaction object
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

  /**
   * @function getBalance
   * @memberof Account
   * @description  get balance of current Account
   * @return {Promise<Object>} - signed transaction object
   */
  async getBalance() {
    try {
      const balanceObject = await this.messenger.send('GetBalance', this.address)
      const { balance, nonce } = balanceObject
      if (isInt(nonce)) {
        return { balance, nonce }
      } else {
        throw new Error('can not get nonce')
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * @function updateBalance
   * @memberof Account
   * @description  update balance and nonce of current account
   * @return {Promise<Account>} - return current Account instance
   */
  async updateBalance() {
    try {
      const { balance, nonce } = await this.getBalance()
      this.balance = balance
      this.nonce = nonce
      return this
    } catch (error) {
      throw error
    }
  }
}

export { Account }
