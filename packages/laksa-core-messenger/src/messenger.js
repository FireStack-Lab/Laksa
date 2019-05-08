import { InvalidProvider } from 'laksa-shared'
import { pack } from 'laksa-utils'
import { JsonRpc } from './rpcbuilder'
import { ResponseMiddleware } from './responseMiddleware'
import { getResultForData } from './util'

const defaultConfig = {
  Default: {
    CHAIN_ID: 0,
    Network_ID: 'Default',
    nodeProviderUrl: 'http://localhost:4201'
  },
  Staging: {
    CHAIN_ID: 63,
    Network_ID: 'Staging',
    nodeProviderUrl: 'https://staging-api.aws.z7a.xyz'
  },
  DevNet: {
    CHAIN_ID: 333,
    Network_ID: 'DevNet',
    nodeProviderUrl: 'https://dev-api.zilliqa.com'
  },
  TestNet: {
    CHAIN_ID: 2,
    Network_ID: 'TestNet',
    nodeProviderUrl: 'https://api.zilliqa.com'
  },
  MainNet: {
    CHAIN_ID: 1,
    Network_ID: 'MainNet',
    nodeProviderUrl: 'https://api.zilliqa.com'
  }
}

/**
 * @class Messenger
 * @description Messenger instance
 * @param  {HttpProvider} provider HttpProvider
 * @param  {Object}  config config object
 * @return {Messenger} Messenger instance
 */
class Messenger {
  constructor(provider, config) {
    /**
     * @var {Provider} provider
     * @memberof Messenger.prototype
     * @description Provider instance
     */
    this.provider = provider
    /**
     * @var {Provider} scillaProvider
     * @memberof Messenger.prototype
     * @description scilla Provider instance
     */
    this.scillaProvider = provider
    /**
     * @var {Object} config
     * @memberof Messenger.prototype
     * @description Messenger config
     */
    this.config = config || defaultConfig
    /**
     * @var {Number} Network_ID
     * @memberof Messenger.prototype
     * @description Network ID for current provider
     */
    this.Network_ID = this.setNetworkID(this.config.Default.Network_ID)
    /**
     * @var {JsonRpc} JsonRpc
     * @memberof Messenger.prototype
     * @description JsonRpc instance
     */
    this.JsonRpc = new JsonRpc()
  }

  /**
   * @function send
   * @memberof Messenger.prototype
   * @param  {String} method - RPC method
   * @param  {Object} params - RPC method params
   * @return {Object} RPC result
   */
  send = async (method, params) => {
    this.providerCheck()
    try {
      const payload = this.JsonRpc.toPayload(method, params)
      this.setResMiddleware(data => new ResponseMiddleware(data))
      const result = await this.provider.send(payload)
      return getResultForData(result) // getResultForData(result)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * @function sendServer
   * @description send data to scilla runner endpoint
   * @param  {String} endpoint - endpoint that point to server
   * @param  {Object} data     - data object with method and params
   * @return {Object} RPC result
   */
  sendServer = async (endpoint, data) => {
    this.providerCheck()
    try {
      const result = await this.scillaProvider.sendServer(endpoint, data)
      return result
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * @function setProvider
   * @memberof Messenger
   * @description provider setter
   * @param  {Provider} provider - provider instance
   */
  setProvider(provider) {
    this.provider = provider
  }

  /**
   * @function setScillaProvider
   * @memberof Messenger
   * @description scilla provider setter
   * @param  {Provider} provider - provider instance
   */
  setScillaProvider(provider) {
    this.scillaProvider = provider
  }

  /**
   * @function providerCheck
   * @memberof Messenger
   * @description provider checker
   * @return {Error|null} provider validator
   */
  providerCheck() {
    if (!this.provider) {
      InvalidProvider()
      return null
    }
  }

  /**
   * @function setReqMiddleware
   * @description set request middleware
   * @memberof Messenger
   * @param  {any} middleware - middle ware for req
   * @param  {String} method  - method name
   */
  setReqMiddleware(middleware, method = '*') {
    return this.provider.middleware.request.use(middleware, method)
  }

  /**
   * @function setResMiddleware
   * @description set response middleware
   * @memberof Messenger
   * @param  {any} middleware - middle ware for req
   * @param  {String} method  - method name
   */
  setResMiddleware(middleware, method = '*') {
    return this.provider.middleware.response.use(middleware, method)
  }

  /**
   * @function setTransactionVersion
   * @description set transasction version
   * @memberof Messenger
   * @param  {Number} version   - version number
   * @param  {String} networkId - network id
   */
  setTransactionVersion(version, networkId) {
    let chainID = 1
    switch (networkId) {
    case this.config.Default.Network_ID: {
      chainID = this.config.Default.CHAIN_ID
      this.setNetworkID(networkId)
      break
    }
    case this.config.TestNet.Network_ID: {
      chainID = this.config.TestNet.CHAIN_ID
      this.setNetworkID(networkId)
      break
    }
    case this.config.MainNet.Network_ID: {
      chainID = this.config.MainNet.CHAIN_ID
      this.setNetworkID(networkId)
      break
    }
    case this.config.Staging.Network_ID: {
      chainID = this.config.Staging.CHAIN_ID
      this.setNetworkID(networkId)
      break
    }
    case this.config.DevNet.Network_ID: {
      chainID = this.config.DevNet.CHAIN_ID
      this.setNetworkID(networkId)
      break
    }
    default:
      break
    }
    return pack(chainID, version)
  }

  /**
   * @function setNetworkID
   * @description set network id
   * @memberof Messenger
   * @param  {String} id network id string
   */
  setNetworkID(id) {
    this.Network_ID = id
  }
}
export { Messenger }
