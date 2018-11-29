import { InvalidProvider } from 'laksa-shared'
import { JsonRpc } from './rpcbuilder'

/**
 * @function getResultForData
 * @param  {object} data {object get from provider}
 * @return {object} {data result or data}
 */
function getResultForData(data) {
  if (data.result) {
    return data.result
  }
  return data
}

export class Messenger {
  constructor(provider) {
    this.provider = provider
    this.scillaProvider = provider
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
      this.setReqMiddleware(getResultForData)
      // this.provider.middleware.response.use(getResultForData)
      const result = await this.provider.send(payload)
      return result // getResultForData(result)
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
    this.provider.middleware.request.use(middleware, method)
  }

  setResMiddleware(middleware, method = '*') {
    this.provider.middleware.response.use(middleware, method)
  }
}
