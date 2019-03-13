// import fetch from 'cross-fetch'

export const DEFAULT_TIMEOUT = 120000

export const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }

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

export const performRPC = async (request, handler, fetcher) => {
  try {
    const response = await _fetch(
      fetcher.requestHandler(request, DEFAULT_HEADERS),
      request.options && request.options.timeout ? request.options.timeout : DEFAULT_TIMEOUT
    )
    return fetcher.responseHandler(response, request, handler)
  } catch (err) {
    throw err
  }
}
