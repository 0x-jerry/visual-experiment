import { generatorRunner, isInIframe } from '@/utils'
import { fpsWrapper } from '@/utils/fps'
import { MaybeRef } from '@vueuse/core'
import { useStats } from './useStats'

export function useFPSRunner(fn: () => any, fps: MaybeRef<number> = 60) {
  const measure = useStats()
  const runner = generatorRunner(loop)

  onMounted(() => !isInIframe && runner.restart())

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
    while (true) {
      await measure(() => fpsWrapper(fn, fps))
      yield
    }
  }
}
