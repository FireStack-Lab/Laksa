import fetch from 'cross-fetch'

// const DEFAULT_TIMEOUT = 120000

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }

export const performRPC = async (request, handler) => {
  const response = await fetch(request.url, {
    method: (request.options && request.options.method) || 'POST',
    body: JSON.stringify(request.payload),
    headers: {
      ...DEFAULT_HEADERS,
      ...((request.options && request.options.headers) || {})
    }
  })
  // return response.json().then(handler)
  return handler(response)
}
