//
//
//  Copyright
//
//
//

import * as util from 'laksa-utils'
import * as core from 'laksa-core-crypto'
import { Messenger } from 'laksa-core-messenger'
import { Transaction } from 'laksa-core-transaction'
import { ProtobufProvider as HttpProvider } from 'laksa-providers-http'

import { Account } from 'laksa-account'
import Contracts from 'laksa-contracts'
import { Wallet } from 'laksa-wallet'
import Zil from 'laksa-zil'

import config from './config'

class Laksa {
  constructor(args) {
    const url = (args && util.isUrl(args) ? args : undefined) || config.defaultNodeUrl
    this.util = {
      ...util,
      ...core
    }
    this.currentProvider = {
      node: new HttpProvider(url),
      scilla: new HttpProvider(url)
    }
    this.messenger = new Messenger(this.currentProvider.node)
    this.zil = new Zil(this.messenger)
    this.wallet = new Wallet(this.messenger)
    this.contracts = new Contracts(this.messenger, this.wallet)
  }

  Modules = {
    Account,
    Contracts,
    HttpProvider,
    Messenger,
    Transaction,
    Wallet,
    Zil
  }

  get version() {
    return config.version
  }

  get isConnected() {
    return this.connection
  }

  // library method
  async connection(callback) {
    const result = await this.zil.isConnected()
    try {
      return callback === undefined ? !(result instanceof Error) : callback(null, true)
    } catch (e) {
      return false
    }
  }

  setProvider = provider => {
    let providerSetter = {}
    if (util.isUrl(provider)) {
      providerSetter.url = provider
    } else if (util.isObject(provider) && util.isUrl(provider.url)) {
      providerSetter = {
        url: provider.url,
        options: provider.options
      }
    } else {
      throw new Error('provider should be HttpProvider Module or url string')
    }
    this.setNodeProvider(providerSetter)
    this.setScillaProvider(providerSetter)
    return true
  }

  getProvider() {
    return this.currentProvider
  }

  getLibraryVersion() {
    return this.version
  }

  getDefaultAccount() {
    if (this.wallet.defaultAccount) {
      return this.wallet.defaultAccount
    }
    return this.config.defaultAccount
  }

  setNodeProvider({ url, options }) {
    const newProvider = new HttpProvider(url, options)

    this.currentProvider = {
      ...this.currentProvider,
      node: newProvider
    }
    this.messenger.setProvider(newProvider)
  }

  setScillaProvider({ url, options }) {
    const newProvider = new HttpProvider(url, options)
    this.currentProvider = {
      ...this.currentProvider,
      scilla: newProvider
    }
    this.messenger.setScillaProvider(newProvider)
  }

  register({ name, pkg }) {
    const pkgObject = {
      get: pkg,
      enumerable: true
    }
    Object.defineProperty(this, name, pkgObject)
  }
}

export default Laksa
