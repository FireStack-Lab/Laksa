export class Core {
  constructor(messenger, signer, status) {
    this.messenger = messenger
    this.signer = signer
    this.status = status
  }

  setMessenger(p) {
    this.messenger = p
  }

  getMessenger() {
    return this.messenger
  }

  setSigner(s) {
    this.signer = s
  }

  getSigner() {
    return this.signer
  }

  setStatus(s) {
    this.status = s
  }

  getStatus() {
    return this.status
  }
}
