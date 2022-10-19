import { mapRange } from './mapRange'

describe('map range', () => {
  it('should return the range value', () => {
    expect(mapRange(0.1, 1, 11)).toBe(2)
    expect(mapRange(0, 1, 11)).toBe(1)

    expect(mapRange(1, 1, 11)).toBe(11)
  })
})
