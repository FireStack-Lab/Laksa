import {
  isPrivateKey, isPubkey, isAddress, isObject, isString, validateArgs
} from 'laksa-utils'
import {
  generatePrivateKey,
  getAddressFromPrivateKey,
  getPubKeyFromPrivateKey,
  createTransactionJson
} from 'laksa-core-crypto'

import { encrypt, decrypt } from './entropy'

import { ENCRYPTED } from './symbols'

function generateAccountObject(privateKey) {
  if (!isPrivateKey(privateKey)) throw new Error('private key is not correct')
  const address = getAddressFromPrivateKey(privateKey)
  const publicKey = getPubKeyFromPrivateKey(privateKey)
  let accountObject = {}
  // set accountObject
  if (isPubkey(publicKey) && isPrivateKey(privateKey) && isAddress(address)) {
    accountObject = {
      privateKey,
      address,
      publicKey
    }
    // push account object to accountArray
    return accountObject
  }
  throw new Error('account generate failure')
}

/**
 * create an raw accountObject
 * @return {[type]} [description]
 */

export const createAccount = () => {
  const privateKey = generatePrivateKey()
  try {
    return generateAccountObject(privateKey)
  } catch (e) {
    return e
  }
}

export const importAccount = (privateKey) => {
  try {
    return generateAccountObject(privateKey)
  } catch (e) {
    return e
  }
}

export const encryptAccount = (accountObject, password, level = 1000) => {
  if (!isString(password)) throw new Error('password is not found')
  validateArgs(accountObject, {
    address: [isAddress],
    privateKey: [isPrivateKey],
    publicKey: [isPubkey]
  })
  try {
    return {
      ...accountObject,
      privateKey: ENCRYPTED,
      ...encrypt(accountObject.privateKey, password, { c: level })
    }
  } catch (e) {
    throw new Error(e)
  }
}

export const decryptAccount = (accountObject, password) => {
  if (!isString(password)) throw new Error('password is not found')
  validateArgs(accountObject, {
    address: [isAddress],
    crypto: [isObject],
    publicKey: [isPubkey]
  })
  try {
    const newObject = Object.assign({}, accountObject)
    delete newObject.crypto
    return {
      ...newObject,
      privateKey: decrypt(accountObject, password)
    }
  } catch (e) {
    throw new Error(e)
  }
}

export const signTransaction = (privateKey, transactionObject) => {
  return createTransactionJson(privateKey, transactionObject)
}

export class Account {
  // prototype.createAccount
  createAccount = () => {
    const accountObject = createAccount()
    const newObject = new Account()
    return Object.assign({}, accountObject, {
      encrypt: newObject.encrypt,
      decrypt: newObject.decrypt,
      signTransaction: newObject.signTransaction,
      signTransactionWithPassword: newObject.signTransactionWithPassword
    })
  }

  // prototype.importAccount
  importAccount = (privateKey) => {
    const accountObject = importAccount(privateKey)
    const newObject = new Account()
    return Object.assign({}, accountObject, {
      encrypt: newObject.encrypt,
      decrypt: newObject.decrypt,
      signTransaction: newObject.signTransaction,
      signTransactionWithPassword: newObject.signTransactionWithPassword
    })
  }

  // sub object
  encrypt(password, level = 1000) {
    return Object.assign(this, encryptAccount(this, password, level))
  }

  // sub object
  decrypt(password) {
    const that = this
    const decrypted = decryptAccount(that, password)
    delete this.crypto
    return Object.assign(this, decrypted)
  }

  // sub object
  signTransaction(transactionObject) {
    if (this.privateKey === ENCRYPTED) {
      throw new Error(
        'This account is encrypted, please decrypt it first or use "signTransactionWithPassword"'
      )
    }
    return signTransaction(this.privateKey, transactionObject)
  }

  // sub object
  signTransactionWithPassword(transactionObject, password) {
    if (this.privateKey === ENCRYPTED) {
      const decrypted = this.decrypt(password)
      const signed = signTransaction(decrypted.privateKey, transactionObject)
      Object.assign(this, encryptAccount(decrypted, password))
      return signed
    }
  }
}
