import type { Ref } from 'vue'

export function useCanvas() {
  const container = ref<HTMLElement>()
  const canvas = document.createElement('canvas')

  canvas.style.width = '100%'
  canvas.style.height = '100%'

  const ctx = canvas.getContext('2d')! as UseCanvasContext

  ctx.ref = container

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

export interface UseCanvasContext extends CanvasRenderingContext2D {
  ref: Ref<HTMLElement | undefined>
}
