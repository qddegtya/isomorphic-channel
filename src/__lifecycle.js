export const lifecycle = {
  onActive(handle) {
    window.addEventListener('message', (message) => {
      if (message.data.type && message.data.type === '@@cb.request.active') {
        handle(message.data.payload)
      }
    })
  },

  onUnactive (handle) {
    window.addEventListener('message', (message) => {
      if (message.data.type && message.data.type === '@@cb.request.unActive') {
        handle(message.data.payload)
      }
    })
  },

  onMount(handle) {
    window.addEventListener('message', (message) => {
      if (message.data.type && message.data.type === '@@cb.request.mount') {
        handle(message.data.payload)
      }
    })
  },

  onUnmount(handle) {
    window.addEventListener('message', (message) => {
      if (message.data.type && message.data.type === '@@cb.request.unmount') {
        handle(message.data.payload)
      }
    })
  },

  onUpdate(handle) {
    window.addEventListener('message', (message) => {
      if (message.data.type && message.data.type === '@@cb.request.update') {
        handle(message.data.payload)
      }
    })
  },
}
