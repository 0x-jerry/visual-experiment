import { MazeGenerator, Wall } from '@/lib/maze-generator'
import { type IVec2, Vec2 } from '@/math'

export interface DrawMazeOption {
  size: IVec2
  color: string
  wallColor: string
}

export function drawMaze(ctx: CanvasRenderingContext2D, opt: DrawMazeOption) {
  const maze = new MazeGenerator(opt.size)

  const mazeWithWallSize = new Vec2(opt.size.x * 2 + 1, opt.size.y * 2 + 1)

  const canvasSize = new Vec2(ctx.canvas.width, ctx.canvas.height)

  const cellSize = new Vec2(canvasSize.x / mazeWithWallSize.x, canvasSize.y / mazeWithWallSize.y)

  const drawWall = (cellPos: IVec2, wallDir: IVec2) => {
    const x = (cellPos.x * 2 + 1 + wallDir.x) * cellSize.x
    const y = (cellPos.y * 2 + 1 + wallDir.y) * cellSize.y

    ctx.fillStyle = opt.color
    ctx.fillRect(x, y, cellSize.x, cellSize.y)
  }

  const drawCell = (cellPos: IVec2, color: string) => {
    const x = (cellPos.x * 2 + 1) * cellSize.x
    const y = (cellPos.y * 2 + 1) * cellSize.y
    ctx.fillStyle = color
    ctx.fillRect(x, y, cellSize.x, cellSize.y)
  }

  return maze.createGenerator(() => _drawMaze())

  function _drawMaze() {
    ctx.fillStyle = opt.wallColor
    ctx.fillRect(0, 0, canvasSize.x, canvasSize.y)

    maze.map.forEach((cell) => {
      if (cell === maze.current) {
        drawCell(cell, '#ff0000')
      } else {
        if (maze.isVisited(cell)) {
          drawCell(cell, opt.color)
        } else {
          drawCell(cell, opt.wallColor)
        }
      }

      if (cell.wall & Wall.Up) {
        drawWall(cell, Vec2.up)
      }

      if (cell.wall & Wall.Down) {
        drawWall(cell, Vec2.down)
      }

      if (cell.wall & Wall.Left) {
        drawWall(cell, Vec2.left)
      }

      if (cell.wall & Wall.Right) {
        drawWall(cell, Vec2.right)
      }
    })
  }
}
