/**
 * @class JsonRpc
 * @description json rpc instance
 * @return {JsonRpc} Json RPC instance
 */
class JsonRpc {
  constructor() {
    /**
     * @var {Number} messageId
     * @memberof JsonRpc.prototype
     * @description message id, default 0
     */
    this.messageId = 0
  }

  /**
   * @function toPayload
   * @memberof JsonRpc.prototype
   * @description convert method and params to payload object
   * @param  {String} method - RPC method
   * @param  {Array<object>} params - params that send to RPC
   * @return {Object} payload object
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
