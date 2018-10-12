import {
  isPrivateKey, isPubkey, isAddress, isObject, isString, validateArgs
} from 'laksa-utils'
import {
  generatePrivateKey,
  getAddressFromPrivateKey,
  getPubKeyFromPrivateKey,
  createTransactionJson,
  sign
} from 'laksa-core-crypto'

import { encrypt, decrypt } from 'laksa-extend-keystore'
import { ENCRYPTED } from './symbols'

export { ENCRYPTED }

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

export const importAccount = privateKey => {
  try {
    return generateAccountObject(privateKey)
  } catch (e) {
    return e
  }
}

export const encryptAccount = async (accountObject, password, options = { level: 1024 }) => {
  if (!isString(password)) throw new Error('password is not found')
  validateArgs(accountObject, {
    address: [isAddress],
    privateKey: [isPrivateKey],
    publicKey: [isPubkey]
  })
  try {
    const encrypted = await encrypt(accountObject.privateKey, password, options)
    const encryptedObj = {
      ...accountObject,
      privateKey: ENCRYPTED,
      ...encrypted
    }
    return encryptedObj
  } catch (e) {
    throw new Error(e)
  }
}

export const decryptAccount = async (accountObject, password) => {
  if (!isString(password)) throw new Error('password is not found')
  validateArgs(accountObject, {
    address: [isAddress],
    crypto: [isObject],
    publicKey: [isPubkey]
  })
  try {
    const newObject = Object.assign({}, accountObject)
    delete newObject.crypto
    const decrypted = await decrypt(accountObject, password)
    const decryptedObj = {
      ...newObject,
      privateKey: decrypted
    }
    return decryptedObj
  } catch (e) {
    throw new Error(e)
  }
}

export const signTransaction = (privateKey, transactionObject) => {
  return createTransactionJson(privateKey, transactionObject)
}

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
    }
  }
}
