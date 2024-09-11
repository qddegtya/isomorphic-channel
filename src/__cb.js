export const GLOBAL_CB = '@@isomorphic-channel/cb'

const Cb = () => {
  let callbacks = {}
  let uuid = 0

  return {
    __autoRun() {
      window.addEventListener('message', (message) => {
        if (
          message.data.type &&
          message.data.type === '@@cb.request.callback'
        ) {
          const { callbackId, payload } = message.data
          const __cb = callbacks[callbackId]
          __cb && __cb.call(this, payload)
        }
      })
    },

    autoRun(callback) {
      let callbackId = ++uuid
      callbacks[callbackId] = callback

      return { callbackId }
    },

    get(id) {
      return callbacks[id]
    },
  }
}

// ensure singleton
if (!window[GLOBAL_CB]) {
  window[GLOBAL_CB] = Cb()
}

export const cb = window[GLOBAL_CB]

// auto run
cb.__autoRun()
