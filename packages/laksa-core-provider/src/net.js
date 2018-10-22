import fetch from 'cross-fetch'

const DEFAULT_TIMEOUT = 120000

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }

function _fetch(fetchPromise, timeout) {
  let abortFn = null

  const abortPromise = new Promise((resolve, reject) => {
    abortFn = () => reject(new Error(`request Timeout in ${timeout} ms`))
  })
  const abortablePromise = Promise.race([fetchPromise, abortPromise])

  setTimeout(() => {
    abortFn()
  }, timeout)

  return abortablePromise
}

export const performRPC = async (request, handler) => {
  const response = await _fetch(
    fetch(request.url, {
      method: request.options && request.options.method ? request.options.method : 'POST',
      body: JSON.stringify(request.payload),
      headers: {
        ...DEFAULT_HEADERS,
        ...(request.options && request.options.headers ? request.options.headers : {})
      }
    }),
    request.options && request.options.timeout ? request.options.timeout : DEFAULT_TIMEOUT
  )
  return handler(response)
}
