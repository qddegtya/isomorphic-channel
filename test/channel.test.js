import { channel, GLOBAL_CHANNEL_SYMBOL } from '../src/__channel'
import { is } from '../src/helper/detector'

// mock detector
jest.mock('../src/helper/detector', () => ({
  is: jest.fn().mockImplementation(() => false),
}))

// 简化 postmate mock，只模拟必要的接口
jest.mock('../src/helper/postmate', () => ({
  Postmate: {
    Model: class {
      constructor() {
        this.model = {}
      }
      sendHandshakeReply() {}
    },
  },
}))

describe('Channel Tests', () => {
  beforeEach(() => {
    window[GLOBAL_CHANNEL_SYMBOL] = undefined
    is.mockReset()
  })

  test('应该创建单例 Channel', () => {
    const ch1 = channel
    const ch2 = channel
    expect(ch1).toBe(ch2)
  })

  test('同域消息发送和接收', (done) => {
    is.mockImplementation(() => false) // 模拟同域

    const message = 'TEST_MESSAGE'
    const payload = { data: 'test' }

    channel.on(message, (data) => {
      expect(data).toEqual(payload)
      done()
    })

    channel.send(message, payload)
  })

  test('广播消息应该在所有上下文中接收到', () => {
    is.mockImplementation(() => false)

    const message = 'BROADCAST_MESSAGE'
    const payload = { data: 'broadcast' }
    let receiveCount = 0

    // 先调用 setup 确保广播机制已初始化
    channel.setup()

    const cleanup1 = channel.on(message, (data) => {
      expect(data).toEqual(payload)
      receiveCount++
    })

    const cleanup2 = channel.on(message, (data) => {
      expect(data).toEqual(payload)
      receiveCount++
    })

    // 直接发送广播，不需要 setTimeout
    channel.broadcast(message, payload)

    // 同步验证结果
    expect(receiveCount).toBe(2)

    // 清理
    cleanup1()
    cleanup2()
  })

  test('清理监听器应该正常工作', () => {
    is.mockImplementation(() => false)

    const message = 'CLEANUP_TEST'
    const handler = jest.fn()

    const cleanup = channel.on(message, handler)
    channel.send(message)
    expect(handler).toHaveBeenCalledTimes(1)

    cleanup()
    channel.send(message)
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
