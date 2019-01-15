import {
  BaseProvider,
  composeMiddleware,
  performRPC,
  DEFAULT_TIMEOUT,
  DEFAULT_HEADERS
} from 'laksa-core-provider'

import { fetchRPC } from './defaultFetch'

const defaultOptions = {
  method: 'POST',
  timeout: DEFAULT_TIMEOUT,
  headers: DEFAULT_HEADERS,
  user: null,
  password: null
}

class HttpProvider extends BaseProvider {
  constructor(url, options, fetcher) {
    super()
    this.url = url || 'http://localhost:4200'
    this.fetcher = fetcher || fetchRPC
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

  /**
   * @function {send}
   * @param  {object} payload  {payload object}
   * @param  {function} callback {callback function}
   * @return {function} {to requestFunc}
   */
  send(payload, callback) {
    return this.requestFunc({ payload, callback })
  }

  /**
   * @function {sendServer}
   * @param  {string} endpoint {endpoint to the server}
   * @param  {object} payload  {payload object}
   * @param  {function} callback {callback function}
   * @return {function} {to requestFunc}
   */
  sendServer(endpoint, payload, callback) {
    return this.requestFunc({ endpoint, payload, callback })
  }

  /**
   * @function {requestFunc}
   * @param  {string} endpoint {endpoint to the server}
   * @param  {object} payload  {payload object}
   * @param  {function} callback {callback function}
   * @return {function} {performRPC call from laksa-core-provider}
   */
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

    return performRPC(req, resMiddleware, this.fetcher)
  }

  /**
   * @function {payloadHandler}
   * @param  {object} payload {payload object}
   * @return {object} {to payload object}
   */
  payloadHandler(payload) {
    return { payload }
  }

  /**
   * @function {endpointHandler}
   * @param  {object} obj      {payload object}
   * @param  {string} endpoint {add the endpoint to payload object}
   * @return {object} {assign a new object}
   */
  endpointHandler(obj, endpoint) {
    return Object.assign({}, obj, {
      url: endpoint !== null && endpoint !== undefined ? `${this.url}${endpoint}` : this.url
    })
  }

  /**
   * @function {optionsHandler}
   * @param  {object} obj {options object}
   * @return {object} {assign a new option object}
   */
  optionsHandler(obj) {
    if (this.options.user && this.options.password) {
      const AUTH_TOKEN = `Basic ${Buffer.from(
        `${this.options.user}:${this.options.password}`
      ).toString('base64')}`
      this.options.headers.Authorization = AUTH_TOKEN
    }

    return Object.assign({}, obj, { options: this.options })
  }

  /**
   * @function {callbackHandler}
   * @param  {object} data {from server}
   * @param  {function} cb   {callback function}
   * @return {object|function} {return object or callback function}
   */
  callbackHandler(data, cb) {
    if (cb) {
      cb(null, data)
    }
    return data
  }

  subscribe() {
    throw new Error('HTTPProvider does not support subscriptions.')
  }

  unsubscribe() {
    throw new Error('HTTPProvider does not support subscriptions.')
  }
}

export { HttpProvider }
