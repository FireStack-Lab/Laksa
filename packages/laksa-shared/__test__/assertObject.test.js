import { assertObject, transformerArray } from '../src/decorators/assert'
import { BN, Long } from '../../laksa-utils/src'

describe('test assertObject', () => {
  class Tester {
    @assertObject({
      toAddr: ['isAddress', 'required'],
      pubKey: ['isPubkey', 'optional'],
      amount: ['isBN', 'required'],
      gasPrice: ['isBN', 'required'],
      gasLimit: ['isLong', 'required'],
      signature: ['isString', 'optional']
    })
    sendTest({
      toAddr = '0'.repeat(40),
      pubKey = '0'.repeat(66),
      amount = new BN(0),
      gasPrice = new BN(0),
      gasLimit = Long.fromNumber(0),
      signature = '0'.repeat(128)
    }) {
      if (toAddr || pubKey || amount || gasPrice || gasLimit || signature) {
        return true
      }
    }
  }

  it('should test assertObject', () => {
    const tester = new Tester().sendTest({
      toAddr: '0'.repeat(40),
      pubKey: '0'.repeat(66),
      amount: new BN(0),
      gasPrice: new BN(0),
      gasLimit: Long.fromNumber(0),
      signature: '0'.repeat(128)
    })
    expect(tester).toBe(true)
  })
  it('should test transformerArray', () => {
    expect(transformerArray.toBN(1)).toEqual(new BN(1))
    expect(transformerArray.toNumber('123')).toEqual(123)
    expect(transformerArray.toString(123)).toString('123')
  })
})
