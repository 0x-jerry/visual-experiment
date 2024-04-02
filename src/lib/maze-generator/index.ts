import { IVec2, Random, Vec2 } from '@/math'

export enum Wall {
  Up = 1,
  Down = 1 << 1,
  Left = 1 << 2,
  Right = 1 << 3,
}

class Cell extends Vec2 {
  wall = 0
}

class MazeMap extends Array<Cell> {
  constructor(public readonly size: IVec2) {
    const total = size.x * size.y
    super(total)

    for (let idx = 0; idx < total; idx++) {
      const x = idx % size.x
      const y = Math.floor(idx / size.x)
      this[idx] = new Cell(x, y)
    }
  }

  get(x: number, y: number) {
    if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y) {
      return
    }

    const idx = y * this.size.x + x
    return this.at(idx)
  }
}

export class MazeGenerator {
  map: MazeMap

  random = Random()

  constructor(size: IVec2 = Vec2.zero) {
    this.map = new MazeMap(size)
  }

  setSize(size: IVec2) {
    this.map = new MazeMap(size)
  }

  #visited = new Set<Cell>()

  #stack = new Array<Cell>()

  #currentVisitCell?: Cell

  get current() {
    return this.#currentVisitCell
  }

  isVisited(cell: Cell) {
    return this.#visited.has(cell)
  }

  *createGenerator(renderFn?: () => void) {
    this.#visited.clear()
    this.#currentVisitCell = this.map.get(0, 0)!
    this.#stack = [this.#currentVisitCell]
    this.#visited.add(this.#currentVisitCell)

    while (this.#stack.length) {
      renderFn?.()

      yield
      this.#currentVisitCell = this.#stack.at(-1)!

      const nextCell = this.getNextCell(this.#currentVisitCell)

      if (nextCell) {
        this.#stack.push(nextCell)
        this.#visited.add(nextCell)
      } else {
        this.#stack.pop()
      }
    }

    this.#currentVisitCell = undefined
    renderFn?.()
  }

  getNextCell(cell: Cell) {
    const dirMap = {
      [Wall.Up]: Vec2.up,
      [Wall.Down]: Vec2.down,
      [Wall.Left]: Vec2.left,
      [Wall.Right]: Vec2.right,
    }

    const availableDirs = Object.entries(dirMap)
      .map(([wall, dir]) => {
        const pos = Vec2.from(cell).add(dir)

        const _cell = this.map.get(pos.x, pos.y)
        if (!_cell) return

        if (this.#visited.has(_cell)) return

        return {
          wall: +wall,
          cell: _cell,
        }
      })
      .filter(Boolean)

    const idx = Math.floor(this.random(0, availableDirs.length))

    const next = availableDirs.at(idx)

    if (!next) return

    cell.wall = cell.wall | next.wall

    return next.cell
  }
}
