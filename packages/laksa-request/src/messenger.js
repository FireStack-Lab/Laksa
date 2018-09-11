import { InvalidProvider } from 'laksa-shared'
import JsonRpc from './jsonRpc'

class Messanger {
  constructor(provider) {
    this.provider = provider
    this.JsonRpc = new JsonRpc()
  }

  send = async (data) => {
    if (!this.provider) {
      InvalidProvider()
      return null
    }
    const payload = this.JsonRpc.toPayload(data.method, data.params)
    const result = await this.provider.send(payload)
    return result
  }

  sendAsync = (data, callback) => {
    if (!this.provider) {
      InvalidProvider()
      return null
    }

    const payload = this.JsonRpc.toPayload(data.method, data.params)
    this.provider.sendAsync(payload, (err, result) => {
      if (err) {
        return callback(err)
      }
      callback(null, result)
    })
  }

  sendBatch = (data, callback) => {
    if (!this.provider) {
      InvalidProvider()
      return null
    }

    const payload = this.JsonRpc.toBatchPayload(data)

    this.provider.sendAsync(payload, (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(err, results)
    })
  }

  sendServer = async (endpoint, data) => {
    if (!this.provider) {
      InvalidProvider()
      return null
    }
    // const payload = this.JsonRpc.toPayload(data.method, data.params)
    const result = await this.provider.sendServer(endpoint, data)
    return result
  }

  sendAsyncServer = (endpoint, data, callback) => {
    if (!this.provider) {
      InvalidProvider()
      return null
    }
    // const payload = this.JsonRpc.toPayload(data.method, data.params)
    this.provider.sendAsyncServer(endpoint, data, (err, result) => {
      if (err) {
        return callback(err)
      }
      callback(null, result)
    })
  }

  sendBatchServer = (data, callback) => {
    if (!this.provider) {
      InvalidProvider()
      return null
    }
    // const payload = this.JsonRpc.toBatchPayload(data)
    this.provider.sendAsync(data, (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(err, results)
    })
  }

  setProvider = (provider) => {
    this.provider = provider
  }
}

export default Messanger
