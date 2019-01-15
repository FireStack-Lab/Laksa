export const MiddlewareType = {
  REQ: 'REQ',
  RES: 'RES'
}

class BaseProvider {
  middleware = {
    request: {
      use: (fn, match = '*') => this.pushMiddleware(fn, MiddlewareType.REQ, match)
    },
    response: {
      use: (fn, match = '*') => this.pushMiddleware(fn, MiddlewareType.RES, match)
    }
  }

  constructor(reqMiddleware = new Map(), resMiddleware = new Map()) {
    this.reqMiddleware = reqMiddleware
    this.resMiddleware = resMiddleware
  }

  pushMiddleware(fn, type, match) {
    if (type !== MiddlewareType.REQ && type !== MiddlewareType.RES) {
      throw new Error('Please specify the type of middleware being added')
    }
    if (type === MiddlewareType.REQ) {
      const current = this.reqMiddleware.get(match) || []
      this.reqMiddleware.set(match, [...current, fn])
    } else {
      const current = this.resMiddleware.get(match) || []
      this.resMiddleware.set(match, [...current, fn])
    }
  }

  getMiddleware(method) {
    const reqFns = []
    const resFns = []

    for (const [key, transformers] of this.reqMiddleware.entries()) {
      if (typeof key === 'string' && key !== '*' && key === method) {
        reqFns.push(...transformers)
      }

      if (key instanceof RegExp && key.test(method)) {
        reqFns.push(...transformers)
      }

      if (key === '*') {
        reqFns.push(...transformers)
      }
    }

    for (const [key, transformers] of this.resMiddleware.entries()) {
      if (typeof key === 'string' && key !== '*' && key === method) {
        resFns.push(...transformers)
      }

      if (key instanceof RegExp && key.test(method)) {
        resFns.push(...transformers)
      }

      if (key === '*') {
        resFns.push(...transformers)
      }
    }

    return [reqFns, resFns]
  }
}

export { BaseProvider }
