import { pointInShape } from './ray'
import type { IVec2 } from './vec2'

describe('ray', () => {
  it('square', () => {
    const shape: IVec2[] = [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 20, y: 20 },
      { x: 0, y: 20 },
    ]

    let point: IVec2 = { x: 10, y: 10 }
    expect(pointInShape(point, shape)).toBe(true)

    point = { x: 30, y: 10 }
    expect(pointInShape(point, shape)).toBe(false)
  })
})
