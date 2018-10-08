//
//
//  Copyright
//
//
//

import * as util from 'laksa-utils'
import * as core from 'laksa-core-crypto'
import { Messenger } from 'laksa-core-messenger'
import HttpProvider from 'laksa-providers-http'
import Zil from 'laksa-zil'
import config from './config'

class Laksa {
  constructor(args) {
    const url = args || config.defaultNodeUrl
    this.util = { ...util, ...core }
    this.currentProvider = { node: new HttpProvider(url), scilla: new HttpProvider(url) }
    this.messenger = new Messenger(this.currentProvider.node)
    this.zil = new Zil(this)
  }

  providers = {
    HttpProvider
  }

  config = config

  // library method
  isConnected = async (callback) => {
    const result = await this.zil.isConnected()
    try {
      return callback === undefined ? !(result instanceof Error) : callback(null, true)
    } catch (e) {
      return false
    }
  }

  getLibraryVersion = () => this.config.version

  getDefaultProviderUrl = () => this.config.defaultProviderUrl

  getDefaultAccount = () => this.config.defaultAccount

  getDefaultBlock = () => this.config.defaultBlock

  getProvider = () => this.currentProvider

  setProvider = (provider) => {
    this.setNodeProvider(provider)
    this.setScillaProvider(provider)
  }

  setNodeProvider = (provider) => {
    const newProvider = new HttpProvider(provider)
    this.currentProvider = { ...this.currentProvider, node: newProvider }
    this.messenger.setProvider(newProvider)
    // this.contract.setNodeProvider(newProvider)
  }

  setScillaProvider = (provider) => {
    const newProvider = new HttpProvider(provider)
    this.currentProvider = { ...this.currentProvider, scilla: newProvider }
    this.messenger.setScillaProvider(newProvider)
    // this.contract.setScillaProvider(newProvider)
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
