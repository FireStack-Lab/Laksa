import { BaseProvider, composeMiddleware, performRPC } from 'laksa-core-provider'

const defaultOptions = {
  method: 'POST',
  timeout: 120000,
  user: null,
  password: null,
  headers: { 'Content-Type': 'application/json' }
}

export default class ProtobufProvider extends BaseProvider {
  constructor(url, options, reqMiddleware = [], resMiddleware = []) {
    super(reqMiddleware, resMiddleware)
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
    const tReq = composeMiddleware(
      ...this.reqMiddleware,
      obj => this.optionsHandler(obj),
      obj => this.endpointHandler(obj, endpoint),
      this.payloadHandler
    )
    const tRes = composeMiddleware(
      ...this.resMiddleware,
      data => this.callbackHandler(data, callback),
      this.responseHandler,
      this.errorHandler
    )

    // FIXME: if the protobuff is due, we have to change the rpcbuilder from messenger as well
    // const payloadObject = { payload }

    const req = tReq(payload)

    return performRPC(req, tRes)
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

  errorHandler(response) {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response
  }

  responseHandler(response) {
    return response.json()
  }

  callbackHandler(data, cb) {
    if (cb) {
      cb(null, data)
    }
    return data
  }
}
