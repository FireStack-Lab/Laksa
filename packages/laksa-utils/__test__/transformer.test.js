import {
  toBN, strip0x, add0x, toLong, Long, pack
} from '../src'

describe('test transformer', () => {
  it('test toBN', () => {
    expect(toBN(1)).toEqual(expect.any(Object))
    expect(toBN(-1)).toEqual(expect.any(Object))
    expect(toBN('1')).toEqual(expect.any(Object))
    expect(toBN(toBN(1))).toEqual(expect.any(Object))

    expect(toBN(1).toNumber()).toEqual(1)
    expect(toBN('1').toNumber()).toEqual(1)
    expect(toBN(toBN(1)).toNumber()).toEqual(1)

    expect(toBN(1).toString()).toEqual('1')
    expect(toBN('1').toString()).toEqual('1')
    expect(toBN(toBN(1)).toString()).toEqual('1')

    try {
      toBN(1 / 3)
    } catch (error) {
      expect(error.message).toEqual('Error: Assertion failed of "[object Object]"')
    }
    try {
      toBN({})
    } catch (error) {
      expect(error.message).toEqual('Error: Assertion failed of "[object Object]"')
    }
  })
  it('test add0x', () => {
    expect(add0x(0)).toEqual('0x0')
    expect(add0x(0.1)).toEqual('0x0.1')
    expect(add0x(0x123)).toEqual('0x291')
    expect(add0x('0')).toEqual('0x0')
    expect(add0x('0.1')).toEqual('0x0.1')
    expect(add0x('0x123')).toEqual('0x123')
    expect(add0x(toBN(0))).toEqual('0x0')
  })
  it('test strip0x', () => {
    expect(strip0x('0x0')).toEqual('0')
    expect(strip0x('0x0.1')).toEqual('0.1')
    expect(strip0x('0x123')).toEqual('123')
    try {
      strip0x(0)
    } catch (error) {
      expect(error.message).toEqual('value has to be String')
    }
  })
  it('test toLong', () => {
    const testNumber = 123
    const testString = '123'
    const testWrong = {}
    expect(toLong(testNumber)).toEqual(Long.fromNumber(123))
    expect(toLong(testString)).toEqual(Long.fromString('123'))
    expect(toLong(testWrong)).toEqual(undefined)
  })
  it('test pack', () => {
    const testA = 1
    const testB = 1
    expect(pack(testA, testB)).toEqual(65537)
    const testWrongA = '1'
    const testWrongB = '2'
    const testExcceedA = 0xfffff
    const testExcceedB = 0xfffff
    try {
      pack(testWrongA, testWrongB)
    } catch (error) {
      expect(error.message).toEqual('a and b must be number')
    }
    try {
      pack(testExcceedA, testExcceedB)
    } catch (error) {
      expect(error.message).toEqual('Both a and b must be 16 bits or less')
    }
  })
})
