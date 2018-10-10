/* eslint-disable no-param-reassign */

/**
 * sign
 *
 * This decorates a method by attempting to sign the first argument of the
 * intercepted method.
 *
 * @param {T} target
 * @param {K} key
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor | undefined}
 */

export const sign = (target, key, descriptor) => {
  const original = descriptor.value
  async function interceptor(arg) {
    if (original && arg.bytes) {
      const signed = await this.signer.sign(arg)
      return original.call(this, signed)
    }
  }

  descriptor.value = interceptor
  return descriptor
}
