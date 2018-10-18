export const composeMiddleware = (...fns) => {
  if (fns.length === 0) {
    return arg => arg
  }

  if (fns.length === 1) {
    return fns[0]
  }

  return fns.reduce((a, b) => arg => a(b(arg)))
}
