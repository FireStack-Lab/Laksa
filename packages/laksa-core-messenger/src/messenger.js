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

class Messenger {
  constructor(provider, config) {
    this.provider = provider
    this.scillaProvider = provider
    this.config = config || defaultConfig
    this.Network_ID = this.setNetworkID(this.config.Default.Network_ID)
    this.JsonRpc = new JsonRpc()
  }

  /**
   * @function {send}
   * @param  {object} data {data object with method and params}
   * @return {object|Error} {result from provider}
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
   * @function {sendServer}
   * @param  {string} endpoint {endpoint that point to server}
   * @param  {object} data     {data object with method and params}
   * @return {object|Error} {result from provider}
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
   * @function {setProvider}
   * @param  {Provider} provider {provider instance}
   * @return {Provider} {provider setter}
   */
  setProvider(provider) {
    this.provider = provider
  }

  /**
   * @function {setScillaProvider}
   * @param  {Provider} provider {provider instance}
   * @return {Provider} {provider setter}
   */
  setScillaProvider(provider) {
    this.scillaProvider = provider
  }

  /**
   * @function {providerCheck}
   * @return {Error|null} {provider validator}
   */
  providerCheck() {
    if (!this.provider) {
      InvalidProvider()
      return null
    }
  }

  setReqMiddleware(middleware, method = '*') {
    return this.provider.middleware.request.use(middleware, method)
  }

  setResMiddleware(middleware, method = '*') {
    return this.provider.middleware.response.use(middleware, method)
  }

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

  setNetworkID(id) {
    this.Network_ID = id
  }
}
export { Messenger }
