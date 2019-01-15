import fetch from 'jest-fetch-mock'
import { performRPC } from '../src/net'
import { fetchRPC } from '../../laksa-providers-http/src/defaultFetch'

describe('test net function', () => {
  afterEach(() => {
    fetch.resetMocks()
    // jest.clearAllTimers()
  })
  it('should test performRPC', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: 'TestNet'
      }
    ].map(res => [JSON.stringify(res)])

    fetch.mockResponses(...responses)
    const request = {
      url: 'https://mock.com',
      payload: {
        id: 1,
        jsonrpc: '2.0',
        method: 'GetNetworkId',
        params: []
      }
    }
    const handler = data => JSON.stringify(data)
    const result = await performRPC(request, handler, fetchRPC)
    expect(result).toEqual(
      '{"id":1,"jsonrpc":"2.0","result":"TestNet","req":{"url":"https://mock.com","payload":{"id":1,"jsonrpc":"2.0","method":"GetNetworkId","params":[]}}}'
    )
  })
  it('should test timeout', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: 'TestNet'
      }
    ].map(res => [JSON.stringify(res)])

    fetch.mockResponses(...responses)

    const timeout = 0
    const request = {
      url: 'https://mock.com',
      payload: {
        id: 1,
        jsonrpc: '2.0',
        method: 'GetNetworkId',
        params: []
      },
      options: {
        timeout
      }
    }
    const handler = data => JSON.stringify(data)
    try {
      await performRPC(request, handler, fetchRPC)
    } catch (error) {
      expect(error.message).toEqual(`request Timeout in ${timeout} ms`)
    }
  })
})
