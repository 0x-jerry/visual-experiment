import Stats from 'stats.js'
import type { Awaitable, Fn } from '@0x-jerry/utils'
import { isInIframe } from '@/utils'

export function useStats() {
  const stats = isInIframe ? null : new Stats()
  stats?.showPanel(0)

  onMounted(() => {
    if (stats) document.body.append(stats.dom)
  })

  onUnmounted(() => {
    stats?.dom.remove()
  })

  return (callback: () => Awaitable<any>) => {
    stats?.begin()
    const r = callback()

    if (r?.then) {
      r.then(() => {
        stats?.end()
      })
    } else {
      stats?.end()
    }

    return r
  }
}

export function useRafStats(callback: Fn) {
  const measure = useStats()

  const ctx = useRafFn(() => measure(callback), {
    immediate: false,
  })

  onMounted(() => {
    ctx.resume()
  })

  return ctx
}
