export class Vec2 {
  static zero = new Vec2()

  static up = new Vec2(0, 1)
  static down = new Vec2(0, -1)

  static left = new Vec2(-1, 0)
  static right = new Vec2(1, 0)

  constructor(public x = 0, public y = 0) {}

  rotate(rad: number) {
    var cos = Math.cos(rad)
    var sin = Math.sin(rad)
    const { x, y } = this
    this.x = Math.round(10000 * (x * cos - y * sin)) / 10000
    this.y = Math.round(10000 * (x * sin + y * cos)) / 10000
  }

  add(vec: Vec2) {
    this.x += vec.x
    this.y += vec.y
  }
}
