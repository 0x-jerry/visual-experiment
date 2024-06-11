import { Grid, type IVec2 } from '@/math'
import { MinHeap } from 'data-structure-typed'

enum CellType {
  Walkable = 1 << 1,
  Visited = 1 << 3,
}

export class AStar {
  grid: Grid<number>

  gScroe = new Map<number, number>()
  fScroe = new Map<number, number>()
  openSet = new MinHeap<IVec2>()
  cameFrom = new Map<number, IVec2>()

  constructor(readonly w: number, readonly h: number) {
    this.grid = new Grid(w, h)
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
    },
  ) {
    this.fScroe.clear()
    this.gScroe.clear()
    this.cameFrom.clear()

    this.openSet = new MinHeap<IVec2>([], {
      comparator: (a, b) => {
        const scoreA = this.fScroe.get(this.getIndex(a)) ?? Infinity
        const scoreB = this.fScroe.get(this.getIndex(b)) ?? Infinity

        return scoreA - scoreB
      },
    })

    const startIndex = this.getIndex(start)
    this.gScroe.set(startIndex, 0)
    this.fScroe.set(startIndex, opt.heuristic(start, end))

    this.openSet.add(start)

    while (!this.openSet.isEmpty()) {
      yield

      const current = this.openSet.poll()!

      if (this._rearch(current, end)) {
        return this._reconstructPath(current)
      }

      const neighbors = this.getAroundWalkableCells(current)

      for (const neighbor of neighbors) {
        const currentIdx = this.getIndex(current)
        const neighborIdx = this.getIndex(neighbor)
        const tentativeScore = this.gScroe.get(currentIdx)! + opt.distance(current, neighbor)
        const gScoreNeighbor = this.gScroe.get(neighborIdx) ?? Infinity

        if (tentativeScore < gScoreNeighbor) {
          this.cameFrom.set(neighborIdx, current)
          this.gScroe.set(neighborIdx, tentativeScore)
          this.fScroe.set(neighborIdx, tentativeScore + opt.heuristic(neighbor, end))

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

    let pointIdx = this.getIndex(point)

    while (this.cameFrom.has(pointIdx)) {
      const p = this.cameFrom.get(pointIdx)!
      totalPath.push(p)

      pointIdx = this.getIndex(p)
    }

    return totalPath
  }
}
