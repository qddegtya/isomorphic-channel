export const functional = {
  helper: {
    PS: {
      Puber: class Puber {
        constructor(id, config = {}) {
          this.id = id
          this.config = config
          this._subers = {}
        }

        addSuber(suber) {
          this._subers[suber.id] = suber
        }

        pub(msg, payload) {
          Object.values(this._subers).forEach((suber) => {
            suber.handlers.forEach((h) => {
              if (h.msg === msg) {
                h.handler(payload)
              }
            })
          })
        }
      },

      Suber: class Suber {
        constructor(id, config = {}) {
          this.id = id
          this.config = config
          this.handlers = []
        }

        rss(puber, handlers) {
          this.handlers = this.handlers.concat(handlers)
        }
      },
    },
  },
}
