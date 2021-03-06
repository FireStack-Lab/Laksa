import {
  isAddress, isNumber, isObject, isArray, isString
} from 'laksa-utils'
import { Map, List } from 'immutable'
import bip39 from 'bip39'
import hdkey from 'hdkey'
import * as account from 'laksa-account'
import { encryptedBy } from './symbols'

// let this.#_accounts = Map({ accounts: List([]) })

class Wallet {
  defaultAccount

  #_accounts = Map({ accounts: List([]) })

  constructor(messenger) {
    this.length = 0
    this.messenger = messenger
    this.signer = this.defaultAccount || undefined
  }

  get accounts() {
    return this.#_accounts.get('accounts').toArray()
  }

  set accounts(value) {
    if (value !== undefined) {
      throw new Error('you should not set "accounts" directly, use internal functions')
    }
  }

  generateMnemonic() {
    return bip39.generateMnemonic()
  }

  importAccountFromMnemonic(phrase, index) {
    if (!this.isValidMnemonic(phrase)) {
      throw new Error(`Invalid mnemonic phrase: ${phrase}`)
    }
    const seed = bip39.mnemonicToSeed(phrase)
    const hdKey = hdkey.fromMasterSeed(seed)
    const childKey = hdKey.derive(`m/44'/313'/0'/0/${index}`)
    const privateKey = childKey.privateKey.toString('hex')
    return this.importAccountFromPrivateKey(privateKey)
  }

  isValidMnemonic(phrase) {
    if (phrase.trim().split(/\s+/g).length < 12) {
      return false
    }
    return bip39.validateMnemonic(phrase)
  }

  defaultSetSigner() {
    if (this.getWalletAccounts().length === 1 && this.signer === undefined) {
      this.setSigner(this.getWalletAccounts()[0])
    }
  }

  /**
   * @function {updateLength}
   * @return {number} {wallet account counts}
   */
  updateLength() {
    this.length = this.getIndexKeys().length
  }

  /**
   * @function {getIndexKeys}
   * @return {Array<string>} {index keys to the wallet}
   */
  getIndexKeys() {
    const isCorrectKeys = n => /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20
    const arrays = this.#_accounts.get('accounts').toArray()
    return Object.keys(arrays).filter(isCorrectKeys)
  }

  /**
   * @function {getCurrentMaxIndex}
   * @return {number} {max index to the wallet}
   */
  getCurrentMaxIndex() {
    const diff = (a, b) => {
      return b - a
    }
    // const sorted = R.sort(diff, keyList)
    const sorted = this.getIndexKeys().sort(diff)
    return sorted[0] === undefined ? -1 : parseInt(sorted[0], 10)
  }

  /**
   * @function {addAccount}
   * @param  {Account} accountObject {account object}
   * @return {Account} {account object}
   */
  addAccount(accountObject) {
    if (!isObject(accountObject)) throw new Error('account Object is not correct')
    if (this.getAccountByAddress(accountObject.address)) return false
    const newAccountObject = accountObject
    newAccountObject.createTime = new Date()
    newAccountObject.index = this.getCurrentMaxIndex() + 1
    const objectKey = newAccountObject.address
    const newIndex = newAccountObject.index
    let newArrays = this.#_accounts.get('accounts')
    newArrays = newArrays.set(newIndex, objectKey)
    this.#_accounts = this.#_accounts.set(objectKey, newAccountObject)
    this.#_accounts = this.#_accounts.set('accounts', List(newArrays))
    // this.#_accounts = this.#_accounts.concat(newArrays)
    this.updateLength()
    this.defaultSetSigner()
    return newAccountObject
  }

  /**
   * @function {createAccount}
   * @return {Account} {account object}
   */
  createAccount = () => {
    const accountInstance = new account.Account(this.messenger)
    const accountObject = accountInstance.createAccount()
    return this.addAccount(accountObject)
  }

  /**
   * @function {createBatchAccounts}
   * @param  {number} number {number of accounts you wanna create}
   * @return {Array<Account>} {created accounts}
   */
  createBatchAccounts = number => {
    if (!isNumber(number) || (isNumber(number) && number === 0)) throw new Error('number has to be >0 Number')
    const Batch = []
    for (let i = 0; i < number; i += 1) {
      Batch.push(this.createAccount())
    }
    return Batch
  }

  /**
   * @function {exportAccountByAddress}
   * @param  {Address} address  {description}
   * @param  {string} password {description}
   * @param  {object<T>} options  {description}
   * @return {string|boolean} {description}
   */
  exportAccountByAddress = async (address, password, options = { level: 1024 }) => {
    const accountToExport = this.getAccountByAddress(address)
    if (accountToExport) {
      const result = await accountToExport.toFile(password, options)
      return result
    } else {
      return false
    }
  }

  /**
   * @function {importAccountFromPrivateKey}
   * @param  {PrivateKey} privateKey {privatekey string}
   * @return {Account} {account object}
   */
  importAccountFromPrivateKey = privateKey => {
    const accountInstance = new account.Account(this.messenger)
    const accountObject = accountInstance.importAccount(privateKey)
    return this.addAccount(accountObject)
  }

  /**
   * @function {importAccountFromKeyStore}
   * @param  {string} keyStore {description}
   * @param  {password} password {description}
   * @return {Account} {description}
   */
  importAccountFromKeyStore = async (keyStore, password) => {
    const accountInstance = new account.Account(this.messenger)
    const accountObject = await accountInstance.fromFile(keyStore, password)
    return this.addAccount(accountObject)
  }

  /**
   * @function {importAccountsFromPrivateKeyList}
   * @param  {Array<PrivateKey>} privateKeyList {list of private keys}
   * @return {Array<Account>} {array of accounts}
   */
  importAccountsFromPrivateKeyList(privateKeyList) {
    if (!isArray(privateKeyList)) throw new Error('privateKeyList has to be Array<String>')
    const Imported = []
    for (let i = 0; i < privateKeyList.length; i += 1) {
      Imported.push(this.importAccountFromPrivateKey(privateKeyList[i]))
    }
    return Imported
  }

  //-------
  /**
   * @function {removeOneAccountByAddress}
   * @param  {Address} address {account address}
   * @return {undefined} {}
   */
  removeOneAccountByAddress = address => {
    if (!isAddress(address)) throw new Error('address is not correct')
    const addressRef = this.getAccountByAddress(address)
    if (addressRef !== undefined) {
      const currentArray = this.#_accounts.get('accounts').toArray()
      delete currentArray[addressRef.index]
      if (this.signer !== undefined && addressRef.address === this.signer.address) {
        this.signer = undefined
        this.defaultAccount = undefined
      }
      this.#_accounts = this.#_accounts.set('accounts', List(currentArray))
      this.#_accounts = this.#_accounts.delete(address)
      this.updateLength()
    }
    this.updateLength()
  }

  /**
   * @function {removeOneAccountByIndex}
   * @param  {number} index {index of account}
   * @return {undefined} {}
   */
  removeOneAccountByIndex(index) {
    if (!isNumber(index)) throw new Error('index is not correct')
    const addressRef = this.getAccountByIndex(index)
    if (addressRef !== undefined && addressRef.address) {
      this.removeOneAccountByAddress(addressRef.address)
    }
  }

  //---------
  /**
   * @function {getAccountByAddress}
   * @param  {Address} address {account address}
   * @return {Account} {account object}
   */
  getAccountByAddress = address => {
    if (!isAddress(address)) throw new Error('address is not correct')
    return this.#_accounts.get(address)
  }

  /**
   * @function {getAccountByIndex}
   * @param  {number} index {index of account}
   * @return {Account} {account object}
   */
  getAccountByIndex = index => {
    if (!isNumber(index)) throw new Error('index is not correct')
    const address = this.#_accounts.get('accounts').get(index)
    if (address !== undefined) {
      return this.getAccountByAddress(address)
    } else return undefined
  }

  /**
   * @function {getWalletAddresses}
   * @return {Array<Address>} {array of address}
   */
  getWalletAddresses() {
    return this.getIndexKeys()
      .map(index => {
        const accountFound = this.getAccountByIndex(parseInt(index, 10))
        if (accountFound) {
          return accountFound.address
        }
        return false
      })
      .filter(d => !!d)
  }

  /**
   * @function {getWalletPublicKeys}
   * @return {Array<PublicKey>} {array of public Key}
   */
  getWalletPublicKeys() {
    return this.getIndexKeys()
      .map(index => {
        const accountFound = this.getAccountByIndex(parseInt(index, 10))
        if (accountFound) {
          return accountFound.publicKey
        }
        return false
      })
      .filter(d => !!d)
  }

  /**
   * @function {getWalletPrivateKeys}
   * @return {Array<PrivateKey>} {array of private key}
   */
  getWalletPrivateKeys() {
    return this.getIndexKeys()
      .map(index => {
        const accountFound = this.getAccountByIndex(parseInt(index, 10))
        if (accountFound) {
          return accountFound.privateKey
        }
        return false
      })
      .filter(d => !!d)
  }

  /**
   * @function getWalletAccounts
   * @return {Array<Account>} {array of account}
   */
  getWalletAccounts = () => {
    return this.getIndexKeys()
      .map(index => {
        const accountFound = this.getAccountByIndex(parseInt(index, 10))
        return accountFound || false
      })
      .filter(d => !!d)
  }

  // -----------
  /**
   * @function {updateAccountByAddress}
   * @param  {Address} address   {account address}
   * @param  {Account} newObject {account object to be updated}
   * @return {boolean} {is successful}
   */
  updateAccountByAddress(address, newObject) {
    if (!isAddress(address)) throw new Error('address is not correct')
    if (!isObject(newObject)) throw new Error('new account Object is not correct')
    const newAccountObject = newObject
    newAccountObject.updateTime = new Date()
    this.#_accounts = this.#_accounts.update(address, () => newAccountObject)
    return true
  }

  // -----------
  /**
   * @function {cleanAllAccountsw}
   * @return {boolean} {is successful}
   */
  cleanAllAccounts = () => {
    this.getIndexKeys().forEach(index => this.removeOneAccountByIndex(parseInt(index, 10)))
    return true
  }

  // -----------
  /**
   * @function {encryptAllAccounts}
   * @param  {string} password {password}
   * @param  {object} options  {encryption options}
   * @return {type} {description}
   */
  async encryptAllAccounts(password, options) {
    const keys = this.getIndexKeys()
    const results = []
    for (const index of keys) {
      const accountObject = this.getAccountByIndex(parseInt(index, 10))
      if (accountObject) {
        const { address } = accountObject
        const things = this.encryptAccountByAddress(address, password, options, encryptedBy.WALLET)
        results.push(things)
      }
    }
    await Promise.all(results)
  }

  /**
   * @function {decryptAllAccounts}
   * @param  {string} password {decrypt password}
   * @return {type} {description}
   */
  async decryptAllAccounts(password) {
    const keys = this.getIndexKeys()
    const results = []
    for (const index of keys) {
      const accountObject = this.getAccountByIndex(parseInt(index, 10))
      if (accountObject) {
        const { address, LastEncryptedBy } = accountObject
        if (LastEncryptedBy === encryptedBy.WALLET) {
          const things = this.decryptAccountByAddress(address, password, encryptedBy.WALLET)
          results.push(things)
        }
      }
    }
    await Promise.all(results)
  }

  /**
   * @function {encryptAccountByAddress}
   * @param  {Address} address  {account address}
   * @param  {string} password {password string for encryption}
   * @param  {object} options  {encryption options}
   * @param  {Symbol} by       {Symbol that encrypted by}
   * @return {boolean} {status}
   */
  async encryptAccountByAddress(address, password, options, by) {
    const accountObject = this.getAccountByAddress(address)
    if (accountObject !== undefined) {
      const { crypto } = accountObject
      if (crypto === undefined) {
        let encryptedObject = {}
        if (typeof accountObject.encrypt === 'function') {
          encryptedObject = await accountObject.encrypt(password, options)
        } else {
          const newAccount = new account.Account(this.messenger)
          const tempAccount = newAccount.importAccount(accountObject.privateKey)
          encryptedObject = await tempAccount.encrypt(password, options)
        }

        encryptedObject.LastEncryptedBy = by || encryptedBy.ACCOUNT
        const updateStatus = this.updateAccountByAddress(address, encryptedObject)
        if (updateStatus === true) {
          return encryptedObject
        } else return false
      }
    }
    return false
  }

  /**
   * @function {decryptAccountByAddress}
   * @param  {Address} address  {account address}
   * @param  {string} password {password string to decrypt}
   * @param  {Symbol} by       {Symbol that decrypted by}
   * @return {boolean} {status}
   */
  async decryptAccountByAddress(address, password, by) {
    const accountObject = this.getAccountByAddress(address)
    if (accountObject !== undefined) {
      const { crypto } = accountObject
      if (isObject(crypto)) {
        let decryptedObject = {}
        if (typeof accountObject.decrypt === 'function') {
          decryptedObject = await accountObject.decrypt(password)
        } else {
          const decryptedTempObject = await account.decryptAccount(accountObject, password)
          const newAccount = new account.Account(this.messenger)
          decryptedObject = newAccount.importAccount(decryptedTempObject.privateKey)
        }

        decryptedObject.LastEncryptedBy = by || encryptedBy.ACCOUNT

        const updateStatus = this.updateAccountByAddress(address, decryptedObject)
        if (updateStatus === true) {
          return decryptedObject
        } else return false
      }
    }
    return false
  }

  /**
   * @function {setSigner}
   * @param  {Account} obj {account object}
   * @return {Wallet} {wallet instance}
   */
  setSigner(obj) {
    if (isString(obj)) {
      this.signer = this.getAccountByAddress(obj)
      this.defaultAccount = this.getAccountByAddress(obj)
    } else if (isObject(obj) && isAddress(obj.address)) {
      this.signer = this.getAccountByAddress(obj.address)
      this.defaultAccount = this.getAccountByAddress(obj.address)
    }
    return this
  }

  // sign method for Transaction bytes
  /**
   * @function {sign}
   * @param  {Transaction} tx {transaction bytes}
   * @return {Transaction} {signed transaction object}
   */
  async sign(tx, { address, password }) {
    if (!this.signer && address === undefined) {
      throw new Error('This signer is not found or address is not defined')
    }
    try {
      const signerAccount = this.getAccountByAddress(address === undefined ? this.signer : address)
      const result = await signerAccount.signTransaction(tx, password)
      return result
    } catch (err) {
      throw err
    }
  }
}

export { Wallet }
