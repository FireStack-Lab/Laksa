class JsonRpc {
  constructor() {
    this.messageId = 0
  }

  /**
   * @function {toPayload}
   * @param  {string} method {RPC method}
   * @param  {Array<object>} params {params that send to RPC}
   * @return {object} {payload object}
   */
  toPayload = (method, params) => {
    // FIXME: error to be done by shared/errors
    if (!method) throw new Error('jsonrpc method should be specified!')

    // advance message ID
    this.messageId += 1

    return {
      jsonrpc: '2.0',
      id: this.messageId,
      method,
      params: params !== undefined ? [params] : []
    }
  }
}

export { JsonRpc }
