/**
 * @function sleep
 * @param  {Number} ms - miliSeconds
 * @return {Promise<Function>} {description}
 */
export const sleep = async ms =>
  new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })

export const TxStatus = Object.freeze({
  Pending: 'Pending',
  Initialised: 'Initialised',
  Signed: 'Signed',
  Confirmed: 'Confirmed',
  Rejected: 'Rejected'
})
