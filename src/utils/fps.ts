import { sleep } from '@0x-jerry/utils'
import { MaybeRef } from '@vueuse/core'

export async function fpsWrapper(fn: () => any, fps: MaybeRef<number> = 60) {
  const begin = Date.now()
  await fn()
  const end = Date.now()

  const rest = 1000 / unref(fps) - (end - begin)

  await sleep(rest > 0 ? rest : 0)
}
