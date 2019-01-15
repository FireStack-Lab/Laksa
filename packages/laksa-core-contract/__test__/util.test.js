import * as util from '../src/validate'
import { BN } from '../../laksa-utils/src'

describe('test contract util', () => {
  it('should test validator', () => {
    expect(util.validate('ByStr20', `0x${'0'.repeat(40)}`)).toBeTruthy()
    expect(util.validate('String', 'hello')).toBeTruthy()
    expect(util.validate('Uint32', 14)).toBeTruthy()
    expect(util.validate('Int32', 4)).toBeTruthy()
    expect(util.validate('BNum', new BN(100))).toBeTruthy()

    expect(util.transform('ByStr20', `0x${'0'.repeat(40)}`)).toEqual(
      '0x0000000000000000000000000000000000000000'
    )
    expect(util.transform('Uint32', 14)).toEqual(14)
    expect(util.transform('String', 'abc')).toEqual('abc')
    expect(util.transform('BNum', '10')).toEqual(10)
    expect(util.transform('Int32', 4)).toEqual(4)
    try {
      util.transform('Int32', 'a')
    } catch (error) {
      expect(error.message).toEqual('Cannot transform')
    }
  })
})
