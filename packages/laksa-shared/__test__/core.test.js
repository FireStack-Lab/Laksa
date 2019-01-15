import { Core } from '../src/core'

describe('test Core', () => {
  it('should test Core', () => {
    const newCore = new Core('messenger', 'signer', 'status')

    expect(newCore.messenger).toEqual('messenger')
    expect(newCore.signer).toEqual('signer')
    expect(newCore.status).toEqual('status')
    newCore.setMessenger('newM')
    expect(newCore.getMessenger()).toEqual('newM')
    newCore.setStatus('newSt')
    expect(newCore.getStatus()).toEqual('newSt')
    newCore.setSigner('newSn')
    expect(newCore.getSigner()).toEqual('newSn')
  })
})
