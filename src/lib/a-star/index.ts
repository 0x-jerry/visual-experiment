import { Grid, type IVec2 } from '@/math'
import { MinHeap } from 'data-structure-typed'

export enum CellType {
  Walkable = 1 << 1,
  Visited = 1 << 3,
}

class GridMap<V> {
  data = new Map<number, V>()

  constructor(readonly gird: Grid<any>, readonly defaultValue?: V) {}

  get(key: IVec2) {
    const idx = this.gird.getIndex(key.x, key.y)

    return this.data.get(idx) ?? this.defaultValue
  }

  set(key: IVec2, value: V) {
    const idx = this.gird.getIndex(key.x, key.y)

    return this.data.set(idx, value)
  }

  has(key: IVec2) {
    const idx = this.gird.getIndex(key.x, key.y)

    return this.data.has(idx)
  }

  delete(key: IVec2) {
    const idx = this.gird.getIndex(key.x, key.y)

    this.data.delete(idx)
  }

  clear() {
    this.data.clear()
  }
}

export class AStar {
  grid: Grid<number>

  gScore: GridMap<number>
  fScore: GridMap<number>
  cameFrom: GridMap<IVec2>
  openSet = new MinHeap<IVec2>()

  constructor(readonly w: number, readonly h: number) {
    this.grid = new Grid(w, h)
    this.grid.forEach((_, x, y) => {
      this.grid.set(x, y, CellType.Walkable)
    })

    this.gScore = new GridMap<number>(this.grid, Infinity)
    this.fScore = new GridMap<number>(this.grid, Infinity)
    this.cameFrom = new GridMap<IVec2>(this.grid)
  }

  getAroundWalkableCells(p: IVec2) {
    const walkablePoints: IVec2[] = []

    for (let y = p.y - 1; y <= p.y + 1; y++) {
      for (let x = p.x - 1; x <= p.x + 1; x++) {
        if (x === p.x && y === p.y) {
          continue
        }

        const val = this.grid.get(x, y)
        if (val != null && val & CellType.Walkable) {
          walkablePoints.push({ x, y })
        }
      }
    }

    return walkablePoints
  }

  getIndex(p: IVec2) {
    return this.grid.getIndex(p.x, p.y)
  }

  *resolve(
    start: IVec2,
    end: IVec2,
    opt: {
      heuristic: (from: IVec2, to: IVec2) => number
      distance: (from: IVec2, to: IVec2) => number
      draw: () => void
    },
  ) {
    this.fScore.clear()
    this.gScore.clear()
    this.cameFrom.clear()

    this.openSet = new MinHeap<IVec2>([], {
      comparator: (a, b) => {
        const scoreA = this.fScore.get(a)!
        const scoreB = this.fScore.get(b)!

        return scoreA - scoreB
      },
    })

    this.gScore.set(start, 0)
    this.fScore.set(start, opt.heuristic(start, end))

    this.openSet.add(start)

    while (!this.openSet.isEmpty()) {
      opt.draw()
      yield

      const current = this.openSet.poll()!

      if (this._rearch(current, end)) {
        return this._reconstructPath(current)
      }

      const neighbors = this.getAroundWalkableCells(current)

      for (const neighbor of neighbors) {
        const tentativeScore = this.gScore.get(current)! + opt.distance(current, neighbor)
        const gScoreNeighbor = this.gScore.get(neighbor)!

        if (tentativeScore < gScoreNeighbor) {
          this.cameFrom.set(neighbor, current)
          this.gScore.set(neighbor, tentativeScore)
          this.fScore.set(neighbor, tentativeScore + opt.heuristic(neighbor, end))

          if (!this.openSet.has(neighbor)) {
            this.openSet.add(neighbor)
          }
        }
      }
    }

    return []
  }

  _rearch(start: IVec2, end: IVec2) {
    return start.x === end.x && start.y === end.y
  }

  _reconstructPath(point: IVec2) {
    const totalPath: IVec2[] = []

    while (this.cameFrom.has(point)) {
      const cameFormPoint = this.cameFrom.get(point)!
      totalPath.push(cameFormPoint)

      point = cameFormPoint
    }

    return totalPath
  }
}
