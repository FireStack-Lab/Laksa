import { JsonRpc } from '../src/rpcbuilder'

describe('rpc builder', () => {
  it('should create jsonRPC instance', () => {
    const j = new JsonRpc()
    expect(j.messageId).toEqual(0)
  })
  it('should throw error', () => {
    const j = new JsonRpc()
    try {
      j.toPayload()
    } catch (error) {
      expect(error.message).toEqual('jsonrpc method should be specified!')
    }
  })
  it('should return rpc object', () => {
    const j = new JsonRpc()
    const rpcObject = j.toPayload('Test', 'testparam')
    expect(rpcObject).toEqual({
      jsonrpc: '2.0',
      id: 1,
      method: 'Test',
      params: ['testparam']
    })
  })
  it('should return rpc object with empty array', () => {
    const j = new JsonRpc()
    const rpcObject = j.toPayload('TestEmpty')
    expect(rpcObject).toEqual({
      jsonrpc: '2.0',
      id: 1,
      method: 'TestEmpty',
      params: []
    })
  })
})
