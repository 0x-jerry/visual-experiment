<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { useOptionGUI } from '@/hooks'
import { drawFractal } from '@/canvas/fractal'
import { useFPSRunner } from '@/hooks/useFPSRunner'
import { useUrlSearchParams } from '@vueuse/core'

// ______________

const routePrams = useUrlSearchParams<{ iteration: string; length: string }>('hash')

const option = useOptionGUI({
  length: 5,
  factor: 0.5,
  startAngle: 25,
  color: '#cf1051',
  iteration: {
    _: true,
    min: 4,
    max: 10,
    value: 6,
    step: 1,
  },
  redraw: () => reset(),
})

// -----------

const ctx = useCanvas()

const runner = useFPSRunner(
  () => {
    clear(ctx)
    const _conf = option.value
    const opt = {
      ...option.value,
      iteration: +routePrams.iteration || _conf.iteration,
      length: +routePrams.length || _conf.length,
    }

    console.log(opt)
    return drawFractal(ctx, opt)
  },
  {
    delay: 100,
  },
)

runner.emitter.on('done', () => {
  console.log('done')
})

async function reset() {
  runner.restart()
}
</script>

<template>
  <Layout title="Fractal Tree">
    <div :ref="ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
