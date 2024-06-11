import type { IVec2 } from './vec2'

/**
 * https://rosettacode.org/wiki/Ray-casting_algorithm#JavaScript
 *
 * @param point
 * @param shape
 * @returns
 */
export function pointInShape(point: IVec2, shape: IVec2[]): boolean {
  if (shape.length < 3) {
    return false
  }

  let count = 0
  for (let idx = 0; idx < shape.length; idx++) {
    const p1 = shape[idx]
    const p2 = shape[(idx + 1) % shape.length]

    if (pointAtWest(p1, p2, point)) {
      count++
    }
  }

  return count % 2 === 1
}

function pointAtWest(a: IVec2, b: IVec2, p: IVec2): boolean {
  if (a.y > b.y) {
    return pointAtWest(b, a, p)
  }

  if (p.y <= a.y || p.y >= b.y || (p.x >= a.x && p.x >= b.x)) {
    return false
  }

  if (p.x < a.x && p.x < b.x) {
    return true
  }

  return (p.y - a.y) / (p.x - a.x) > (b.y - a.y) / (b.x - a.x)
}
