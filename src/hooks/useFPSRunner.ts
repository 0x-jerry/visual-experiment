import { generatorRunner, isInIframe } from '@/utils'
import { is, sleep } from '@0x-jerry/utils'
import { MaybeRef } from '@vueuse/core'
import { useStats } from './useStats'

export function useFPSRunner(fn: () => any, fps?: MaybeRef<number>) {
  const measure = useStats()
  const runner = generatorRunner(loop)

  onMounted(() => {
    runner.restart()
    if (isInIframe) {
      runner.pause()
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
      const _fps = unref(fps)
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
  return is.object(target) && (Symbol.asyncIterator in target || Symbol.iterator in target)
}

async function fpsWrapper(fn: () => any, fps?: number) {
  const begin = Date.now()
  const r = await fn()
  const end = Date.now()

  const rest = fps ? 1000 / fps - (end - begin) : 0

  await sleep(rest > 0 ? rest : 0)

  return r
}
