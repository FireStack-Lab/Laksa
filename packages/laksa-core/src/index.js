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

/**
 * @class Laksa
 * @param  {String}  url - Url string to initializing Laksa
 * @return {Laksa} - Laksa instance
 */
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

  /**
   * @function version
   * @memberof Laksa
   * @description get library version
   * @return {String} - library version
   */
  get version() {
    return config.version
  }

  /**
   * @function isConnected
   * @memberof Laksa
   * @description check connection status
   * @return {any} - connection status
   */
  get isConnected() {
    return this.connection
  }

  /**
   * @function connection
   * @memberof Laksa
   * @param {?Function} callback - callback function
   * @description check connection status
   * @return {Promise<any>} - connection status
   */
  async connection(callback) {
    const result = await this.zil.isConnected()
    try {
      return callback === undefined ? !(result instanceof Error) : callback(null, true)
    } catch (e) {
      return false
    }
  }

  /**
   * @function setProvider
   * @memberof Laksa.prototype
   * @param {HttpProvider} provider - HttpProvider
   * @description provider setter
   * @return {Boolean} - if provider is set, return true
   */
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

  /**
   * @function getProvider
   * @memberof Laksa
   * @description provider getter
   * @return {Object} - currentProvider with nodeProvider and scillaProvider
   */
  getProvider() {
    return this.currentProvider
  }

  /**
   * @function getLibraryVersion
   * @memberof Laksa
   * @description version getter
   * @return {String} - version string
   */
  getLibraryVersion() {
    return this.version
  }

  /**
   * @function getDefaultAccount
   * @memberof Laksa
   * @description get wallet's default Account or config default Account
   * @return {Account} - Account instance
   */
  getDefaultAccount() {
    if (this.wallet.defaultAccount) {
      return this.wallet.defaultAccount
    }
    return this.config.defaultAccount
  }

  /**
   * @function setNodeProvider
   * @memberof Laksa
   * @description set provider to nodeProvider
   * @param {Object} providerObject
   * @param {String} providerObject.url - url String
   * @param {Object} providerObject.options - provider options
   */
  setNodeProvider({ url, options }) {
    const newProvider = new HttpProvider(url, options)

    this.currentProvider = {
      ...this.currentProvider,
      node: newProvider
    }
    this.messenger.setProvider(newProvider)
  }

  /**
   * @function setScillaProvider
   * @memberof Laksa
   * @description set provider to scillaProvider
   * @param {Object} providerObject
   * @param {String} providerObject.url - url String
   * @param {Object} providerObject.options - provider options
   */
  setScillaProvider({ url, options }) {
    const newProvider = new HttpProvider(url, options)
    this.currentProvider = {
      ...this.currentProvider,
      scilla: newProvider
    }
    this.messenger.setScillaProvider(newProvider)
  }

  /**
   * @function register
   * @memberof Laksa
   * @description register a Module attach to Laksa
   * @param {Object} moduleObject
   * @param {String} moduleObject.name - Module name
   * @param {any} moduleObject.pkg - Module instance
   */
  register({ name, pkg }) {
    const pkgObject = {
      get: pkg,
      enumerable: true
    }
    Object.defineProperty(this, name, pkgObject)
  }

  /**
   * @function getNetworkSetting
   * @memberof Laksa
   * @description get config's network settings
   * @return {Object}
   */
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

  /**
   * @function setNetworkID
   * @memberof Laksa
   * @description set network Id to messenger
   * @param {String} networkId
   * @return {Object}
   */
  setNetworkID(networkId) {
    this.messenger.setNetworkID(networkId)
  }
}

export default Laksa
