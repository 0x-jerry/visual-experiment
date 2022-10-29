<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { useOptionGUI } from '@/hooks'
import { drawFractal } from '@/canvas/fractal'
import { useFPSRunner } from '@/hooks/useFPSRunner'

// ______________

const option = useOptionGUI({
  length: 5,
  factor: 0.5,
  startAngle: 25,
  color: '#ccc',
  generation: {
    _: true,
    min: 0,
    max: 10,
    value: 6,
    step: 1,
  },
  redraw: () => reset(),
})

// -----------

const ctx = useCanvas()

const runner = useFPSRunner(() => {
  clear(ctx)
  return drawFractal(ctx, option.value)
})

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
