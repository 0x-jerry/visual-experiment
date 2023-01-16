class Xorshift {
  private x: number
  private y: number
  private z: number
  private w: number

  constructor(seed: number = Date.now()) {
    this.x = seed
    this.y = 362436069
    this.z = 521288629
    this.w = 88675121
  }

  next() {
    let t = this.x ^ (this.x << 11)
    this.x = this.y
    this.y = this.z
    this.z = this.w
    this.w = this.w ^ (this.w >> 19) ^ (t ^ (t >> 8))
    return this.w / 2 ** 31 // 2^32-1
  }
}

export function Random(seed = 0) {
  const x = new Xorshift(seed)

  return (min = 0, max = 1) => {
    const r = x.next()

    return min + (max - min) * r
  }
}
