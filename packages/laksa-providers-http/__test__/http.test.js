import { HttpProvider } from '../src/HttpProvider'

describe('test HttpProvider', () => {
  it('should make instance default', () => {
    const provider = new HttpProvider(undefined, {})
    expect(provider.options.method).toEqual('POST')
  })
  it('should make instance', () => {
    const options = {
      method: 'POST',
      timeout: 300,
      headers: { 'Content-Type': 'application/json' },
      user: 'foo',
      password: 'bar'
    }
    const provider = new HttpProvider(undefined, options)

    expect(provider.url).toEqual('http://localhost:4200')
    expect(provider.optionsHandler({ test: 'test' })).toEqual({
      test: 'test',
      options: {
        method: 'POST',
        timeout: 300,
        user: 'foo',
        password: 'bar',
        headers: { 'Content-Type': 'application/json', Authorization: 'Basic Zm9vOmJhcg==' }
      }
    })

    provider.callbackHandler({ foo: 'bar' }, (err, data) => {
      const result = JSON.stringify(data)
      expect(result).toEqual(JSON.stringify({ foo: 'bar' }))
    })

    try {
      provider.subscribe()
    } catch (error) {
      expect(error.message).toEqual('HTTPProvider does not support subscriptions.')
    }
    try {
      provider.unsubscribe()
    } catch (error) {
      expect(error.message).toEqual('HTTPProvider does not support subscriptions.')
    }
  })
})
