import { clamp } from '@0x-jerry/utils'

export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S]

export interface LSystemOption<Rule extends string> {
  axiom: string
  rules: Record<string, Rule>
  actions: {
    [key in Split<Rule, ''>[number]]?: (() => any) | undefined
  }
  iterCount?: number
}

export interface Var {
  type: string
  iteration: number
}

export function LSystem<Rule extends string>({
  axiom,
  rules,
  actions,
  iterCount,
}: LSystemOption<Rule>) {
  return create

  async function* create(iteration: number) {
    let vars: Var[] = axiom.split('').map((n) => ({
      type: n,
      iteration: 0,
    }))

    const ITER_COUNT = clamp(iterCount || 100, 100, 1000)
    let _iterCount = ITER_COUNT

    while (vars.length) {
      if (_iterCount-- < 0) {
        yield
        _iterCount = ITER_COUNT
      }

      const currentVar = vars.shift()!

      if (currentVar.iteration === iteration) {
        await takeAction()
        continue
      }

      const rule = rules[currentVar.type]
      const nextVars: Var[] = []

      if (!rule) {
        await takeAction()
        continue
      }

      const actions = rule.split('')

      for (const action of actions) {
        nextVars.push({
          type: action,
          iteration: currentVar.iteration + 1,
        })
      }

      vars = nextVars.concat(vars)

      function takeAction() {
        return applyAction(currentVar.type)
      }
    }
  }

  async function applyAction(action: string) {
    // @ts-ignore
    const fn = actions[action]
    if (!fn) return

    try {
      await fn()
    } catch (error) {
      console.warn(action, error)
    }
  }
}
