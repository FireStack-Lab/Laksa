import { InvalidProvider } from 'laksa-shared'
import JsonRpc from './jsonRpc'

class Messanger {
  constructor(provider) {
    this.provider = provider
    this.JsonRpc = new JsonRpc()
  }

  send = async (data) => {
    this.providerCheck()
    const payload = this.JsonRpc.toPayload(data.method, data.params)
    const result = await this.provider.send(payload)
    return result
  }

  sendAsync = (data, callback) => {
    this.providerCheck()
    const payload = this.JsonRpc.toPayload(data.method, data.params)
    this.provider.sendAsync(payload, (err, result) => {
      if (err) {
        return callback(err)
      }
      callback(null, result)
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
    const result = await this.provider.sendServer(endpoint, data)
    return result
  }

  sendAsyncServer = (endpoint, data, callback) => {
    this.providerCheck()
    this.provider.sendAsyncServer(endpoint, data, (err, result) => {
      if (err) {
        return callback(err)
      }
      callback(null, result)
    })
  }

  sendBatchServer = (data, callback) => {
    this.providerCheck()
    this.provider.sendAsync(data, (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, results)
    })
  }

  setProvider = (provider) => {
    this.provider = provider
  }

  providerCheck = () => {
    if (!this.provider) {
      InvalidProvider()
      return null
    }
  }
}

export default Messanger
