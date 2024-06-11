import { type UseCanvasContext, useCanvas } from "@/canvas";
import { type UseFPSRunnerOption, useFPSRunner } from "./useFPSRunner";
import { sleep } from "@0x-jerry/utils";

export interface UseCanvasRunnerOption extends UseFPSRunnerOption {
}

export function useCanvasRunner(fn: (ctx: UseCanvasContext) => any, opt?: UseCanvasRunnerOption) {
  const ctx = useCanvas()
  const runner = useFPSRunner(() => fn(ctx), opt)

  const visible = useElementVisibility(ctx.ref)

  const route = useRoute()

  onMounted(async () => {
    const autoStart = route.query.autoStart !== '0'

    if (autoStart) {
      await runner.recreate()

      await sleep(500)

      if (visible.value) {
        runner.resume()
      }
    }
  })

  watch(visible, () => {
    if (visible.value) {
      runner.resume()
    } else {
      runner.pause()
    }
  })

  useEventListener(ctx.ref, 'click', async (e) => {
    if (!runner.status.started) {
      runner.restart()
    } else if (runner.status.paused) {
      runner.resume()
    } else {
      runner.pause()
    }
  })

  return {
    ...runner,
    ctx
  }
}
