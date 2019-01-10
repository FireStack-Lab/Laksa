/**
 * Adapted from https://github.com/ethjs/ethjs-unit/blob/master/src/index.js
 */
import BN from 'bn.js'
import { isBN } from './generator'

export const Units = Object.freeze({
  Zil: 'zil',
  Li: 'li',
  Qa: 'qa'
})

const DEFAULT_OPTIONS = {
  pad: false
}

export const unitMap = new Map([
  [Units.Qa, '1'],
  [Units.Li, '1000000'], // 1e6 qa
  [Units.Zil, '1000000000000'] // 1e12 qa
])

export const numToStr = input => {
  if (typeof input === 'string') {
    if (!input.match(/^-?[0-9.]+$/)) {
      throw new Error(
        `while converting number to string, invalid number value '${input}', should be a number matching (^-?[0-9.]+).`
      )
    }
    return input
  } else if (typeof input === 'number') {
    return String(input)
  } else if (BN.isBN(input)) {
    return input.toString(10)
  }

  throw new Error(
    `while converting number to string, invalid number value '${input}' type ${typeof input}.`
  )
}

export const fromQa = (qa, unit, options = DEFAULT_OPTIONS) => {
  let qaBN = qa
  if (!isBN(qa)) {
    try {
      qaBN = new BN(qa)
    } catch (error) {
      throw Error(error)
    }
  }

  if (unit === 'qa') {
    return qaBN.toString(10)
  }

  const baseStr = unitMap.get(unit)

  if (!baseStr) {
    throw new Error(`No unit of type ${unit} exists.`)
  }

  const base = new BN(baseStr, 10)
  const baseNumDecimals = baseStr.length - 1

  let fraction = qaBN
    .abs()
    .mod(base)
    .toString(10)

  // prepend 0s to the fraction half
  while (fraction.length < baseNumDecimals) {
    fraction = `0${fraction}`
  }

  if (!options.pad) {
    /* eslint-disable prefer-destructuring */
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1]
  }

  const whole = qaBN.div(base).toString(10)

  return fraction === '0' ? `${whole}` : `${whole}.${fraction}`
}

export const toQa = (input, unit) => {
  let inputStr = numToStr(input)
  const baseStr = unitMap.get(unit)

  if (!baseStr) {
    throw new Error(`No unit of type ${unit} exists.`)
  }

  const baseNumDecimals = baseStr.length - 1
  const base = new BN(baseStr, 10)

  // Is it negative?
  const isNegative = inputStr.substring(0, 1) === '-'
  if (isNegative) {
    inputStr = inputStr.substring(1)
  }

  if (inputStr === '.') {
    throw new Error(`Cannot convert ${inputStr} to Qa.`)
  }

  // Split it into a whole and fractional part
  const comps = inputStr.split('.') // eslint-disable-line
  if (comps.length > 2) {
    throw new Error(`Cannot convert ${inputStr} to Qa.`)
  }

  let [whole, fraction] = comps

  if (!whole) {
    whole = '0'
  }
  if (!fraction) {
    fraction = '0'
  }
  if (fraction.length > baseNumDecimals) {
    throw new Error(`Cannot convert ${inputStr} to Qa.`)
  }

  while (fraction.length < baseNumDecimals) {
    fraction += '0'
  }

  const wholeBN = new BN(whole)
  const fractionBN = new BN(fraction)
  let wei = wholeBN.mul(base).add(fractionBN)

  if (isNegative) {
    wei = wei.neg()
  }

  return new BN(wei.toString(10), 10)
}

export class Unit {
  static from(str) {
    return new Unit(str)
  }

  constructor(str) {
    this.unit = str
  }

  asZil() {
    this.qa = toQa(this.unit, Units.Zil)
    return this
  }

  asLi() {
    this.qa = toQa(this.unit, Units.Li)
    return this
  }

  asQa() {
    this.qa = new BN(this.unit)
    return this
  }

  toQa() {
    return this.qa
  }

  toLi() {
    return fromQa(this.qa, Units.Li)
  }

  toZil() {
    return fromQa(this.qa, Units.Zil)
  }

  toQaString() {
    return this.qa.toString()
  }
}
