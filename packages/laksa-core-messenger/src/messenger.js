import { InvalidProvider } from 'laksa-shared'
import { pack } from 'laksa-utils'
import { JsonRpc } from './rpcbuilder'
import { ResponseMiddleware } from './responseMiddleware'
import { getResultForData } from './util'

class Messenger {
  constructor(provider, config) {
    this.provider = provider
    this.scillaProvider = provider
    this.config = config
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

  setTransactionVersion(version) {
    let chainID = 1
    switch (this.provider.url) {
    case this.config.Default.nodeProviderUrl: {
      chainID = this.config.Default.CHAIN_ID
      break
    }
    case this.config.TestNet.nodeProviderUrl: {
      chainID = this.config.TestNet.CHAIN_ID
      break
    }
    case this.config.MainNet.nodeProviderUrl: {
      chainID = this.config.MainNet.CHAIN_ID
      break
    }
    case this.config.Staging.nodeProviderUrl: {
      chainID = this.config.Staging.CHAIN_ID
      break
    }
    default:
      break
    }
    return pack(chainID, version)
  }
}
export { Messenger }
