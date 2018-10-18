import { BaseProvider, composeMiddleware, performRPC } from 'laksa-core-provider'

export default class ProtobufProvider extends BaseProvider {
  constructor(url, reqMiddleware = [], resMiddleware = []) {
    super(reqMiddleware, resMiddleware)
    this.url = url || 'http://localhost:4200'
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

  errorHandler(response) {
    if (!response.ok) {
      throw Error(response.statusText)
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
