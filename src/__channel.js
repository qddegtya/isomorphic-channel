import * as AJS from 'xajs'
import { Postmate } from './helper/postmate'
import { is } from './helper/detector'

const { Puber, Suber } = AJS.functional.helper.PS

export const GLOBAL_CHANNEL_SYMBOL = '@@one-portal/channel'
let uuid = 0

const BROADCAST_FROM_IFRAME = 'broadcast-request-from-iframe'
const BROADCAST_FROM_SAME_CONTEXT = 'broadcast-request-frome-samecontext'

const Channel = (name = GLOBAL_CHANNEL_SYMBOL) => {
  const _globalSuber = new Suber(name, {})
  const _globalPuber = new Puber(name, {})

  // handshakes
  let handshakes = []

  // iframe child listeners
  let iframeChildContextListeners = {}

  // schedule queue
  let scheduleQueue = []

  // child schedule queue
  let childScheduleQueue = []

  // iframe context child
  const handshake = new Postmate.Model({})
  handshake.sendHandshakeReply()

  const NOOP = () => void 0

  // 总线订阅其他发布者消息
  const __subscribe = (msg, handler = NOOP) => {
    const _puber = new Puber(++uuid, {})
    _puber.addSuber(_globalSuber)

    _globalSuber.rss(_puber, [
      {
        msg,
        handler,
      },
    ])

    return {
      send(message, payload = {}) {
        _puber.pub(message, payload)
      },
    }
  }

  // 往总线里发送消息
  const __postMessage = (msg, payload = {}) => {
    _globalPuber.pub(msg, payload)
  }

  return {
    // iframe 需要主动调用 handshake 和父执行环境握手
    handshake(opt = {}) {
      if (opt.name && typeof opt.name === 'string') {
        new Postmate(opt).then((child) => {
          channel.send('postmate-handshake', {
            child,
          })
        })

        return () => {
          // destroy first
          const current = handshakes.filter(
            (child) => child.frame.name === opt.name
          )[0]
          current && current.destroy && current.destroy()

          // reset handshakes
          handshakes = handshakes.filter(
            (child) => child.frame.name !== opt.name
          )
        }
      } else {
        throw new Error(
          'channel.handshake must provide a name, see https://github.com/dollarshaveclub/postmate'
        )
      }
    },

    // setup
    setup() {
      // schedule callback task
      const schedule = ({ callbackId, task, origin }) => {
        // sync
        scheduleQueue.forEach((queue) => {
          // every single callbackId in every single origin execute once
          if (callbackId === queue.callbackId && origin === queue.origin) {
            clearTimeout(queue.nextTick)
          }
        })

        scheduleQueue.push({
          callbackId,
          origin,
          nextTick: setTimeout(task),
        })
      }

      const handshakeResolver = (hs, payload) => (model) => {
        if (model) {
          const { callbackId } = model

          const task = () => {
            // 请求执行 callback
            hs.frame.contentWindow.postMessage(
              {
                type: '@@cb.request.callback',
                callbackId,
                payload,
              },
              hs.childOrigin
            )
          }

          schedule({ task, callbackId, origin: hs.childOrigin })
        }
      }

      channel.on(BROADCAST_FROM_SAME_CONTEXT, ({ message, payload }) => {
        // forward to same-context
        channel.send(message, payload)

        // forward to iframe-context
        handshakes.forEach((hs) => {
          hs.get(message).then(handshakeResolver(hs, payload))
        })
      })

      const scheduleChildHandler = ({ origin, task }) => {
        // sync
        childScheduleQueue.forEach((queue) => {
          // every single origin execute once
          if (origin === queue.origin) {
            clearTimeout(queue.nextTick)
          }
        })

        childScheduleQueue.push({
          origin,
          nextTick: setTimeout(task),
        })
      }

      // when postmate handshake
      channel.on('postmate-handshake', ({ child }) => {
        // get listeners
        for (const name in iframeChildContextListeners) {
          const listeners = iframeChildContextListeners[name]
          listeners.forEach(({ handler }) => {
            child.on(name, (payload) =>
              scheduleChildHandler({
                origin: child.childOrigin,
                task: () => handler(payload),
              })
            )
          })
        }

        // save handshake
        handshakes.push(child)

        child.on(BROADCAST_FROM_IFRAME, ({ message, payload }) => {
          // forward to iframe-context
          handshakes.forEach((hs) => {
            hs.get(message).then(handshakeResolver(hs, payload))
          })

          // forward to same-context
          channel.send(message, payload)
        })
      })
    },

    // 监听总线上的消息
    on(msg, handler = NOOP) {
      if (is('iframe')) {
        handshake.model[msg] = () => handler

        // clear
        return () => {
          delete handshake.model[msg]
        }
      } else {
        // in same context
        const __uuid = ++uuid
        const _suber = new Suber(__uuid, {})
        _globalPuber.addSuber(_suber)

        _suber.rss(_globalPuber, [
          {
            msg,
            handler,
          },
        ])

        // if from iframe child context
        if (!iframeChildContextListeners[msg]) {
          iframeChildContextListeners[msg] = []
        }

        iframeChildContextListeners[msg].push({
          uuid: __uuid,
          handler,
        })

        // clear
        return () => {
          delete _globalPuber._subers[__uuid]
          iframeChildContextListeners[msg] = iframeChildContextListeners[
            msg
          ].filter((listener) => listener.uuid !== __uuid)
        }
      }
    },

    // 发送到总线
    send(msg, payload) {
      if (is('iframe')) {
        handshake.childApi.emit(msg, payload)
      } else {
        const sender = __subscribe(msg, (p) => {
          __postMessage(msg, p)
        })

        sender.send(msg, payload)
      }
    },

    // 跨上下文广播
    broadcast(msg, payload = {}) {
      this.send(
        is('iframe') ? BROADCAST_FROM_IFRAME : BROADCAST_FROM_SAME_CONTEXT,
        {
          message: msg,
          payload,
        }
      )
    },
  }
}

// ensure singleton
if (!window[GLOBAL_CHANNEL_SYMBOL]) {
  window[GLOBAL_CHANNEL_SYMBOL] = Channel()
}

export const channel = window[GLOBAL_CHANNEL_SYMBOL]

channel.debug = () => {
  Postmate.debug = true
}
