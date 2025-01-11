import { Postmate } from '../src/helper/postmate'

describe('Postmate Basic Tests', () => {
  test('Postmate 库应该可用', () => {
    expect(Postmate).toBeDefined()
    expect(typeof Postmate).toBe('function')
    expect(Postmate.Model).toBeDefined()
  })
})
