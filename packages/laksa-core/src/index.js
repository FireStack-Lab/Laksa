//
//
//  Copyright await release
//
//
//

import * as util from 'laksa-utils'
import * as core from 'laksa-core-crypto'
import { Messenger } from 'laksa-core-messenger'
import { Transactions, Transaction } from 'laksa-core-transaction'
import { HttpProvider } from 'laksa-providers-http'
import { Account } from 'laksa-account'
import { Contracts, Contract } from 'laksa-core-contract'
import { BlockChain } from 'laksa-blockchain'
import { Wallet } from 'laksa-wallet'

import config from './config'

class Laksa {
  constructor(args) {
    const url = (args && util.isUrl(args) ? args : undefined) || config.Default.nodeProviderUrl
    this.util = {
      ...util,
      ...core
    }
    this.currentProvider = {
      node: new HttpProvider(url),
      scilla: new HttpProvider(url)
    }
    this.config = config
    this.messenger = new Messenger(this.currentProvider.node, this.config)
    this.wallet = new Wallet(this.messenger)
    this.transactions = new Transactions(this.messenger, this.wallet)
    this.contracts = new Contracts(this.messenger, this.wallet)
    this.zil = new BlockChain(this.messenger, this.wallet)
  }

  Modules = {
    Account,
    BlockChain,
    Contracts,
    Contract,
    HttpProvider,
    Messenger,
    Transaction,
    Transactions,
    Wallet
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
      throw new Error('provider should be HttpProvider or url string')
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

  getNetworkSetting() {
    const {
      TestNet, MainNet, Default, Staging, DevNet
    } = this.config
    return {
      TestNet,
      MainNet,
      Default,
      DevNet,
      Staging
    }
  }

  setNetworkID(networkId) {
    this.messenger.setNetworkID(networkId)
  }
}

export default Laksa
