import {
  intToByteArray, intToHexArray, toHex, toBN, strip0x, add0x
} from '../src'
import { basicType, advanceType } from './fixtures'

describe('test transformer', () => {
  it('test intToByteArray', () => {
    expect(intToByteArray(1, 2)).toEqual(['0', '1'])
    expect(intToByteArray(1)).toEqual(['1'])
    expect(intToByteArray('1', 2)).toEqual(['0', '1'])
  })
  it('test intToHexArray', () => {
    expect(intToHexArray(1, 2)).toEqual(['0', '1'])
    expect(intToHexArray(1)).toEqual(['1'])
    expect(intToHexArray('1', 2)).toEqual(['0', '1'])
  })
  it('test toHex', () => {
    expect(toHex(1)).toEqual('0x1')
    expect(toHex(1, true)).toEqual('uint256')
    expect(toHex(-3)).toEqual('-0x3')
    expect(toHex(-3, true)).toEqual('int256')
    expect(toHex('-0x123', true)).toEqual('string')
    expect(toHex('0x123', true)).toEqual('uint256')
    expect(toHex(basicType.text)).toEqual(`0x${basicType.text}`)
    expect(toHex(basicType.text, true)).toEqual('string')
    expect(toHex(basicType.zero)).toEqual('0x0')
    expect(toHex(advanceType.address)).toEqual(`0x${advanceType.address}`)
    expect(toHex(advanceType.address, true)).toEqual('address')
    expect(toHex(basicType.bool)).toEqual('0x01')
    expect(toHex(false)).toEqual('0x00')
    expect(toHex(false, true)).toEqual('bool')
    expect(toHex(basicType.object)).toEqual('0x7b7d')
    expect(toHex(basicType.object, true)).toEqual('string')
    expect(toHex(advanceType.bn)).toEqual('0x7b')
    expect(toHex(advanceType.bn, true)).toEqual('BN')

    try {
      toHex(NaN)
    } catch (error) {
      expect(error.message).toEqual(
        'One of [isAddress,isBoolean,isObject,isString,isNumber,isHex,isBN] has to pass, but we have your arg to be []'
      )
    }
  })
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
      expect(error.message).toEqual(
        'Error: [number-to-bn] while converting number 0.3333333333333333 to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. of "0.3333333333333333"'
      )
    }
    try {
      toBN({})
    } catch (error) {
      expect(error.message).toEqual(
        'Error: [number-to-bn] while converting number {} to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. of "[object Object]"'
      )
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
    expect(strip0x(0)).toEqual('0')
    try {
      strip0x(0.1)
    } catch (error) {
      expect(error.message).toEqual(
        'Error: [number-to-bn] while converting number 0.1 to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. of "0.1"'
      )
    }
    expect(strip0x(0x123)).toEqual('123')
    expect(strip0x('0x0')).toEqual('0')
    expect(strip0x('0x0.1')).toEqual('0.1')
    expect(strip0x('0x123')).toEqual('123')
    expect(strip0x(toBN(0))).toEqual('0')
  })
})
