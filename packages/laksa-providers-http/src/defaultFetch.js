import fetch from 'cross-fetch'

export const fetchRPC = {
  requestHandler: (request, headers) =>
    fetch(request.url, {
      method: request.options && request.options.method ? request.options.method : 'POST',
      cache: 'no-cache',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(request.payload),
      headers: {
        ...headers,
        ...(request.options && request.options.headers ? request.options.headers : {})
      }
    }),
  responseHandler: (response, request, handler) =>
    response
      .json()
      .then(body => {
        return { ...body, req: request }
      })
      .then(handler)
}
