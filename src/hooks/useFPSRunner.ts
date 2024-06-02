import { generatorRunner, isInIframe } from '@/utils'
import { isObject, sleep } from '@0x-jerry/utils'
import { useStats } from './useStats'
import { type MaybeRefOrGetter, toValue } from 'vue'

export interface UseFPSRunnerOption {
  delay?: MaybeRefOrGetter<number>
  fps?: MaybeRefOrGetter<number>
}

export function useFPSRunner(fn: () => any, opt?: UseFPSRunnerOption) {
  const { delay, fps } = opt || {}

  const measure = useStats()
  const runner = generatorRunner(loop)

  onMounted(async () => {
    if (delay) {
      await sleep(toValue(delay))
    }

    if (!isInIframe) {
      runner.restart()
    }
  })

  onUnmounted(() => runner.pause())

  if (isInIframe) {
    useEventListener(document, 'mouseenter', (e) => {
      if (!runner.status.started) {
        runner.restart()
      } else {
        runner.resume()
      }
    })

    useEventListener(document, 'mouseleave', (e) => {
      runner.pause()
    })
  } else {
    useEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        if (!runner.status.started) {
          runner.restart()
        } else if (runner.status.paused) {
          runner.resume()
        } else {
          runner.pause()
        }
      }
    })
  }

  return {
    ...runner,
    resume() {
      if (!runner.status.started) {
        runner.restart()
      } else {
        runner.resume()
      }
    },
  }

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
