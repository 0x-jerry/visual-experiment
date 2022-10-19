import type { Ref } from 'vue'

export function useCanvas(container: Ref<HTMLElement | undefined>) {
  const canvas = document.createElement('canvas')

  canvas.style.width = '100%'
  canvas.style.height = '100%'

  const ctx = canvas.getContext('2d')!

  onMounted(() => {
    const el = container.value
    if (!el) return

    canvas.width = el.clientWidth
    canvas.height = el.clientHeight

    el.appendChild(canvas)
  })

  onUnmounted(() => {
    canvas.remove()
  })

  return ctx
}
