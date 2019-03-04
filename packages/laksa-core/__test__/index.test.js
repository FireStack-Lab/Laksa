import fetch from 'jest-fetch-mock'
import Laksa from '../src'

describe('test Laksa', () => {
  afterEach(() => {
    fetch.resetMocks()
  })
  it('should test laksa', async () => {
    const laksa = new Laksa('https://api.zilliqa.com')
    laksa.setScillaProvider({ url: 'https://scilla-runner.zilliqa.com' })

    expect(laksa.version).toBeTruthy()
    expect(laksa.isConnected).toBeTruthy()
    laksa.setNodeProvider({ url: 'http://mock.com' })
    expect(laksa.currentProvider.node.url).toEqual('http://mock.com')
    expect(laksa.currentProvider.scilla.url).toEqual('https://scilla-runner.zilliqa.com')
    const provider = new laksa.Modules.HttpProvider('http://temp.com')
    laksa.setProvider(provider)
    laksa.setProvider('http://temp.com')
    try {
      laksa.setProvider(null)
    } catch (error) {
      expect(error.message).toEqual('provider should be HttpProvider or url string')
    }

    expect(laksa.currentProvider.node.url).toEqual('http://temp.com')
    expect(laksa.getProvider().node.url).toEqual('http://temp.com')
    expect(laksa.getDefaultAccount()).toEqual(undefined)
    laksa.wallet.createAccount()
    expect(laksa.getDefaultAccount()).toBeTruthy()
    expect(laksa.getLibraryVersion()).toBeTruthy()
    const lll = new Laksa()
    lll.register({
      name: 'HP',
      pkg: laksa.Modules.HttpProvider
    })
    expect(lll.currentProvider.node.url).toEqual('http://localhost:4201')
    expect(lll.getNetworkSetting().Default.CHAIN_ID).toEqual(0)
  })
})
