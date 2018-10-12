import {
  isAddress, isNumber, isObject, isArray
} from 'laksa-utils'
import { Map, List } from 'immutable'

import * as account from 'laksa-account'
import { encryptedBy, ENCRYPTED } from './symbols'

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

  /**
   * [updateLength description]
   * @return {[type]} [description]
   */
  updateLength() {
    this.length = this.getIndexKeys().length
  }

  getIndexKeys() {
    const isCorrectKeys = n => /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20
    const arrays = this.#_accounts.get('accounts').toArray()
    return Object.keys(arrays).filter(isCorrectKeys)
  }

  getCurrentMaxIndex() {
    const diff = (a, b) => {
      return b - a
    }
    // const sorted = R.sort(diff, keyList)
    const sorted = this.getIndexKeys().sort(diff)
    return sorted[0] === undefined ? -1 : parseInt(sorted[0], 10)
  }

  addAccount(accountObject) {
    if (!isObject(accountObject)) throw new Error('account Object is not correct')
    const newAccountObject = Object.assign({}, accountObject, {
      createTime: new Date(),
      index: this.getCurrentMaxIndex() + 1
    })
    const objectKey = newAccountObject.address
    const newIndex = newAccountObject.index
    let newArrays = this.#_accounts.get('accounts')
    newArrays = newArrays.set(newIndex, objectKey)
    this.#_accounts = this.#_accounts.set(objectKey, newAccountObject)
    this.#_accounts = this.#_accounts.set('accounts', List(newArrays))
    // this.#_accounts = this.#_accounts.concat(newArrays)
    this.updateLength()
    return {
      ...newAccountObject
    }
  }

  createAccount = () => {
    const accountInstance = new account.Account()
    const accountObject = accountInstance.createAccount()
    return this.addAccount(accountObject)
  }

  createBatchAccounts = number => {
    if (!isNumber(number) || (isNumber(number) && number === 0)) throw new Error('number has to be >0 Number')
    const Batch = []
    for (let i = 0; i < number; i += 1) {
      Batch.push(this.createAccount())
    }
    return Batch
  }

  importAccountFromPrivateKey = privateKey => {
    const accountInstance = new account.Account()
    const accountObject = accountInstance.importAccount(privateKey)
    return this.addAccount(accountObject)
  }

  importAccountsFromPrivateKeyList(privateKeyList) {
    if (!isArray(privateKeyList)) throw new Error('privateKeyList has to be Array<String>')
    const Imported = []
    for (let i = 0; i < privateKeyList.length; i += 1) {
      Imported.push(this.importAccountFromPrivateKey(privateKeyList[i]))
    }
    return Imported
  }

  //-------
  removeOneAccountByAddress = address => {
    if (!isAddress(address)) throw new Error('address is not correct')
    const { index } = this.getAccountByAddress(address)
    if (index !== undefined) {
      const currentArray = this.#_accounts.get('accounts').toArray()
      delete currentArray[index]
      this.#_accounts = this.#_accounts.set('accounts', List(currentArray))
      this.#_accounts = this.#_accounts.delete(address)
      this.updateLength()
    }
  }

  removeOneAccountByIndex(index) {
    if (!isNumber(index)) throw new Error('index is not correct')
    const addressRef = this.getAccountByIndex(index)
    if (addressRef !== undefined && addressRef.address) {
      this.removeOneAccountByAddress(addressRef.address)
    }
  }

  //---------
  getAccountByAddress = address => {
    if (!isAddress(address)) throw new Error('address is not correct')
    return this.#_accounts.get(address)
  }

  getAccountByIndex = index => {
    if (!isNumber(index)) throw new Error('index is not correct')
    const address = this.#_accounts.get('accounts').get(index)
    if (address !== undefined) {
      return this.getAccountByAddress(address)
    } else return undefined
  }

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

  getWalletAccounts = () => {
    return this.getIndexKeys()
      .map(index => {
        const accountFound = this.getAccountByIndex(parseInt(index, 10))
        return accountFound || false
      })
      .filter(d => !!d)
  }

  // -----------

  updateAccountByAddress(address, newObject) {
    if (!isAddress(address)) throw new Error('address is not correct')
    if (!isObject(newObject)) throw new Error('new account Object is not correct')
    const newAccountObject = Object.assign({}, newObject, { updatedTime: new Date() })
    this.#_accounts = this.#_accounts.update(address, () => newAccountObject)
    return true
  }

  // -----------
  cleanAllAccounts = () => {
    this.getIndexKeys().forEach(index => this.removeOneAccountByIndex(parseInt(index, 10)))
    return true
  }

  // -----------
  async encryptAllAccounts(password, options) {
    this.getIndexKeys().forEach(index => {
      const accountObject = this.getAccountByIndex(parseInt(index, 10))
      if (accountObject) {
        const { address } = accountObject
        this.encryptAccountByAddress(address, password, options, encryptedBy.WALLET)
      }
    })
    return true
  }

  async decryptAllAccounts(password) {
    this.getIndexKeys().forEach(index => {
      const accountObject = this.getAccountByIndex(parseInt(index, 10))
      if (accountObject) {
        const { address, LastEncryptedBy } = accountObject
        if (LastEncryptedBy === encryptedBy.WALLET) {
          this.decryptAccountByAddress(address, password, encryptedBy.WALLET)
        } else {
          console.error(`address ${address} is protected by account psw`)
          console.error('use /decryptAccountByAddress/ instead')
        }
      }
    })
    return true
  }

  async encryptAccountByAddress(address, password, options, by) {
    const accountObject = this.getAccountByAddress(address)
    if (accountObject !== undefined) {
      const { privateKey, crypto } = accountObject
      if (privateKey !== undefined && privateKey !== ENCRYPTED && crypto === undefined) {
        const encryptedObject = await accountObject.encrypt(password, options)
        return this.updateAccountByAddress(
          address,
          Object.assign({}, encryptedObject, {
            LastEncryptedBy: by || encryptedBy.ACCOUNT
          })
        )
      }
    }
    return false
  }

  async decryptAccountByAddress(address, password, by) {
    const accountObject = this.getAccountByAddress(address)
    if (accountObject !== undefined) {
      const { privateKey, crypto } = accountObject

      if (privateKey !== undefined && privateKey === ENCRYPTED && isObject(crypto)) {
        const decryptedObject = await accountObject.decrypt(password)

        return this.updateAccountByAddress(
          address,
          Object.assign({}, decryptedObject, {
            LastEncryptedBy: by || encryptedBy.ACCOUNT
          })
        )
      }
    }
    return false
  }

  setDefaultAccount(obj) {
    if (isAddress(obj)) {
      this.defaultAccount = this.getAccountByAddress(obj)
    } else if (isAddress(obj.address)) {
      this.defaultAccount = this.getAccountByAddress(obj.address).address
    }

    return this
  }

  setSigner(obj) {
    if (isAddress(obj)) {
      this.signer = this.getAccountByAddress(obj)
    } else if (isAddress(obj.address)) {
      this.signer = this.getAccountByAddress(obj.address).address
    }
    return this
  }

  // sign method for Transaction bytes
  async sign(tx) {
    if (!this.signer) {
      throw new Error('This signer is not found')
    }
    try {
      const signerAccount = this.getAccountByAddress(this.signer)
      const balance = await this.messenger.send({
        method: 'GetBalance',
        params: [signerAccount.address]
      })

      if (typeof balance.nonce !== 'number') {
        throw new Error('Could not get nonce')
      }

      const withNonce = tx.map(txObj => {
        return {
          ...txObj,
          nonce: balance.nonce + 1,
          pubKey: signerAccount.publicKey
        }
      })

      return withNonce.map(txObj => {
        // @ts-ignore
        return {
          ...txObj,
          signature: signerAccount.sign(withNonce.bytes)
        }
      })
    } catch (err) {
      throw err
    }
  }
}

export default Wallet
