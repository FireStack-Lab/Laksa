const MiddlewareType = {
  REQ: Symbol('REQ'),
  RES: Symbol('RES')
}

export default class BaseProvider {
  reqMiddleware

  resMiddleware

  middleware = {
    request: {
      use: fn => this.pushMiddleware(fn, MiddlewareType.REQ)
    },
    response: {
      use: fn => this.pushMiddleware(fn, MiddlewareType.RES)
    }
  }

  constructor(reqMiddleware = [], resMiddleware = []) {
    this.reqMiddleware = reqMiddleware
    this.resMiddleware = resMiddleware
  }

  pushMiddleware(fn, type) {
    if (type === MiddlewareType.REQ) {
      this.reqMiddleware = [...this.reqMiddleware, fn]
    } else {
      this.reqMiddleware = [...this.resMiddleware, fn]
    }
  }
}
