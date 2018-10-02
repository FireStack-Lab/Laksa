import { InvalidProvider } from 'laksa-shared'
import JsonRpc from './jsonRpc'

function getResultForData(data) {
  return data.error ? data.error : data.message ? data : data.result
}

class Messanger {
  constructor(provider) {
    this.provider = provider
    this.scillaProvider = provider
    this.JsonRpc = new JsonRpc()
  }

  send = async (data) => {
    this.providerCheck()
    try {
      const payload = this.JsonRpc.toPayload(data.method, data.params)
      const result = await this.provider.send(payload)
      return getResultForData(result)
    } catch (e) {
      throw new Error(e)
    }
  }

  sendAsync = (data, callback) => {
    this.providerCheck()
    const payload = this.JsonRpc.toPayload(data.method, data.params)
    this.provider.sendAsync(payload, (err, result) => {
      if (err || result.error) {
        const errors = err || result.error
        return callback(errors)
      }
      callback(null, getResultForData(result))
    })
  }

  sendBatch = (data, callback) => {
    this.providerCheck()
    const payload = this.JsonRpc.toBatchPayload(data)
    this.provider.sendAsync(payload, (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, results)
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

  sendAsyncServer = (endpoint, data, callback) => {
    this.providerCheck()
    this.scillaProvider.sendAsyncServer(endpoint, data, (err, result) => {
      if (err || result.error) {
        const errors = err || result.error
        return callback(errors)
      }
      callback(null, result)
    })
  }

  sendBatchServer = (data, callback) => {
    this.providerCheck()
    this.scillaProvider.sendAsync(data, (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, results)
    })
  }

  setProvider = (provider) => {
    this.provider = provider
  }

  setScillaProvider = (provider) => {
    this.scillaProvider = provider
  }

  providerCheck = () => {
    if (!this.provider) {
      InvalidProvider()
      return null
    }
  }
}

export default Messanger
