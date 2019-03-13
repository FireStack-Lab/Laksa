/**
 * @class ResponseMiddleware
 * @description Response middleware of RPC
 * @param  {Object}  ResponseBody - response from rpc
 * @return {ResponseMiddleware} response middleware instance
 */
class ResponseMiddleware {
  constructor(ResponseBody) {
    this.result = ResponseBody.result
    this.error = ResponseBody.error
    this.raw = ResponseBody
  }

  get getResult() {
    return typeof this.result === 'string'
      ? this.result
      : { ...this.result, responseType: 'result' }
  }

  get getError() {
    return typeof this.error === 'string' ? this.error : { ...this.error, responseType: 'error' }
  }

  get getRaw() {
    return { ...this.raw, responseType: 'raw' }
  }
}
export { ResponseMiddleware }
