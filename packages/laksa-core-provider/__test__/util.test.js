import { composeMiddleware } from '../src/util'

describe('test composeMiddleware', () => {
  it('should test composing', () => {
    const funA = data => ({ ...data, props: 'props' })
    const funB = data => JSON.stringify(data)
    const testObj = { foo: 'bar' }
    const c1 = composeMiddleware()
    const c2 = composeMiddleware(funA)
    const c3 = composeMiddleware(funB, funA)
    expect(c1(testObj)).toEqual({ foo: 'bar' })
    expect(c2(testObj)).toEqual({ foo: 'bar', props: 'props' })
    expect(c3(testObj)).toEqual(JSON.stringify({ foo: 'bar', props: 'props' }))
  })
})
