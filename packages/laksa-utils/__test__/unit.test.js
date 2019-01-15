import BN from 'bn.js'
import * as denom from '../src/unit'

describe('test unit', () => {
  it('should test numToStr', () => {
    const num = 123
    const bigNum = new BN(123)
    const str = '123'

    const wrongStr = 'ijfkl'
    const wrongSome = []

    expect(denom.numToStr(num)).toEqual('123')
    expect(denom.numToStr(bigNum)).toEqual('123')
    expect(denom.numToStr(str)).toEqual('123')

    try {
      denom.numToStr(wrongStr)
    } catch (error) {
      expect(error.message).toEqual(
        `while converting number to string, invalid number value '${wrongStr}', should be a number matching (^-?[0-9.]+).`
      )
    }
    try {
      denom.numToStr(wrongSome)
    } catch (error) {
      expect(error.message).toEqual(
        `while converting number to string, invalid number value '${wrongSome}' type ${typeof wrongSome}.`
      )
    }
  })
  it('should convert Qa to Zil', () => {
    const qa = new BN(1000000000000)
    const expected = '1'

    expect(denom.fromQa(qa, denom.Units.Zil)).toEqual(expected)
  })

  it('should convert Qa to Li', () => {
    const qa = new BN(1000000)
    const expected = '1'

    expect(denom.fromQa(qa, denom.Units.Li)).toEqual(expected)
  })

  it('should convert Li to Qa', () => {
    const li = new BN(1)
    const expected = new BN(1000000)

    expect(denom.toQa(li, denom.Units.Li).eq(expected)).toBeTruthy()
  })

  it('should convert Zil to Qa', () => {
    const zil = new BN(1)
    const expected = new BN(1000000000000)

    expect(denom.toQa(zil, denom.Units.Zil).eq(expected)).toBeTruthy()
  })

  it('fromQa should should work for negative numbers', () => {
    const qa = new BN(-1000000000000)
    const expected = '-1'

    expect(denom.fromQa(qa, denom.Units.Zil)).toEqual(expected)
  })

  it('toQa should should work for negative numbers', () => {
    const zil = new BN(-1)
    const expected = new BN(-1000000000000)

    expect(denom.toQa(zil, denom.Units.Zil)).toEqual(expected)
  })

  it('should test Unit Class', () => {
    expect(new denom.Unit().unit).toEqual(undefined)
    expect(denom.Unit.from().unit).toEqual(undefined)
    expect(denom.Unit.from('123').unit).toEqual('123')
    expect(
      denom.Unit.from('123')
        .asZil()
        .qa.toString()
    ).toEqual('123000000000000')
    expect(
      denom.Unit.from('123')
        .asLi()
        .qa.toString()
    ).toEqual('123000000')
    expect(
      denom.Unit.from('123')
        .asQa()
        .qa.toString()
    ).toEqual('123')
    expect(
      denom.Unit.from('123')
        .asZil()
        .toZil()
    ).toEqual('123')
    expect(
      denom.Unit.from('123')
        .asLi()
        .toLi()
    ).toEqual('123')
    expect(
      denom.Unit.from('123')
        .asQa()
        .toQa()
        .toString()
    ).toEqual('123')
    expect(
      denom.Unit.from('123')
        .asQa()
        .toQaString()
    ).toEqual('123')
    expect(denom.Unit.Zil('123').toQaString()).toEqual('123000000000000')
    expect(denom.Unit.Li('123').toQaString()).toEqual('123000000')
    expect(denom.Unit.Qa('123').toQaString()).toEqual('123')
  })
  it('fromQa errors', () => {
    try {
      denom.fromQa('baba', 'qa')
    } catch (error) {
      expect(error.message).toEqual('Error: Assertion failed of "[object Object]"')
    }
    try {
      denom.fromQa(new BN(100), 'ba')
    } catch (error) {
      expect(error.message).toEqual('No unit of type ba exists.')
    }
    expect(denom.fromQa(new BN(0), 'qa', { pad: false })).toEqual('0')
  })
  it('toQa errors', () => {
    try {
      denom.toQa('-1', 'qa')
    } catch (error) {
      expect(error.message).toEqual('Cannot convert 1 to Qa.')
    }
    try {
      denom.toQa('100000', 'ba')
    } catch (error) {
      expect(error.message).toEqual('No unit of type ba exists.')
    }
    try {
      denom.toQa('1.00', 'qa')
    } catch (error) {
      expect(error.message).toEqual('Cannot convert 1.00 to Qa.')
    }
    try {
      denom.toQa('100.00.00', 'qa')
    } catch (error) {
      expect(error.message).toEqual('Cannot convert 100.00.00 to Qa.')
    }
    try {
      denom.toQa('.', 'qa')
    } catch (error) {
      expect(error.message).toEqual('Cannot convert . to Qa.')
    }
  })
})
