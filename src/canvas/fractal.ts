import { LSystem } from '@/lib'
import { deg2rad, Random } from '@/math'
import { IVec2 } from '@/math/Vec'

interface Status extends IVec2 {
  deg: number
  len: number
  opacity: number
}

interface DrawOption {
  length: number
  factor: number
  startAngle: number
  color: string
  iteration: number
}

const { cos, sin } = Math

/**
 * https://www.wikiwand.com/en/L-system#/Example_7:_Fractal_plant
 *
 * @param ctx
 * @param opt
 */
export function drawFractal(ctx: CanvasRenderingContext2D, opt: DrawOption) {
  const { width, height } = ctx.canvas

  const random = Random()

  const startStatus: Status = {
    x: width * (1 / 4),
    y: height,
    deg: -90 + opt.startAngle,
    len: opt.length,
    opacity: 255,
  }

  const status: Status[] = [startStatus]
  let currentStats = status.pop()

  const treeGenerator = LSystem({
    iterCount: 200,
    axiom: 'X',
    rules: {
      X: 'F+[[X]-X]-F[-FX]+X',
      F: 'FF',
    },
    actions: {
      F() {
        if (!currentStats) return
        const { x, y, len, opacity } = currentStats

        currentStats.deg += random(-5, 5)

        const deg = currentStats.deg
        ctx.strokeStyle = opt.color
        ctx.globalAlpha = opacity / 255
        ctx.lineWidth = 2

        ctx.beginPath()

        ctx.moveTo(x, y)

        const x2 = len * cos(deg2rad(deg))
        const y2 = len * sin(deg2rad(deg))

        ctx.lineTo(x + x2, y + y2)

        currentStats.x = x + x2
        currentStats.y = y + y2

        ctx.stroke()
      },
      '-'() {
        if (!currentStats) return
        currentStats.deg += 25 + random(-5, 5)
      },
      '+'() {
        if (!currentStats) return
        currentStats.deg -= 25 + random(-5, 5)
      },
      '['() {
        if (!currentStats) return

        status.push({
          ...structuredClone(currentStats),
          opacity: currentStats.opacity * 0.7,
        })
      },
      ']'() {
        currentStats = status.pop()
      },
    },
  })

  return treeGenerator(opt.iteration)
}
