export async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

export const TxStatus = Object.freeze({
  Pending: 'Pending',
  Initialised: 'Initialised',
  Signed: 'Signed',
  Confirmed: 'Confirmed',
  Rejected: 'Rejected'
})
