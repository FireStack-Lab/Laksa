export class Core {
  constructor(messenger, signer) {
    this.messenger = messenger
    this.signer = signer
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
}
