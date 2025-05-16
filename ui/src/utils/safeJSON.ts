const safeJSON = {
  parse(input: string | null, fallback?: unknown) {
    if (!input) {
      return fallback
    }
    try {
      return JSON.parse(input)
    } catch (err) {
      console.warn('safeJSON.parse: ', err)
      return fallback
    }
  },

  stringify(input: unknown, fallback = '') {
    try {
      return JSON.stringify(input)
    } catch (err) {
      console.warn('safeJSON.stringify: ', err)
      return fallback
    }
  },
}

export default safeJSON
