import { AStar, CellType } from '@/lib/a-star'

export interface DrawAStarOption {
  color: string
  obstacleColor: string

  /**
   * @default 1
   */
  cellSize?: number
}

export function drawAStar(ctx: CanvasRenderingContext2D, opt: DrawAStarOption) {
  const { cellSize = 1 } = opt
  const { width, height } = ctx.canvas

  const pathFinding = new AStar(width, height)

  const g = pathFinding.resolve(
    { x: 10, y: 10 },
    { x: width - 10, y: height - 10 },
    {
      heuristic(from, to) {
        return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))
      },
      distance(from, to) {
        return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))
      },
      draw,
    },
  )

  return g

  function draw() {
    pathFinding.grid.forEach((v, x, y) => {
      if ((v ?? 0) & CellType.Walkable) {
        ctx.fillStyle = opt.color
      } else {
        ctx.fillStyle = opt.obstacleColor
      }

      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }
}
