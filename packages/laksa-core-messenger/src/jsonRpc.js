class JsonRpc {
  constructor() {
    this.messageId = 0
  }

  toPayload = (method, params) => {
    // FIXME: error to be done by shared/errors
    if (!method) throw new Error('jsonrpc method should be specified!')

    // advance message ID
    this.messageId += 1

    return {
      jsonrpc: '2.0',
      id: this.messageId,
      method,
      params: params || []
    }
  }

  toBatchPayload = messages => {
    return messages.map(message => {
      return this.toPayload(message.method, message.params)
    })
  }
}

export default JsonRpc
