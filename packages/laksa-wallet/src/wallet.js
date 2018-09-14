import {
  isAddress, isNumber, isPrivateKey, isObject, isArray
} from 'laksa-utils'
import R from 'ramda'
import * as account from './account'

const encryptedBy = {
  ACCOUNT: Symbol('account'),
  WALLET: Symbol('wallet')
}

class Wallet {
  constructor() {
    this.length = 0
    this.accounts = []
  }

  updateLength = () => {
    this.length = this.getIndexKeys().length
  }

  getIndexKeys = () => {
    const isCorrectKeys = n => /^\d+$/i.test(n) && parseInt(n, 10) <= 9e20
    return R.filter(isCorrectKeys, Object.keys(this.accounts))
  }

  getCurrentMaxIndex = () => {
    const keyList = this.getIndexKeys()
    const diff = (a, b) => {
      return b - a
    }
    const sorted = R.sort(diff, keyList)
    return sorted[0] === undefined ? -1 : parseInt(sorted[0], 10)
  }

  addAccount = (accountObject) => {
    if (!isObject(accountObject)) throw new Error('account Object is not correct')
    const newAccountObject = Object.assign({}, accountObject, {
      createTime: new Date(),
      index: this.getCurrentMaxIndex() + 1
    })
    const objectKey = newAccountObject.address
    const newIndex = newAccountObject.index
    this.accounts[objectKey] = newAccountObject
    this.accounts[newIndex] = objectKey
    this.updateLength()
  }

  createAccount = () => {
    const accountObject = account.createAccount()
    this.addAccount(accountObject)
    return true
  }

  createBatchAccounts = (number) => {
    if (!isNumber(number) || (isNumber(number) && number === 0)) throw new Error('number has to be >0 Number')
    for (let i = 0; i < number; i += 1) {
      this.createAccount()
    }
    return true
  }

  importAccountFromPrivateKey = (privateKey) => {
    const accountObject = account.importAccount(privateKey)
    this.addAccount(accountObject)
    return true
  }

  importAccountsFromPrivateKeyList = (privateKeyList) => {
    if (!isArray(privateKeyList)) throw new Error('privateKeyList has to be Array<String>')
    for (let i = 0; i < privateKeyList.length; i += 1) {
      this.importAccountFromPrivateKey(privateKeyList[i])
    }
    return true
  }

  removeOneAccountByAddress = (address) => {
    if (!isAddress(address)) throw new Error('address is not correct')
    const { index } = this.getAccountByAddress(address)
    if (index !== undefined) {
      delete this.accounts[index]
      delete this.accounts[address]
      this.updateLength()
    }
  }

  removeOneAccountByIndex = (index) => {
    if (!isNumber(index)) throw new Error('index is not correct')
    const addressRef = this.getAccountByIndex(index)
    if (addressRef !== undefined && addressRef.address) {
      this.removeOneAccountByAddress(addressRef.address)
    }
  }

  getAccountByAddress = (address) => {
    if (!isAddress(address)) throw new Error('address is not correct')
    return this.accounts[address]
  }

  getAccountByIndex = (index) => {
    if (!isNumber(index)) throw new Error('index is not correct')
    const address = this.accounts[index]
    if (address !== undefined) {
      return this.getAccountByAddress(address)
    } else return undefined
  }

  getWalletAddresses = () => {
    const keyList = this.getIndexKeys()
    return R.map((index) => {
      const { address } = this.getAccountByIndex(parseInt(index, 10))
      return address
    }, keyList)
  }

  getWalletPublicKeys = () => {
    const keyList = this.getIndexKeys()
    return R.map((index) => {
      const { publicKey } = this.getAccountByIndex(parseInt(index, 10))
      return publicKey
    }, keyList)
  }

  getWalletPrivateKeys = () => {
    const keyList = this.getIndexKeys()
    return R.map((index) => {
      const { privateKey } = this.getAccountByIndex(parseInt(index, 10))
      return privateKey
    }, keyList)
  }

  updateAccountByAddress = (address, newObject) => {
    if (!isAddress(address)) throw new Error('address is not correct')
    if (!isObject(newObject)) throw new Error('new account Object is not correct')
    const newAccountObject = Object.assign({}, newObject, { updatedTime: new Date() })
    this.accounts[address] = newAccountObject
    return true
  }

  cleanAllAccounts = () => {
    const keyList = this.getIndexKeys()
    R.forEach(index => this.removeOneAccountByIndex(parseInt(index, 10)), keyList)
    return true
  }

  encryptAllAccounts = (password) => {
    const currentKeys = this.getIndexKeys()
    R.forEach((index) => {
      const { address } = this.getAccountByIndex(parseInt(index, 10))
      this.encryptAccountByAddress(address, password, encryptedBy.WALLET)
    }, currentKeys)
    return true
  }

  decryptAllAccounts = (password) => {
    const currentKeys = this.getIndexKeys()
    R.forEach((index) => {
      const accountObject = this.getAccountByIndex(parseInt(index, 10))
      const { address, LastEncryptedBy } = accountObject
      if (LastEncryptedBy === encryptedBy.WALLET) {
        this.decryptAccountByAddress(address, password, encryptedBy.WALLET)
      } else {
        console.error(`address ${address} is protected by account psw`)
        console.error('use /decryptAccountByAddress/ instead')
      }
    }, currentKeys)
    return true
  }

  encryptAccountByAddress = (address, password, by) => {
    const accountObject = this.getAccountByAddress(address)
    if (accountObject !== undefined) {
      const { privateKey, crypto } = accountObject
      if (privateKey !== undefined && isPrivateKey(privateKey) && crypto === undefined) {
        const encryptedObject = account.encryptAccount(accountObject, password)
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

  decryptAccountByAddress = (address, password, by) => {
    const accountObject = this.getAccountByAddress(address)
    if (accountObject !== undefined) {
      const { privateKey, crypto } = accountObject
      if (privateKey !== undefined && privateKey === account.ENCRYPTED && isObject(crypto)) {
        const decryptedObject = account.decryptAccount(accountObject, password)
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
}

export default Wallet
