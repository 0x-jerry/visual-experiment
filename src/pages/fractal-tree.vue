<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear } from '@/canvas'
import { useCanvasRunner, useOptionGUI } from '@/hooks'
import { drawFractal } from '@/canvas/fractal'

// ______________

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

const runner = useCanvasRunner((ctx) => {
  clear(ctx)
  const _conf = option.value

  return drawFractal(ctx, _conf)
})

runner.emitter.on('done', () => {
  console.log('done')
})

async function reset() {
  runner.recreate()
}
</script>

<template>
  <Layout title="Fractal Tree">
    <div :ref="runner.ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
