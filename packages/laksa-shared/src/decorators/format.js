/* eslint-disable no-param-reassign */
export const format = (input, output) => (target, key, descriptor) => {
  const method = descriptor.value
  descriptor.value = (...inArgs) => {
    const rawOutput = method(input(...inArgs))
    return output(rawOutput)
  }
}
