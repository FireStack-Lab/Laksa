import { InvalidProvider } from 'laksa-shared'
import { JsonRpc } from './rpcbuilder'

function getResultForData(data) {
  return data.error ? data.error : data.message ? data : data.result
}

export default class Messanger {
  constructor(provider) {
    this.provider = provider
    this.scillaProvider = provider
    this.JsonRpc = new JsonRpc()
  }

  send = async data => {
    this.providerCheck()
    try {
      const payload = this.JsonRpc.toPayload(data.method, data.params)
      const result = await this.provider.send(payload)
      return getResultForData(result)
    } catch (e) {
      throw new Error(e)
    }
  }

  sendAsync(data, callback) {
    this.providerCheck()
    const payload = this.JsonRpc.toPayload(data.method, data.params)
    this.provider.send(payload, async (err, result) => {
      if (err || result.error) {
        const errors = err || result.error
        return callback(errors)
      }
      const promiseResult = await result
      callback(null, getResultForData(promiseResult))
    })
  }

  sendBatch(data, callback) {
    this.providerCheck()
    const payload = this.JsonRpc.toBatchPayload(data)
    this.provider.sendAsync(payload, async (err, results) => {
      if (err) {
        return callback(err)
      }
      const promiseResult = await results
      callback(null, promiseResult)
    })
  }

  sendServer = async (endpoint, data) => {
    this.providerCheck()
    try {
      const result = await this.scillaProvider.sendServer(endpoint, data)
      return result
    } catch (e) {
      throw new Error(e)
    }
  }

  sendAsyncServer(endpoint, data, callback) {
    this.providerCheck()
    this.scillaProvider.sendAsyncServer(endpoint, data, async (err, result) => {
      if (err || result.error) {
        const errors = err || result.error
        return callback(errors)
      }
      const promiseResult = await result
      callback(null, promiseResult)
    })
  }

  sendBatchServer(data, callback) {
    this.providerCheck()
    this.scillaProvider.sendAsync(data, async (err, results) => {
      if (err) {
        return callback(err)
      }
      const promiseResult = await results
      callback(null, promiseResult)
    })
  }

  setProvider(provider) {
    this.provider = provider
  }

  setScillaProvider(provider) {
    this.scillaProvider = provider
  }

  providerCheck() {
    if (!this.provider) {
      InvalidProvider()
      return null
    }
  }
}
