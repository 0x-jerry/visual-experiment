import { deg2rad, Random } from '@/math'
import { Vec2 } from '@/math/Vec'
import { sleep } from '@0x-jerry/utils'

interface Status extends Vec2 {
  deg: number
  len: number
}

interface Var {
  type: string
  generation: number
}

interface Rule {
  type: string
  constants: string
}

// rules  : (X → F+[[X]-X]-F[-FX]+X), (F → FF)
const rules: Rule[] = [
  {
    type: 'X',
    constants: 'F+[[X]-X]-F[-FX]+X',
  },
  {
    type: 'F',
    constants: 'FF',
  },
]

interface DrawOption {
  length: number
  factor: number
  startAngle: number
  color: string
  generation: number
}

const { cos, sin } = Math

/**
 * https://www.wikiwand.com/en/L-system#/Example_7:_Fractal_plant
 *
 * @param ctx
 * @param opt
 */
export async function* drawFractal(ctx: CanvasRenderingContext2D, opt: DrawOption) {
  const { width, height } = ctx.canvas

  const random = Random()

  const startStatus: Status = {
    x: width * (1 / 4),
    y: height,
    deg: -90 + opt.startAngle,
    len: opt.length,
  }

  const status: Status[] = [startStatus]
  let currentStats = status.pop()

  const vars: Var[] = [
    {
      type: 'X',
      generation: 0,
    },
  ]

  while (vars.length) {
    const currentVar = vars.shift()!

    if (currentVar.generation === opt.generation) {
      await draw()
      yield
      continue
    }

    const rule = getRule(currentVar, rules)
    const nextVars: Var[] = []

    if (!rule) {
      await draw()
      yield
      continue
    }

    const actions = rule.constants.split('')

    for (const action of actions) {
      nextVars.push({
        type: action,
        generation: currentVar.generation + 1,
      })
    }

    while (nextVars.length) {
      vars.unshift(nextVars.pop()!)
    }

    async function draw() {
      applyAction(currentVar.type)
      await sleep(0)
    }
  }

  // ---------

  function getRule(item: Var, rules: Rule[]) {
    return rules.find((rule) => rule.type === item.type)
  }

  function applyAction(action: string) {
    if (!currentStats) return

    const { x, y, len } = currentStats

    switch (action) {
      case 'X':
        //
        break

      case 'F':
        {
          currentStats.deg += random(-5, 5)

          const deg = currentStats.deg
          ctx.strokeStyle = opt.color
          ctx.lineWidth = 2

          ctx.beginPath()

          ctx.moveTo(x, y)

          const x2 = len * cos(deg2rad(deg))
          const y2 = len * sin(deg2rad(deg))

          ctx.lineTo(x + x2, y + y2)

          currentStats.x = x + x2
          currentStats.y = y + y2

          ctx.stroke()
        }
        break

      case '-':
        currentStats.deg += 25 + random(-5, 5)
        break

      case '+':
        currentStats.deg -= 25 + random(-5, 5)
        break

      case '[':
        {
          status.push(structuredClone(currentStats))
        }
        break

      case ']':
        currentStats = status.pop()
        break

      default:
        break
    }
  }
}
