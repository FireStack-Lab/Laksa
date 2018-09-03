import Laksa from 'laksa-core'

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Laksa === 'undefined') {
  window.Laksa = Laksa
}

export default Laksa
