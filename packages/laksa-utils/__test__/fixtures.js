import * as util from '../src'

export const basicType = {
  zero: 0,
  float: 0.1,
  text: 'testString',
  jsonString:
    '{"name":"laksa-utils","version":"0.0.48","description":"laksa-utils for webz.js","main":"index.js","browser":"lib/index.js","keywords":["laksa","webz","web3","ethereum"],"author":"neeboo","license":"ISC","gitHead":"437d52fc2ede7a3294d22cc177e1076c6cacb9a0","dependencies":{"bn.js":"^4.11.8","number-to-bn":"^1.7.0","utf8":"^3.0.0","valid-url":"^1.0.9"}}',
  hexNumber: 0x123,
  hexString: '0x123',
  bool: true,
  undefined,
  null: null,
  function: () => {},
  array: [1, 2, 3],
  object: {}
}

export const advanceType = {
  privateKey: '97d2d3a21d829800eeb01aa7f244926f993a1427d9ba79d9dc3bf14fe04d9e37',
  publicKey: '028fe48b60c4511f31cf58906ddaa8422725d9313d4b994fab598d2cf220146228',
  address: '84fece7d1f5629bc728c956ffd313dd0c3ac8f17',
  hexAddress: '0x84fece7d1f5629bc728c956ffd313dd0c3ac8f17',
  checkSumAddress: '0x84fece7d1f5629Bc728c956Ffd313dD0C3AC8f17',
  hex: '0x8423',
  hash: 'F5A5FD42D16A20302798EF6ED309979B43003D2320D9F0E8EA9831A92759FB4B',
  bn: util.toBN(123),
  uint: 14,
  byStrX: '0x84fece7d1f5629bc728c956ffd313dd0c3ac8f17',
  url: 'https://www.zilliqa.com',
  long: util.Long.fromNumber(123)
}
