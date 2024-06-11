export type Status = 0 | 1

export class Grid<S extends any = Status> {
  data: S[] = []

  constructor(public w: number = 0, public h: number = 0) {}

  get(x: number, y: number): S | undefined {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      return
    }

    const idx = this.getIndex(x, y)

    return this.data.at(idx)
  }

  set(x: number, y: number, v: S) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      return
    }

    const idx = y * this.w + x

    this.data[idx] = v
  }

  getIndex(x: number, y: number) {
    const idx = y * this.w + x
    return idx
  }

  forEach(cb: (v: S | undefined, x: number, y: number) => any) {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        cb(this.get(x, y), x, y)
      }
    }
  }

  clear() {
    this.data = []
  }
}
