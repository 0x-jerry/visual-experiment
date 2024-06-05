import { generatorRunner } from '@/utils'
import { isObject, sleep } from '@0x-jerry/utils'
import { useStats } from './useStats'
import { type MaybeRefOrGetter, toValue } from 'vue'

export interface UseFPSRunnerOption {
  fps?: MaybeRefOrGetter<number>
}

export function useFPSRunner(fn: () => any, opt?: UseFPSRunnerOption) {
  const { fps } = opt || {}

  const measure = useStats()
  const runner = generatorRunner(loop)

  onUnmounted(() => runner.pause())

  return runner

  async function* loop() {
    const next = await fn()

    const isGen = isGenerator(next)

    while (true) {
      const _fps = toValue(fps)
      const _fn = () => (isGen ? next.next() : fn())

      const r = await measure(async () => fpsWrapper(_fn, _fps))

      if (isGen && r.done) {
        break
      }

      yield
    }
  }
}

function isGenerator(target: unknown): target is AsyncGenerator | Generator {
  return isObject(target) && (Symbol.asyncIterator in target || Symbol.iterator in target)
}

async function fpsWrapper(fn: () => any, fps?: number) {
  const begin = Date.now()
  const r = await fn()
  const end = Date.now()

  const rest = fps ? 1000 / fps - (end - begin) : 0

  await sleep(rest > 0 ? rest : 0)

  return r
}
