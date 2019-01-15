import { sleep } from '../src/util'

// jest.useFakeTimers()
jest.useRealTimers()
describe('test util', () => {
  jest.setTimeout(5000)
  it('should test sleep', async () => {
    let ap = 1
    await sleep(0)
    await sleep()

    ap += 1
    expect(ap).toEqual(2)
  })
})
