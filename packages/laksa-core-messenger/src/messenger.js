import { InvalidProvider } from 'laksa-shared'
import { JsonRpc } from './rpcbuilder'

function getResultForData(data) {
  if (data.error) {
    return data.error
  } else if (data.result) {
    return data.result
  }
  return data
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
      this.provider.middleware.response.use(getResultForData)
      const result = await this.provider.send(payload)
      return result // getResultForData(result)
    } catch (e) {
      throw new Error(e)
    }
  }

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
    this.scillaProvider.sendServer(endpoint, data, async (err, result) => {
      if (err || result.error) {
        const errors = err || result.error
        return callback(errors)
      }
      const promiseResult = await result
      callback(null, promiseResult)
    })
  }

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
