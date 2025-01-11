class MockPostMessage {
  constructor() {
    this.handlers = new Map()
  }

  postMessage(data) {
    // 同步处理消息，不使用异步
    switch (data.postmate) {
      case 'handshake':
        this.handleHandshake()
        break
      case 'request':
        this.handleRequest(data)
        break
    }
  }

  handleHandshake() {
    this.handlers.forEach((handler) =>
      handler({
        data: {
          postmate: 'handshake-reply',
          type: 'application/x-postmate-v1+json',
        },
        origin: 'mock-origin',
        source: this,
      })
    )
  }

  handleRequest({ property, uid }) {
    this.handlers.forEach((handler) =>
      handler({
        data: {
          postmate: 'reply',
          type: 'application/x-postmate-v1+json',
          property,
          uid,
          value: this.getMockValue(property),
        },
        origin: 'mock-origin',
        source: this,
      })
    )
  }

  getMockValue(property) {
    const mockData = {
      foo: 'bar',
      getData: 'test data',
    }
    return mockData[property]
  }

  addEventListener(type, handler) {
    this.handlers.set(handler, handler)
  }

  removeEventListener(type, handler) {
    this.handlers.delete(handler)
  }
}

// 基础的 window 对象模拟
global.window = {
  ...global.window,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}

// 基础的 DOM 环境模拟
document.createElement = jest.fn(() => ({
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  classList: { add: jest.fn() },
  style: {},
}))

// 模拟 postMessage 环境
global.postMessage = jest.fn()
