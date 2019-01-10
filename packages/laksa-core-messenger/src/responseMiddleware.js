class ResponseMiddleware {
  constructor(ResponseBody) {
    this.result = ResponseBody.result
    this.error = ResponseBody.error
    this.raw = ResponseBody
  }

  get getResult() {
    return { ...this.result, responseType: 'result' }
  }

  get getError() {
    return { ...this.error, responseType: 'error' }
  }

  get getRaw() {
    return { ...this.raw, responseType: 'raw' }
  }
}
export { ResponseMiddleware }
