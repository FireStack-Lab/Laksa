class ResponseMiddleware {
  constructor(ResponseBody) {
    this.result = ResponseBody.result
    this.error = ResponseBody.error
    this.raw = ResponseBody
  }

  get result() {
    return this.result
  }

  get error() {
    return this.error
  }

  get raw() {
    return this.raw
  }
}
export { ResponseMiddleware }
