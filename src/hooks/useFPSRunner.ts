import { generatorRunner } from '@/utils'
import { fpsWrapper } from '@/utils/fps'
import { MaybeRef } from '@vueuse/core'
import { useStats } from './useStats'

export function useFPSRunner(fn: () => any, fps: MaybeRef<number> = 60) {
  const measure = useStats()
  const runner = generatorRunner(loop)

  onMounted(() => runner.restart())

  onUnmounted(() => runner.pause())

  return runner

  async function* loop() {
    while (true) {
      await measure(() => fpsWrapper(fn, fps))
      yield
    }
  }
}
