/**
 * @function getResultForData
 * @description get result for data by default
 * @param  {Object} data - object get from provider
 * @return {Object} data result or data
 */
export function getResultForData(data) {
  if (data.result) return data.getResult
  if (data.error) return data.getError
  return data.getRaw
}
