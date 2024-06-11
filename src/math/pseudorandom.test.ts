import { Random } from './pseudorandom'

describe('Pseudorandom', () => {
  it('should generate the same number', () => {
    const r = Random(10)
    const r2 = Random(10)

    expect(r()).toBe(r2())
  })
})
