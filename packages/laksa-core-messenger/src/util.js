/**
 * @function getResultForData
 * @param  {object} data {object get from provider}
 * @return {object} {data result or data}
 */
export function getResultForData(data) {
  if (data.result) return data.getResult
  if (data.error) return data.getError
  return data.getRaw
}
