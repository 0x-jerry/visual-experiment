export interface LSystemOption {
  axiom: string
  rules: Record<string, string>
  actions: Record<string, (() => any) | undefined>
}

export interface Var {
  type: string
  iteration: number
}

export function LSystem({ axiom, rules, actions }: LSystemOption) {
  return create

  async function* create(iteration: number) {
    const vars: Var[] = axiom.split('').map((n) => ({
      type: n,
      iteration: 0,
    }))

    while (vars.length) {
      const currentVar = vars.shift()!

      if (currentVar.iteration === iteration) {
        await takeAction()
        yield
        continue
      }

      const rule = rules[currentVar.type]
      const nextVars: Var[] = []

      if (!rule) {
        await takeAction()
        yield
        continue
      }

      const actions = rule.split('')

      for (const action of actions) {
        nextVars.push({
          type: action,
          iteration: currentVar.iteration + 1,
        })
      }

      while (nextVars.length) {
        vars.unshift(nextVars.pop()!)
      }

      function takeAction() {
        return applyAction(currentVar.type)
      }
    }
  }

  async function applyAction(action: string) {
    const fn = actions[action]
    if (!fn) return

    try {
      await fn()
    } catch (error) {
      console.warn(action, error)
    }
  }
}
