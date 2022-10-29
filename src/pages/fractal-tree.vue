<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { clear, useCanvas } from '@/canvas'
import { useOptionGUI } from '@/hooks'
import { drawFractal } from '@/canvas/fractal'
import { generatorRunner } from '@/utils'

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

const runner = generatorRunner(drawFractal)

const init = () => {
  const generator = drawFractal(ctx, option.value)
}

runner.emitter.on('done', () => {
  console.log('done')
})

async function reset() {
  clear(ctx)

  runner.restart(ctx, option.value)
}

onMounted(async () => {
  reset()
})

onUnmounted(async () => {
  await runner.pause()
})
</script>

<template>
  <Layout title="Fractal Tree">
    <div :ref="ctx.ref" class="w-full h-full"></div>
  </Layout>
</template>

<style lang="less" scoped></style>
