import { BaseProvider } from '../src'

describe('test base provider', () => {
  it('should make a instance', () => {
    const bp = new BaseProvider()
    expect(bp.reqMiddleware.keys.length).toEqual(0)
    expect(bp.resMiddleware.keys.length).toEqual(0)
  })
  it('should push middleware to all', () => {
    const bp = new BaseProvider()
    const reqMd = data => data
    const reqMd2 = data => JSON.stringify(data)
    bp.middleware.request.use(reqMd)
    bp.middleware.request.use(reqMd2)
    bp.middleware.response.use(reqMd)
    bp.middleware.response.use(reqMd2)
    const [reqFns, resFns] = bp.getMiddleware('*')
    expect(reqFns.length).toEqual(2)
    expect(resFns.length).toEqual(2)
  })
  it('should push middleware', () => {
    const bp = new BaseProvider()
    const reqMd = data => data
    const reqMd2 = data => JSON.stringify(data)
    bp.middleware.request.use(reqMd, 'TestMethod')
    bp.middleware.request.use(reqMd2, 'TestMethod')
    bp.middleware.response.use(reqMd, 'TestMethod')
    bp.middleware.response.use(reqMd2, 'TestMethod')
    const [reqFns, resFns] = bp.getMiddleware('TestMethod')
    expect(reqFns.length).toEqual(2)
    expect(resFns.length).toEqual(2)
  })
  it('should push middleware failed', () => {
    const bp = new BaseProvider()
    try {
      bp.pushMiddleware()
    } catch (error) {
      expect(error.message).toEqual('Please specify the type of middleware being added')
    }
  })
  it('should push middleware', () => {
    const bp = new BaseProvider()
    const reqMd = data => data
    const reqMd2 = data => JSON.stringify(data)
    bp.middleware.request.use(reqMd, new RegExp('TestMethod'))
    bp.middleware.request.use(reqMd2, new RegExp('TestMethod'))
    bp.middleware.response.use(reqMd, new RegExp('TestMethod'))
    bp.middleware.response.use(reqMd2, new RegExp('TestMethod'))
    const [reqFns, resFns] = bp.getMiddleware('TestMethod')
    expect(reqFns.length).toEqual(2)
    expect(resFns.length).toEqual(2)
  })
  it('should push middleware on construct', () => {
    const reqDefault = new Map()
    const resDefault = new Map()

    const bp = new BaseProvider(reqDefault, resDefault)
    expect(bp.reqMiddleware.keys.length).toEqual(0)
    expect(bp.resMiddleware.keys.length).toEqual(0)
  })
})
