import { AStar, CellType } from '@/lib/a-star'

export interface DrawAStarOption {
  cellSize: number
}

export function drawAStar(ctx: CanvasRenderingContext2D, opt: DrawAStarOption) {
  const { cellSize } = opt

  const { width, height } = ctx.canvas
  const w = ~~(width / cellSize)
  const h = ~~(height / cellSize)

  const pathFinding = new AStar(w, h)

  const startPoint = { x: 1, y: 1 }
  const endPoint = { x: w - 1, y: h - 1 }

  for (let y = 0; y < endPoint.y - 1; y++) {
    pathFinding.grid.set(10, y, CellType.NonWalkable)
  }

  for (let y = h / 2; y < h; y++) {
    pathFinding.grid.set(20, y, CellType.NonWalkable)
  }

  return start()

  function* start() {
    const iterator = pathFinding.resolve(startPoint, endPoint, {
      heuristic(from, to) {
        return Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)
      },
      distance(from, to) {
        return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))
      },
    })

    let v = iterator.next()

    const maxStep = 50
    let steps = maxStep

    yield
    while (!v.done) {
      v = iterator.next()

      if (steps-- < 0) {
        steps = maxStep
        draw()
        yield
      }
    }

    draw()
  }

  function draw() {
    const colors = {
      color: '#ffffff',
      visitedColor: '#3c85d2',
      obstacleColor: '#f26f6f',
      startColor: '#ff0000',
      endColor: '#ff0000',
      pathColor: '#00ff00',
    }

    pathFinding.grid.forEach((v, x, y) => {
      if (pathFinding._rearch(startPoint, { x, y })) {
        ctx.fillStyle = colors.startColor
      } else if (pathFinding._rearch(endPoint, { x, y })) {
        ctx.fillStyle = colors.endColor
      } else if (pathFinding.cameFrom.has({ x, y })) {
        ctx.fillStyle = colors.visitedColor
      } else if ((v ?? 0) & CellType.Walkable) {
        ctx.fillStyle = colors.color
      } else {
        ctx.fillStyle = colors.obstacleColor
      }

      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
    })

    const current = pathFinding.openSet.peek()
    if (current) {
      const output = pathFinding._reconstructPath(current)

      for (const p of output) {
        const { x, y } = p
        ctx.fillStyle = colors.pathColor

        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
  }
}
