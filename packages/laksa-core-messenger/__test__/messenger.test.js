import fetch from 'jest-fetch-mock'

import { Messenger } from '../src/messenger'
import { HttpProvider } from '../../laksa-providers-http/src'
import { getResultForData } from '../src/util'
import { ResponseMiddleware } from '../src/responseMiddleware'
import config from '../../laksa-core/src/config'

describe('test messenger', () => {
  afterEach(() => {
    fetch.resetMocks()
    // jest.clearAllTimers()
  })
  it('should test messenger Instance', () => {
    const messenger = new Messenger()
    expect(messenger.JsonRpc.messageId).toEqual(0)
  })
  it('should test if provider exist', () => {
    const messenger = new Messenger()
    const provider = new HttpProvider('https://api.zilliqa.com')
    const scillaProvider = new HttpProvider('https://scilla-runner.zilliqa.com')
    try {
      messenger.providerCheck()
    } catch (error) {
      expect(error.message).toEqual('Provider not set or invalid')
    }
    messenger.setProvider(provider)
    expect(messenger.provider.url).toEqual('https://api.zilliqa.com')
    messenger.setScillaProvider(scillaProvider)
    expect(messenger.scillaProvider.url).toEqual('https://scilla-runner.zilliqa.com')
    expect(messenger.providerCheck()).toEqual(undefined)
  })
  it('should setTransactionVersion', () => {
    const local = new HttpProvider('http://localhost:4200')
    const testnet = new HttpProvider('https://api.zilliqa.com')
    const staging = new HttpProvider('https://staging-api.aws.z7a.xyz')
    const mainnet = new HttpProvider('https://mainnet.zilliqa.com')
    const anynet = new HttpProvider('https://example.com')
    const messenger = new Messenger(local, config)
    // const scillaProvider = new HttpProvider('https://scilla-runer.zilliqa.com')
    messenger.setProvider(local)
    expect(messenger.setTransactionVersion(1)).toEqual(196609)
    messenger.setProvider(testnet)
    expect(messenger.setTransactionVersion(1)).toEqual(65537)
    messenger.setProvider(staging)
    expect(messenger.setTransactionVersion(1)).toEqual(4128769)
    messenger.setProvider(mainnet)
    expect(messenger.setTransactionVersion(1)).toEqual(65537)
    messenger.setProvider(anynet)
    expect(messenger.setTransactionVersion(1)).toEqual(65537)
  })
  it('should send scilla provider', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: 888,
          nonce: 1
        }
      }
    ].map(res => [JSON.stringify(res)])

    fetch.mockResponses(...responses)
    const messenger = new Messenger()
    const provider = new HttpProvider('https://mock.com')
    const scillaProvider = new HttpProvider('https://mock.com')
    messenger.setProvider(provider)
    messenger.setScillaProvider(scillaProvider)
    const res = await messenger.sendServer('/contract/check', { code: '' })
    expect(res).toEqual({
      id: 1,
      jsonrpc: '2.0',
      req: {
        options: {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          password: null,
          timeout: 120000,
          user: null
        },
        payload: { code: '' },
        url: 'https://mock.com/contract/check'
      },
      result: { balance: 888, nonce: 1 }
    })
  })
  it('should setReqmiddleware', () => {
    const messenger = new Messenger()
    const provider = new HttpProvider('https://api.zilliqa.com')
    const scillaProvider = new HttpProvider('https://scilla-runner.zilliqa.com')
    messenger.setProvider(provider)
    messenger.setScillaProvider(scillaProvider)
    messenger.setReqMiddleware(data => JSON.stringify(data), 'testMethod')
    const mid = messenger.provider.reqMiddleware.get('testMethod')[0]
    expect(mid({ foo: 'bar' })).toEqual(JSON.stringify({ foo: 'bar' }))
  })

  it('should getResultForData', () => {
    const raw = new ResponseMiddleware({ foo: 'bar' })
    expect(getResultForData(raw)).toEqual({ foo: 'bar', responseType: 'raw' })
    const resultString = new ResponseMiddleware({ result: 'bar' })
    expect(getResultForData(resultString)).toEqual('bar')
    const resultObject = new ResponseMiddleware({ result: { foo: 'bar' } })
    expect(getResultForData(resultObject)).toEqual({ foo: 'bar', responseType: 'result' })
    const errorString = new ResponseMiddleware({ error: 'bar' })
    expect(getResultForData(errorString)).toEqual('bar')
    const errorObject = new ResponseMiddleware({ error: { foo: 'bar' } })
    expect(getResultForData(errorObject)).toEqual({ foo: 'bar', responseType: 'error' })
  })
})
