//
//
//  Copyright
//
//
//

import * as util from 'laksa-utils'
import { HttpProvider, Messenger } from 'laksa-request'
import Zil from 'laksa-zil'
import config from './config'

class Laksa {
  constructor(args) {
    // validateArgs(args, {}, { nodeUrl: [util.isUrl] })
    const url = args || config.defaultNodeUrl
    //
    this.util = util
    //
    this.currentProvider = new HttpProvider(url)
    this.messenger = new Messenger(this.currentProvider)
    //
    this.zil = new Zil(this)
  }

  providers = {
    HttpProvider
  }

  config = config

  // library method
  isConnected = async () => {
    const result = await this.zil.isConnected()
    try {
      return !(result instanceof Error)
    } catch (e) {
      return false
    }
  }

  getLibraryVersion = () => this.config.version

  getDefaultProviderUrl = () => this.config.defaultProviderUrl

  getDefaultAccount = () => this.config.defaultAccount

  getDefaultBlock = () => this.config.defaultBlock

  // provider method
  getProvider = () => this.currentProvider

  setProvider = (provider) => {
    this.currentProvider = new HttpProvider(provider)
    this.messenger.setProvider(this.currentProvider)
  }
}

export default Laksa
