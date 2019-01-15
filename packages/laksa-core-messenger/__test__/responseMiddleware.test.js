import { ResponseMiddleware } from '../src/responseMiddleware'

describe('ResponseMiddleware', () => {
  it('should make a response middlewareInstance', () => {
    const Res = new ResponseMiddleware({
      result: 'r',
      error: 'e'
    })
    expect(Res.error).toEqual('e')
    expect(Res.result).toEqual('r')
    expect(Res.raw).toEqual({
      result: 'r',
      error: 'e'
    })
    expect(Res.getError).toEqual('e')
    expect(Res.getResult).toEqual('r')
    expect(Res.getRaw).toEqual({
      result: 'r',
      error: 'e',
      responseType: 'raw'
    })
  })
  it('should make a response middlewareInstance with object', () => {
    const Res = new ResponseMiddleware({
      result: { foo: 'bar' },
      error: { baz: 'noz' }
    })
    expect(Res.result).toEqual({ foo: 'bar' })
    expect(Res.error).toEqual({ baz: 'noz' })
    expect(Res.raw).toEqual({
      result: { foo: 'bar' },
      error: { baz: 'noz' }
    })
    expect(Res.getResult).toEqual({ foo: 'bar', responseType: 'result' })
    expect(Res.getError).toEqual({ baz: 'noz', responseType: 'error' })
    expect(Res.getRaw).toEqual({
      result: { foo: 'bar' },
      error: { baz: 'noz' },
      responseType: 'raw'
    })
  })
})
