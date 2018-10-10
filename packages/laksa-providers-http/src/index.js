import axios from 'axios'
import Mitt from 'mitt'

class HttpProvider {
  constructor(url, timeout, user, password, headers) {
    this.url = url || 'http://localhost:4200'
    this.timeout = timeout || 0
    this.user = user || null
    this.password = password || null
    this.headers = headers
    this.request = this.instance()
    this.broadcaster = new Mitt()
  }

  subscribers = new Map()

  instance() {
    const request = axios.create()
    if (this.user && this.password) {
      const AUTH_TOKEN = `Basic ${Buffer.from(`${this.user}:${this.password}`).toString('base64')}`
      request.defaults.headers.common.Authorization = AUTH_TOKEN
    }
    request.defaults.headers.post['Content-Type'] = 'application/json'

    if (this.headers) {
      this.headers.forEach((header) => {
        request.defaults.headers.post[header.name] = header.value
      })
    }
    if (this.timeout) {
      request.defaults.timeout = this.timeout
    }
    return request
  }

  send = async (payload) => {
    const result = await this.requestFunc({ payload })
    return result
  }

  sendServer = async (endpoint, payload) => {
    const result = await this.requestFunc({ endpoint, payload })
    return result
  }

  sendAsync(payload, callback) {
    this.requestFunc({ payload, callback })
  }

  sendAsyncServer(endpoint, payload, callback) {
    this.requestFunc({ endpoint, payload, callback })
  }

  requestFunc({ endpoint, payload, callback }) {
    const dest = endpoint !== null && endpoint !== undefined ? `${this.url}${endpoint}` : this.url
    return this.request
      .post(dest, JSON.stringify(payload))
      .then((response) => {
        const { data, status } = response
        if (data && status >= 200 && status < 400) {
          if (callback === undefined) {
            return data
          } else {
            callback(null, data)
          }
        }
      })
      .catch((err) => {
        if (callback === undefined) {
          return err
        } else {
          callback(err)
        }
      })
  }

  subscribe = (event, subscriber) => {
    const subToken = Symbol('subToken')
    this.subscribers.set(subToken, subscriber)
    return subToken
  }

  unsubscribe = (token) => {
    if (this.subscribers.has(token)) {
      this.subscribers.delete(token)
    }
  }
}

export default HttpProvider
