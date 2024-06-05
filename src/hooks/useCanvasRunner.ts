import { UseCanvasContext, useCanvas } from "@/canvas";
import { UseFPSRunnerOption, useFPSRunner } from "./useFPSRunner";
import { MaybeRefOrGetter } from "vue";
import { sleep } from "@0x-jerry/utils";

export interface UseCanvasRunnerOption extends UseFPSRunnerOption {
  delay?: MaybeRefOrGetter<number>
}

export function useCanvasRunner(fn: (ctx: UseCanvasContext) => any, opt?: UseCanvasRunnerOption) {
  const ctx = useCanvas()
  const runner = useFPSRunner(() => fn(ctx), opt)

  const visible = useElementVisibility(ctx.ref)

  const route = useRoute()

  onMounted(async () => {
    if (opt?.delay) {
      await sleep(toValue(opt.delay))
    }

    const autoStart = route.query.autoStart !== '0'
    if (autoStart) {
      runner.restart()
    }
  })


  watch(visible, () => {
    if (visible.value) {
      runner.resume()
    } else {
      runner.pause()
    }
  })

  useEventListener(ctx.ref, 'click', (e) => {
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
