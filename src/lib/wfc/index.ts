export interface Cell {
  domains: number[]
  x: number
  y: number
}

export interface Constraint {
  (status: Cell): boolean
}

export abstract class WFC {
  grid: Cell[] = []

  allDomains: number[] = []

  abstract constraint: Constraint

  get length() {
    return this.w * this.h
  }

  constructor(readonly w: number, readonly h: number) {
    this.grid.length = this.length
  }

  collapseAt(x: number, y: number) {
    const cell = this.get(x, y)

    if (cell.domains.length === 1) {
      return
    }

    const _clonedCell = structuredClone(cell)

    const finalState = {
      cell: null as Cell | null,
      aroundCells: [] as Cell[],
      entropy: Infinity,
    }

    unSort(_clonedCell.domains).forEach((domain) => {
      const current = {
        domains: [domain],
        x,
        y,
      }

      this.set(x, y, current)

      // collapse around cells
      {
        const collapsedCells: Cell[] = []

        this.aroundEach(current, (cell) => {
          if (cell.domains.length === 1) {
            return
          }

          const candidates = cell.domains.filter((n) =>
            this.constraint?.({ ...cell, domains: [n] }),
          )

          collapsedCells.push({ ...cell, domains: candidates })
        })

        if (collapsedCells.some((n) => n.domains.length === 0)) {
          return
        }

        const entropy = collapsedCells.reduce((acc, cur) => {
          return acc + cur.domains.length
        }, 0)

        if (entropy < finalState.entropy || entropy === finalState.entropy) {
          // add some randomness
          if (finalState.cell && Math.random() < 0.4) {
            return
          }

          finalState.cell = current
          finalState.entropy = entropy
          finalState.aroundCells = collapsedCells
        }
      }
    })

    if (!finalState.cell) {
      const idx = Math.floor(Math.random() * _clonedCell.domains.length)
      const pick = _clonedCell.domains[idx]

      finalState.cell = { domains: [pick], x, y }
    }

    this.set(finalState.cell.x, finalState.cell.y, finalState.cell)

    for (const cell of finalState.aroundCells) {
      this.set(cell.x, cell.y, cell)
    }
  }

  async collapse() {
    const cell = await this.getMinEntropyItem()
    if (!cell) {
      return false
    }
    this.collapseAt(cell.x, cell.y)
    return true
  }

  async getMinEntropyItem() {
    let minEntropyCell: undefined | Cell

    await this.forEach((cell) => {
      if (cell.domains.length <= 1) {
        return
      }

      if (!minEntropyCell) {
        minEntropyCell = cell
        return
      }

      if (cell.domains.length < minEntropyCell.domains.length) {
        minEntropyCell = cell
        return
      }

      if (cell.domains.length === minEntropyCell.domains.length) {
        if (Math.random() > 0.5) {
          minEntropyCell = cell
          return
        }
      }
    })

    return minEntropyCell
  }

  aroundEach(current: Cell, cb: (status: Cell) => void) {
    const { x, y } = current
    const around = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]

    for (const pos of around) {
      const [x, y] = pos

      if (x < 0 || y < 0 || x >= this.w || y >= this.h) {
        continue
      }

      cb(this.get(x, y))
    }
  }

  async forEach(cb: (status: Cell) => void | Promise<void>) {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        await cb(this.get(x, y))
      }
    }
  }

  index(x: number, y: number) {
    return y * this.w + x
  }

  get(x: number, y: number) {
    if (x < 0 || y < 0) {
      throw new Error('invalid index')
    }

    let cell = this.grid.at(this.index(x, y))

    if (!cell) {
      cell = {
        domains: structuredClone(this.allDomains),
        x,
        y,
      }

      this.set(x, y, cell)
    }

    return cell
  }

  set(x: number, y: number, status: Cell) {
    this.grid[this.index(x, y)] = status
  }
}

function unSort<T>(arr: T[]) {
  const clone = [...arr]
  const result = []

  while (clone.length) {
    const idx = Math.floor(Math.random() * clone.length)
    const pick = clone.splice(idx, 1)
    result.push(pick[0])
  }

  return result
}
