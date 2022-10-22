import { deg2rad, Random } from '@/math'
import { Vec2 } from '@/math/Vec'
import { Fn, sleep } from '@0x-jerry/utils'

interface Status extends Vec2 {
  deg: number
  len: number
}

interface Var {
  type: string
  generation: number
  status: Status
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
  limit: {
    len: number
    generation: number
  }
}

const { cos, sin } = Math

export async function drawFractal(ctx: CanvasRenderingContext2D, opt: DrawOption) {
  const { width, height } = ctx.canvas

  const vars: Var[] = [
    {
      type: 'X',
      generation: 0,
      status: {
        x: width / 2,
        y: height,
        deg: -90 + opt.startAngle,
        len: opt.length,
      },
    },
  ]

  while (vars.length) {
    const varItem = vars.shift()!

    const rule = getRule(varItem, rules)

    if (rule) applyRule(varItem, rule)
    await sleep(1000 / 60)
  }

  // ---------

  function getRule(item: Var, rules: Rule[]) {
    return rules.find((rule) => rule.type === item.type)
  }

  function applyRule(item: Var, rule: Rule) {
    const actions = rule.constants.split('')

    const cache: Var[] = []

    for (const action of actions) {
      applyAction(action)
    }

    function applyAction(action: string) {
      if (!item.status) return

      const { x, y, deg, len } = item.status

      switch (action) {
        case 'X':
          {
            const newItem: Var = {
              type: 'X',
              generation: item.generation + 1,
              status: { ...item.status },
            }

            if (newItem.status.len > opt.limit.len && newItem.generation < opt.limit.generation) {
              newItem.status!.len *= opt.factor

              vars.push(newItem)
            }
          }
          break

        case 'F':
          {
            ctx.strokeStyle = opt.color

            ctx.beginPath()

            ctx.moveTo(x, y)
            const x2 = len * cos(deg2rad(deg))
            const y2 = len * sin(deg2rad(deg))
            ctx.lineTo(x + x2, y + y2)
            item.status.x = x + x2
            item.status.y = y + y2

            ctx.stroke()
          }
          break

        case '-':
          item.status.deg += 25
          break

        case '+':
          item.status.deg -= 25
          break

        case '[':
          {
            const newItem = structuredClone(item)
            cache.push(newItem)
          }
          break

        case ']':
          item = cache.pop()!
          break

        default:
          break
      }
    }
  }
}
