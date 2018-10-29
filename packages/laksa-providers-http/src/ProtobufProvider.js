import { BaseProvider, composeMiddleware, performRPC } from 'laksa-core-provider'

const defaultOptions = {
  method: 'POST',
  timeout: 120000,
  user: null,
  password: null,
  headers: { 'Content-Type': 'application/json' }
}

export default class ProtobufProvider extends BaseProvider {
  constructor(url, options) {
    super()
    this.url = url || 'http://localhost:4200'
    if (options) {
      this.options = {
        method: options.method || defaultOptions.method,
        timeout: options.timeout || defaultOptions.timeout,
        user: options.user || defaultOptions.user,
        password: options.password || defaultOptions.password,
        headers: options.headers || defaultOptions.headers
      }
    } else {
      this.options = defaultOptions
    }
  }

  send(payload, callback) {
    return this.requestFunc({ payload, callback })
  }

  sendServer(endpoint, payload, callback) {
    return this.requestFunc({ endpoint, payload, callback })
  }

  requestFunc({ endpoint, payload, callback }) {
    const [tReq, tRes] = this.getMiddleware(payload.method)
    const reqMiddleware = composeMiddleware(
      ...tReq,
      obj => this.optionsHandler(obj),
      obj => this.endpointHandler(obj, endpoint),
      this.payloadHandler
    )
    const resMiddleware = composeMiddleware(data => this.callbackHandler(data, callback), ...tRes)

    const req = reqMiddleware(payload)

    return performRPC(req, resMiddleware)
  }

  payloadHandler(payload) {
    return { payload }
  }

  endpointHandler(obj, endpoint) {
    return Object.assign({}, obj, {
      url: endpoint !== null && endpoint !== undefined ? `${this.url}${endpoint}` : this.url
    })
  }

  optionsHandler(obj) {
    if (this.options.user && this.options.password) {
      const AUTH_TOKEN = `Basic ${Buffer.from(
        `${this.options.user}:${this.options.password}`
      ).toString('base64')}`
      this.options.headers.Authorization = AUTH_TOKEN
    }

    return Object.assign({}, obj, { options: this.options })
  }

  callbackHandler(data, cb) {
    if (cb) {
      cb(null, data)
    }
    return data
  }
}
