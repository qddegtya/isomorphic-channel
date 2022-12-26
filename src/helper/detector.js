const detector = () => {
  let _env = 'unknown'

  return {
    detect () {
      _env = window.self !== window.top ? 'iframe' : 'same-context'
      return _env
    }
  }
}

const env = detector()

export const is = (name) => {
  return env.detect() === name
}
