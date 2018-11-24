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
  send = async data => {
    this.providerCheck()
    try {
      const payload = this.JsonRpc.toPayload(data.method, data.params)
      this.provider.middleware.response.use(getResultForData)
      const result = await this.provider.send(payload)
      return result // getResultForData(result)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * @function {sendAsync}
   * @param  {object} data {data object with method and params}
   * @param  {any} callback {callback function}
   * @return {any} {callback function execution}
   */
  sendAsync(data, callback) {
    this.providerCheck()
    const payload = this.JsonRpc.toPayload(data.method, data.params)
    this.provider.middleware.response.use(getResultForData)
    this.provider.send(payload, async (err, result) => {
      if (err || result.error) {
        const errors = err || result.error
        return callback(errors)
      }
      const promiseResult = await result
      callback(null, promiseResult)
    })
  }

  /**
   * @function {sendBatch}
   * @param  {object} data {data object with method and params}
   * @param  {any} callback {callback function}
   * @return {any} {callback function execution}
   */
  sendBatch(data, callback) {
    this.providerCheck()
    const payload = this.JsonRpc.toBatchPayload(data)
    this.provider.send(payload, async (err, results) => {
      if (err) {
        return callback(err)
      }
      const promiseResult = await results
      callback(null, promiseResult)
    })
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
   * @function {sendAsyncServer}
   * @param  {string} endpoint {endpoint that point to server}
   * @param  {object} data     {data object with method and params}
   * @param  {any} callback {callback function}
   * @return {any} {callback function execution}
   */
  sendAsyncServer(endpoint, data, callback) {
    this.providerCheck()
    this.scillaProvider.sendServer(endpoint, data, async (err, result) => {
      if (err || result.error) {
        const errors = err || result.error
        return callback(errors)
      }
      const promiseResult = await result
      callback(null, promiseResult)
    })
  }

  /**
   * @function {sendBatchServer}
   * @param  {string} endpoint {endpoint that point to server}
   * @param  {object} data     {data object with method and params}
   * @param  {any} callback {callback function}
   * @return {any} {callback function execution}
   */
  sendBatchServer(endpoint, data, callback) {
    this.providerCheck()
    this.scillaProvider.sendServer(endpoint, data, async (err, results) => {
      if (err) {
        return callback(err)
      }
      const promiseResult = await results
      callback(null, promiseResult)
    })
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
}
